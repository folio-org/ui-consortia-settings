import PropTypes from 'prop-types';
import {
  noop,
  omit,
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

import { useStripes } from '@folio/stripes/core';
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

import { UNIQUE_FIELD_KEY } from '../../constants';
import { useConsortiumManagerContext } from '../../contexts';
import {
  useSettings,
  useSettingMutation,
  useSettingSharing,
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
import { validateUniqueness } from './validators';

const dehydrateEntry = (entry) => omit(entry, ['shared', UNIQUE_FIELD_KEY]);

const skipAborted = (error) => {
  if (!error?.aborted) {
    throw error;
  }
};

const showForbiddenMembersCallout = (callout, members) => {
  callout({
    messageId: 'ui-consortia-settings.consortiumManager.error.forbiddenMembers',
    type: 'error',
    values: { members },
  });
};

const CREATE_BUTTON_LABEL = <FormattedMessage id="stripes-core.button.new" />;
// Used in a translation to indicate a plural value.
const SHARED_MEMBERS_COUNT = Number.MAX_SAFE_INTEGER;

const EditableListMemoized = memo(EditableList);

export const ConsortiaControlledVocabulary = ({
  actionSuppression: actionSuppressionProp,
  canCreate: canCreateProp,
  columnMapping: columnMappingProp,
  fieldComponents: fieldComponentsProp,
  firstMenu,
  formatter: formatterProp,
  id,
  isLoading: isLoadingProp,
  label,
  path,
  permissions,
  primaryField: primaryFieldProp,
  readOnlyFields: readOnlyFieldsProp,
  records,
  sortby: sortbyProp,
  squashSharedSetting,
  translations,
  uniqueFields,
  validate,
  visibleFields: visibleFieldsProp,
  ...props
}) => {
  const intl = useIntl();
  const paneTitleRef = useRef();
  const showCallout = useShowCallout();
  const stripes = useStripes();
  const [activeDialog, setActiveDialog] = useState(null);

  const {
    hasPerm,
    permissionNamesMap,
    selectedMembers,
    isFetching: isContextDataFetching,
  } = useConsortiumManagerContext();

  const panesetId = `${PANESET_PREFIX}${id}`;
  const primaryField = primaryFieldProp || visibleFieldsProp[0];
  const sortby = sortbyProp || primaryField;
  const allMembersLabel = intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.all' });

  const handleSettingsLoading = useCallback(({ errors }) => {
    if (errors?.length) {
      const forbiddenMembers = errors.filter(({ response }) => response?.startsWith('403'));

      if (forbiddenMembers.length) {
        const members = forbiddenMembers.reduce((acc, { tenantId }) => {
          const memberName = selectedMembers.find(({ id: _id }) => tenantId === _id)?.name;

          acc.push(memberName);

          return acc;
        }, []).join(', ');

        return showForbiddenMembersCallout(showCallout, members);
      }

      // TODO: handle other errors

      return showCallout({
        message: errors.map(({ response }) => response),
        type: 'error',
      })
    }
  }, [selectedMembers, showCallout]);

  const {
    entries,
    totalRecords,
    isFetching: isEntriesFetching,
    refetch,
  } = useSettings(
    {
      path,
      records,
      sortby,
      squashSharedSetting,
    },
    {
      onSuccess: handleSettingsLoading,
    },
  );

  const {
    createEntry,
    deleteEntry,
    updateEntry,
  } = useSettingMutation({ path });

  const {
    deleteSharedSetting,
    upsertSharedSetting,
  } = useSettingSharing({ path });

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
          Object.entries(validate(item, index, items, entries) || {}).filter(([, value]) => Boolean(value)),
        );

        // Validate settings uniqueness in scope of consortium
        uniqueFields.forEach(field => {
          const errorMessage = (
            <FormattedMessage
              id="ui-consortia-settings.validation.error.entry.duplicate"
              values={{ field: columnMapping[field] || field }}
            />
          );
          const error = validateUniqueness({
            index,
            item,
            items,
            field,
            initialValues: entries,
            message: errorMessage,
          });

          itemErrors[field] = error;
        })

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
  }, [entries, primaryField, uniqueFields, validate]);

  const buildDialog = useCallback(({ type }, properties = {}) => {
    return new Promise((resolve) => {
      const Dialog = DIALOGS_MAP[type]({
        resolve,
        reject: () => setActiveDialog(null),
        translations,
        ...properties,
      });

      setActiveDialog(Dialog);
    }).finally(setActiveDialog);
  }, [translations]);

  const hasRequiredPerms = useCallback((item, perms) => {
    return item.shared
      ? stripes.hasPerm('ui-consortia-settings.consortium-manager.share')
      : hasPerm(item.tenantId, perms);
  }, [hasPerm, stripes]);

  const showSuccessCallout = useCallback(({ actionType, entry }) => {
    const translationKey = TRANSLATION_KEYS_MAP[actionType];

    const getSeletedMembersNames = () => selectedMembers.map(({ name }) => name);
    const getLocalTenantName = () => [selectedMembers?.find(({ id: _id }) => entry.tenantId === _id)?.name];

    const membersGetters = {
      [ACTION_TYPES.create]: getSeletedMembersNames,
      [ACTION_TYPES.delete]: getLocalTenantName,
      [ACTION_TYPES.update]: getLocalTenantName,
    };

    const members = entry.shared
      ? [allMembersLabel]
      : membersGetters[actionType]();

    return showCallout({
      messageId: translations[translationKey] || `ui-consortia-settings.consortiumManager.controlledVocab.common.${translationKey}`,
      values: {
        count: entry.shared ? SHARED_MEMBERS_COUNT : members.length,
        members: members.join(', '),
        term: entry[primaryField],
      },
    });
  }, [allMembersLabel, primaryField, selectedMembers, showCallout, translations]);

  const onShare = useCallback((entryToShare) => {
    const initEntryValue = entries.find(_entry => _entry[UNIQUE_FIELD_KEY] === entryToShare[UNIQUE_FIELD_KEY]);
    const entry = dehydrateEntry(omit(entryToShare, 'tenantId'));

    if (initEntryValue?.shared) return upsertSharedSetting({ entry });

    return buildDialog({ type: DIALOG_TYPES.confirmShare }, { term: entry[primaryField] })
      .then(() => upsertSharedSetting({ entry }))
  }, [buildDialog, entries, primaryField, upsertSharedSetting]);

  const handleCreateEntry = useCallback(({ entry }) => {
    const forbiddenMembers = selectedMembers
      .filter(({ id: tenantId }) => {
        return !permissionNamesMap[tenantId]?.[permissions[ACTION_TYPES.create]];
      })
      .map(({ name }) => name)
      .join(', ');

    if (forbiddenMembers.length) {
      return showForbiddenMembersCallout(showCallout, forbiddenMembers);
    }

    return buildDialog(
      { type: DIALOG_TYPES.confirmCreate },
      {
        term: entry[primaryField],
        members: selectedMembers.map(({ name }) => name),
      }
    ).then(() => {
      return createEntry({
        entry,
        tenants: selectedMembers.map(({ id: _id }) => _id),
      })
    });
  }, [createEntry, hasPerm, permissionNamesMap, permissions, primaryField, selectedMembers, showCallout]);

  const onCreate = useCallback(async (hydratedEntry) => {
    const entry = dehydrateEntry(hydratedEntry);
    const createPromise = hydratedEntry.shared
      ? onShare(entry)
      : handleCreateEntry({ entry });

    return createPromise.then(() => {
      showSuccessCallout({
        actionType: ACTION_TYPES.create,
        entry: hydratedEntry,
      });
    })
      .then(refetch)
      .catch(skipAborted);
  }, [onShare, handleCreateEntry, refetch, showSuccessCallout]);

  const onUpdate = useCallback(async (hydratedEntry) => {
    const entry = dehydrateEntry(hydratedEntry);
    const updatePromise = hydratedEntry.shared
      ? onShare(entry)
      : updateEntry({ entry });

    return updatePromise.then(() => {
      showSuccessCallout({
        actionType: ACTION_TYPES.update,
        entry: hydratedEntry,
      });
    })
      .then(refetch)
      .catch(skipAborted);
  }, [onShare, refetch, showSuccessCallout, updateEntry]);

  const handleDeleteEntry = useCallback((hydratedEntry) => {
    const entry = dehydrateEntry(hydratedEntry);
    const deletePromise = hydratedEntry.shared
      ? deleteSharedSetting({ entry })
      : deleteEntry({ entry });

    return deletePromise.then(() => {
      showSuccessCallout({
        actionType: ACTION_TYPES.delete,
        entry,
      });
    })
      .then(refetch)
      .catch(() => buildDialog({ type: DIALOG_TYPES.itemInUse }));
  }, [buildDialog, deleteEntry, deleteSharedSetting, refetch, showSuccessCallout]);

  const onDelete = useCallback((uniqueFieldValue) => {
    const entryToDelete = entries.find(entry => entry[UNIQUE_FIELD_KEY] === uniqueFieldValue);

    return buildDialog({ type: DIALOG_TYPES.confirmDelete }, { term: entryToDelete[primaryField] })
      .then(() => handleDeleteEntry(entryToDelete))
  }, [buildDialog, entries, handleDeleteEntry, primaryField]);

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

  const canCreate = Boolean(selectedMembers?.length && canCreateProp);

  const actionSuppression = useMemo(() => ({
    delete: (item) => actionSuppressionProp.delete(item) || !hasRequiredPerms(item, permissions[ACTION_TYPES.delete]),
    edit: (item) => actionSuppressionProp.edit(item) || !hasRequiredPerms(item, permissions[ACTION_TYPES.update]),
  }), [actionSuppressionProp, hasRequiredPerms, permissions]);

  const isLoading = (
    isLoadingProp
    || isEntriesFetching
    || isUsersLoading
    || isContextDataFetching
  );

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
            actionSuppression={actionSuppression}
            canCreate={canCreate}
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onSubmit={noop}
            validate={validateSync}
            {...props}
            uniqueField={UNIQUE_FIELD_KEY}
          />
        )}
        {activeDialog}
      </Pane>
    </Paneset>
  );
};

