import PropTypes from 'prop-types';
import {
  noop,
  uniqueId,
} from 'lodash';
import {
  useCallback,
  useLayoutEffect,
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

import { translationsShape } from '../../shapes';
import {
  useEntries,
  useEntryMutation,
} from './hooks';
import {
  ConfirmDeleteEntryModal,
  ItemInUseModal,
} from './modals';

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

export const ConsortiaControlledVolabulary = ({
  columnMapping,
  id,
  label,
  translations,
  path,
  primaryField: primaryFieldProp,
  records,
  sortby: sortbyProp,
  uniqueField,
  validate,
  visibleFields,
  ...props
}) => {
  const paneTitleRef = useRef();
  const [activeDialog, setActiveDialog] = useState(null);

  const panesetId = `${PANESET_PREFIX}${id}`;
  const primaryField = primaryFieldProp || visibleFields[0];
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
    isLoading: isEntryMutating,
  } = useEntryMutation({ path });

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
          itemErrors[primaryField] =
            <FormattedMessage id="stripes-core.label.missingRequiredField" />;
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

  const onCreate = useCallback(async (entry) => {
    // async validation here

    return createEntry({ entry }).then(refetch);
  }, [createEntry, refetch]);

  const onUpdate = useCallback(async (entry) => {
    // async validation here

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

  return (
    <Paneset id={panesetId}>
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={label}
        paneTitleRef={paneTitleRef}
        id="consortia-controlled-vocabulary-pane"
      >
        {isEntriesFetching ? <Loading /> : (
          <EditableList
            formType="final-form"
            loading={isEntryMutating}
            label={label}
            contentData={entries}
            totalCount={totalRecords}
            visibleFields={visibleFields}
            columnMapping={columnMapping}
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

ConsortiaControlledVolabulary.defaultProps = {
  id: uniqueId(),
  uniqueField: 'id',
  validate: noop,
};

ConsortiaControlledVolabulary.propTypes = {
  columnMapping: PropTypes.object,
  id: PropTypes.string,
  label: PropTypes.string,
  path: PropTypes.string.isRequired,
  primaryField: PropTypes.string,
  records: PropTypes.string.isRequired,
  sortby: PropTypes.string,
  translations: translationsShape.isRequired,
  uniqueField: PropTypes.string,
  validate: PropTypes.func,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
};
