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
import { FormattedMessage } from 'react-intl';

import {
  Loading,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import { EditableList } from '@folio/stripes/smart-components';
import { useUsersBatch } from '@folio/stripes-acq-components';

import { translationsShape } from '../../shapes';
import { FieldSharedEntry } from './FieldSharedEntry';
import {
  useEntries,
  useEntryMutation,
} from './hooks';
import {
  ConfirmDeleteEntryModal,
  ItemInUseModal,
} from './modals';
import { renderLastUpdated } from './renderLastUpdated';

const PANESET_PREFIX = 'consortia-controlled-vocabulary-paneset-';

const DIALOG_TYPES = {
  confirmDelete: 'confirmDelete',
  itemInUse: 'itemInUse',
};

/**
 * Rejects with empty object.
 * Required to terminate execution of 'onCreate', 'onUpdate' and 'onDelete' handlers in the <EditableListForm>.
*/
// eslint-disable-next-line prefer-promise-reject-errors
const safeReject = () => Promise.reject({});

const DIALOGS_MAP = {
  // eslint-disable-next-line react/prop-types
  [DIALOG_TYPES.confirmDelete]: ({ resolve, reject, term, translations }) => (
    <ConfirmDeleteEntryModal
      open
      translations={translations}
      term={term}
      onConfirm={resolve}
      onCancel={reject}
    />
  ),
  // eslint-disable-next-line react/prop-types
  [DIALOG_TYPES.itemInUse]: ({ resolve, translations }) => (
    <ItemInUseModal
      open
      translations={translations}
      onConfirm={resolve}
    />
  ),
};

const EditableListMemoized = memo(EditableList);

export const ConsortiaControlledVocabulary = ({
  columnMapping: columnMappingProp,
  formatter: formatterProp,
  id,
  label,
  path,
  primaryField: primaryFieldProp,
  readOnlyFields: readOnlyFieldsProp,
  records,
  sortby: sortbyProp,
  translations,
  uniqueField,
  validate,
  visibleFields: visibleFieldsProp,
  ...props
}) => {
  const paneTitleRef = useRef();
  const [activeDialog, setActiveDialog] = useState(null);

  const panesetId = `${PANESET_PREFIX}${id}`;
  const primaryField = primaryFieldProp || visibleFieldsProp[0];
  const sortby = sortbyProp || primaryField;

  const {
    entries,
    totalRecords,
    isFetching: isEntriesFetching,
    refetch,
  } = useEntries({ path, records, sortby });

  const {
    createEntry,
    deleteEntry,
    updateEntry,
  } = useEntryMutation({ path });

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

  const onCreate = useCallback(async ({ shared, ...entry }) => {
    console.log('shared', shared);

    return createEntry({ entry }).then(refetch);
  }, [createEntry, refetch]);

  const onUpdate = useCallback(async ({ shared, ...entry }) => {
    console.log('shared', shared);

    return updateEntry({ entry }).then(refetch);
  }, [refetch, updateEntry]);

  const handleDeleteEntry = useCallback((entry) => {
    return deleteEntry({ entry })
      .then(refetch)
      .catch(() => (
        buildDialog({ type: DIALOG_TYPES.itemInUse })
          .then(safeReject)
      ));
  }, [buildDialog, deleteEntry, refetch]);

  const onDelete = useCallback((uniqueFieldValue) => {
    const entryToDelete = entries.find(entry => entry[uniqueField] === uniqueFieldValue);

    return buildDialog({ type: DIALOG_TYPES.confirmDelete }, { term: entryToDelete[primaryField] })
      .then(() => handleDeleteEntry(entryToDelete))
      .catch(safeReject);
  }, [buildDialog, entries, handleDeleteEntry, primaryField, uniqueField]);

  const fieldComponents = useMemo(() => ({
    shared: FieldSharedEntry,
  }), []);

  const formatter = useMemo(() => ({
    lastUpdated: ({ metadata }) => renderLastUpdated(metadata, users),
    shared: () => {
      // TODO: display 'All' or list of members
      return <>Members</>;
    },
    ...formatterProp,
  }), [formatterProp, users]);

  const columnMapping = useMemo(() => ({
    shared: <FormattedMessage id="ui-consortia-settings.consortiumManager.controlledVocab.column.memberLibraries" />,
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

  const isLoading = isEntriesFetching || isUsersLoading;

  return (
    <Paneset id={panesetId}>
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={label}
        paneTitleRef={paneTitleRef}
        id="consortia-controlled-vocabulary-pane"
      >
        {isLoading ? <Loading /> : (
          <EditableListMemoized
            formType="final-form"
            label={label}
            contentData={entries}
            totalCount={totalRecords}
            fieldComponents={fieldComponents}
            formatter={formatter}
            columnMapping={columnMapping}
            readOnlyFields={readOnlyFields}
            visibleFields={visibleFields}
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
  columnMapping: {},
  formatter: {},
  id: uniqueId(),
  readOnlyFields: [],
  uniqueField: 'id',
  validate: noop,
  visibleFields: [],
};

ConsortiaControlledVocabulary.propTypes = {
  columnMapping: PropTypes.object,
  formatter: PropTypes.object,
  id: PropTypes.string,
  label: PropTypes.string,
  path: PropTypes.string.isRequired,
  primaryField: PropTypes.string,
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  records: PropTypes.string.isRequired,
  sortby: PropTypes.string,
  translations: translationsShape.isRequired,
  uniqueField: PropTypes.string,
  validate: PropTypes.func,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
};