ConsortiaControlledVocabulary.defaultProps = {
  actionSuppression: {
    delete: () => false,
    edit: () => false,
  },
  canCreate: true,
  columnMapping: {},
  fieldComponents: {},
  formatter: {},
  id: uniqueId(),
  readOnlyFields: [],
  uniqueFields: [],
  validate: noop,
  visibleFields: [],
};

ConsortiaControlledVocabulary.propTypes = {
  actionSuppression: PropTypes.shape({
    delete: PropTypes.func,
    edit: PropTypes.func,
  }),
  canCreate: PropTypes.bool,
  columnMapping: PropTypes.object,
  fieldComponents: PropTypes.object,
  firstMenu: PropTypes.element,
  formatter: PropTypes.object,
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  path: PropTypes.string.isRequired,
  permissions: PropTypes.shape({
    create: PropTypes.string.isRequired,
    delete: PropTypes.string.isRequired,
    update: PropTypes.string.isRequired,
  }).isRequired,
  primaryField: PropTypes.string,
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  records: PropTypes.string.isRequired,
  sortby: PropTypes.string,
  squashSharedSetting: PropTypes.func,
  translations: translationsShape.isRequired,
  uniqueFields: PropTypes.arrayOf(PropTypes.string),
  validate: PropTypes.func,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
};
