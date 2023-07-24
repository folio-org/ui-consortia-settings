import PropTypes from 'prop-types';
import {
  noop,
  uniq,
  uniqueId,
} from 'lodash';
import {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Loading,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import { EditableList } from '@folio/stripes/smart-components';
import {
  useShowCallout,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import { useConsortiumManagerContext } from '../../contexts';
import {
  useSettings,
  useSettingMutation,
} from '../../hooks/consortiumManager';
import { translationsShape } from '../../shapes';
import {
  ACTION_TYPES,
  DIALOG_TYPES,
  DIALOGS_MAP,
  PANESET_PREFIX,
  TRANSLATION_KEYS_MAP,
} from './constants';
import { FieldSharedEntry } from './FieldSharedEntry';
import { renderLastUpdated } from './renderLastUpdated';

/**
 * Rejects with empty object.
 * Required to terminate execution of 'onCreate', 'onUpdate' and 'onDelete' handlers in the <EditableListForm>.
*/
// eslint-disable-next-line prefer-promise-reject-errors
const safeReject = () => Promise.reject({});

const skipAborted = (error) => {
  if (!error?.aborted) {
    throw error;
  }
};

const CREATE_BUTTON_LABEL = <FormattedMessage id="stripes-core.button.new" />;

const EditableListMemoized = memo(EditableList);

export const ConsortiaControlledVocabulary = ({
  actionProps: actionPropsProp,
  columnMapping: columnMappingProp,
  fieldComponents: fieldComponentsProp,
  firstMenu,
  formatter: formatterProp,
  id,
  isLoading: isLoadingProp,
  label,
  path,
  primaryField: primaryFieldProp,
  readOnlyFields: readOnlyFieldsProp,
  records,
  sortby: sortbyProp,
  squashSharedSetting,
  translations,
  uniqueField,
  validate,
  visibleFields: visibleFieldsProp,
  ...props
}) => {
  const intl = useIntl();
  const paneTitleRef = useRef();
  const showCallout = useShowCallout();
  const [activeDialog, setActiveDialog] = useState(null);
  const { selectedMembers } = useConsortiumManagerContext();

  const panesetId = `${PANESET_PREFIX}${id}`;
  const primaryField = primaryFieldProp || visibleFieldsProp[0];
  const sortby = sortbyProp || primaryField;
  const allMembersLabel = intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.all' });

  const {
    entries,
    totalRecords,
    isFetching: isEntriesFetching,
    refetch,
  } = useSettings({
    path,
    records,
    sortby,
    squashSharedSetting,
  });

  const {
    createEntry,
    deleteEntry,
    updateEntry,
  } = useSettingMutation({ path });

  const userIds = useMemo(() => uniq(
    entries
      .map(({ metadata }) => metadata?.updatedByUserId)
      .filter(Boolean),
  ), [entries]);

  const {
    users,
    isLoading: isUsersLoading,
  } = useUsersBatch(userIds);

  useLayoutEffect(() => {
    if (paneTitleRef.current?.focus) paneTitleRef.current.focus();
  }, []);

  const validateSync = useCallback(({ items }) => {
    if (Array.isArray(items)) {
      const errors = items.reduce((acc, item, index) => {
        const itemErrors = Object.fromEntries(
          Object.entries(validate(item, index, items) || {}).filter(([, value]) => Boolean(value)),
        );

        // Check if the primary field has had data entered into it.
        if (!item[primaryField]) {
          itemErrors[primaryField] = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
        }

        // Add the errors if we found any for this record.
        if (itemErrors && Object.keys(itemErrors).length) {
          acc[index] = itemErrors;
        }

        return acc;
      }, []);

      if (errors.length) {
        return { items: errors };
      }
    }

    return {};
  }, [primaryField, validate]);

  const buildDialog = useCallback(({ type }, properties = {}) => {
    return new Promise((resolve, reject) => {
      const Dialog = DIALOGS_MAP[type]({
        resolve,
        reject,
        translations,
        ...properties,
      });

      setActiveDialog(Dialog);
    }).finally(setActiveDialog);
  }, [translations]);

  const showSuccessCallout = useCallback(({ actionType, entry }) => {
    const translationKey = TRANSLATION_KEYS_MAP[actionType];

    const getLocalTenantName = () => [selectedMembers?.find(({ id: _id }) => entry.tenantId === _id)?.name];

    const membersGetters = {
      [ACTION_TYPES.create]: () => selectedMembers.map(({ name }) => name),
      [ACTION_TYPES.delete]: getLocalTenantName,
      [ACTION_TYPES.update]: getLocalTenantName,
    };

    const members = entry.shared
      ? [allMembersLabel]
      : membersGetters[actionType]();

    return showCallout({
      messageId: translations[translationKey] || `ui-consortia-settings.consortiumManager.controlledVocab.common.${translationKey}`,
      values: {
        count: members.length,
        members: members.join(', '),
        term: entry[primaryField],
      },
    });
  }, [allMembersLabel, primaryField, selectedMembers, showCallout, translations]);

  const onCreate = useCallback(async (entry) => {
    return createEntry({
      entry,
      tenants: selectedMembers.map(({ id: _id }) => _id),
    })
      .then(() => {
        showSuccessCallout({
          actionType: ACTION_TYPES.create,
          entry,
        });
      })
      .then(refetch)
      .catch(skipAborted);
  }, [createEntry, refetch, selectedMembers, showSuccessCallout]);

  const onUpdate = useCallback(async (entry) => {
    return updateEntry({ entry })
      .then(() => {
        showSuccessCallout({
          actionType: ACTION_TYPES.update,
          entry,
        });
      })
      .then(refetch)
      .catch(skipAborted);
  }, [refetch, showSuccessCallout, updateEntry]);

  const handleDeleteEntry = useCallback((entry) => {
    return deleteEntry({ entry })
      .then(() => {
        showSuccessCallout({
          actionType: ACTION_TYPES.delete,
          entry,
        });
      })
      .then(refetch)
      .catch(() => (
        buildDialog({ type: DIALOG_TYPES.itemInUse })
          .then(safeReject)
      ));
  }, [buildDialog, deleteEntry, refetch, showSuccessCallout]);

  const onDelete = useCallback((uniqueFieldValue) => {
    const entryToDelete = entries.find(entry => entry[uniqueField] === uniqueFieldValue);

    return buildDialog({ type: DIALOG_TYPES.confirmDelete }, { term: entryToDelete[primaryField] })
      .then(() => handleDeleteEntry(entryToDelete))
      .catch(safeReject);
  }, [buildDialog, entries, handleDeleteEntry, primaryField, uniqueField]);

  const fieldComponents = useMemo(() => ({
    ...fieldComponentsProp,
    shared: FieldSharedEntry,
  }), [fieldComponentsProp]);

  const formatter = useMemo(() => ({
    lastUpdated: ({ metadata }) => renderLastUpdated(metadata, users),
    shared: ({ tenantId, shared }) => (
      shared ? allMembersLabel : selectedMembers?.find(({ id: _id }) => _id === tenantId)?.name
    ),
    ...formatterProp,
  }), [allMembersLabel, formatterProp, selectedMembers, users]);

  const columnMapping = useMemo(() => ({
    shared: <FormattedMessage id="ui-consortia-settings.consortiumManager.controlledVocab.column.memberLibraries" />,
    lastUpdated: <FormattedMessage id="stripes-smart-components.cv.lastUpdated" />,
    ...columnMappingProp,
  }), [columnMappingProp]);

  const readOnlyFields = useMemo(() => [
    ...readOnlyFieldsProp,
    'lastUpdated',
    'numberOfObjects',
  ], [readOnlyFieldsProp]);

  const visibleFields = useMemo(() => [
    ...visibleFieldsProp,
    'shared',
  ], [visibleFieldsProp]);

  const actionProps = useMemo(() => ({
    ...actionPropsProp,
    create: (...args) => ({
      ...(actionPropsProp.create?.(...args) || {}),
      disabled: !selectedMembers?.length,
    }),
  }), [actionPropsProp, selectedMembers?.length]);

  const isLoading = isLoadingProp || isEntriesFetching || isUsersLoading;

  return (
    <Paneset id={panesetId}>
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        firstMenu={firstMenu}
        paneTitle={label}
        paneTitleRef={paneTitleRef}
        id="consortia-controlled-vocabulary-pane"
      >
        {isLoading ? <Loading /> : (
          <EditableListMemoized
            formType="final-form"
            label={label}
            createButtonLabel={CREATE_BUTTON_LABEL}
            contentData={entries}
            totalCount={totalRecords}
            fieldComponents={fieldComponents}
            formatter={formatter}
            columnMapping={columnMapping}
            readOnlyFields={readOnlyFields}
            visibleFields={visibleFields}
            actionProps={actionProps}
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onSubmit={noop}
            validate={validateSync}
            {...props}
          />
        )}
        {activeDialog}
      </Pane>
    </Paneset>
  );
};

ConsortiaControlledVocabulary.defaultProps = {
  actionProps: {},
  columnMapping: {},
  fieldComponents: {},
  formatter: {},
  id: uniqueId(),
  readOnlyFields: [],
  uniqueField: 'id',
  validate: noop,
  visibleFields: [],
};

ConsortiaControlledVocabulary.propTypes = {
  actionProps: PropTypes.shape({
    cancel: PropTypes.func,
    create: PropTypes.func,
    delete: PropTypes.func,
    edit: PropTypes.func,
    save: PropTypes.func,
  }),
  columnMapping: PropTypes.object,
  fieldComponents: PropTypes.object,
  firstMenu: PropTypes.element,
  formatter: PropTypes.object,
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  path: PropTypes.string.isRequired,
  primaryField: PropTypes.string,
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  records: PropTypes.string.isRequired,
  sortby: PropTypes.string,
  squashSharedSetting: PropTypes.func,
  translations: translationsShape.isRequired,
  uniqueField: PropTypes.string,
  validate: PropTypes.func,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
};
