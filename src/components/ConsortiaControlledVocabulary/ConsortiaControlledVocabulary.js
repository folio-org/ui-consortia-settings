import PropTypes from 'prop-types';
import {
  lowerCase,
  noop,
  omit,
  partition,
  uniq,
  uniqueId,
  upperFirst,
} from 'lodash';
import {
  useCallback,
  useEffect,
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
import {
  useShowCallout,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import {
  EVENT_EMITTER_EVENTS,
  UNIQUE_FIELD_KEY,
} from '../../constants';
import { useConsortiumManagerContext } from '../../contexts';
import { useEventEmitter } from '../../hooks';
import {
  useSettings,
  useSettingMutation,
  useSettingSharing,
} from '../../hooks/consortiumManager';
import { translationsShape } from '../../shapes';
import { ConsortiaEditableList } from '../ConsortiaEditableList';
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

const getMembersNamesString = (selectedMembers, members) => {
  return members.reduce((acc, { tenantId }) => {
    const memberName = selectedMembers.find(({ id: _id }) => tenantId === _id)?.name;

    acc.push(memberName);

    return acc;
  }, []).join(', ');
};

// Used in a translation to indicate a plural value.
const SHARED_MEMBERS_COUNT = Number.MAX_SAFE_INTEGER;

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
  itemTemplate,
}) => {
  const intl = useIntl();
  const paneTitleRef = useRef();
  const showCallout = useShowCallout();
  const stripes = useStripes();
  const eventEmitter = useEventEmitter();
  const [activeDialog, setActiveDialog] = useState(null);

  const {
    hasTenantPerm,
    permissionNamesMap,
    selectedMembers,
    isFetching: isContextDataFetching,
  } = useConsortiumManagerContext();

  useEffect(() => {
    return () => {
      eventEmitter.emit(EVENT_EMITTER_EVENTS.DISABLE_SELECT_MEMBERS, false);
    };
  }, [eventEmitter]);

  const panesetId = `${PANESET_PREFIX}${id}`;
  const primaryField = primaryFieldProp || visibleFieldsProp[0];
  const sortby = sortbyProp || primaryField;
  const allMembersLabel = intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.all' });

  const onStatusChange = useCallback((_prevStatus, currStatus) => {
    const isEditing = currStatus.some(({ editing }) => Boolean(editing));

    eventEmitter.emit(EVENT_EMITTER_EVENTS.DISABLE_SELECT_MEMBERS, isEditing);
  }, [eventEmitter]);

  const handleSettingsLoading = useCallback(({ errors }) => {
    if (errors?.length) {
      const [forbiddenMembers, otherErrors] = partition(errors, ({ response }) => response?.startsWith('403'));

      if (forbiddenMembers.length) {
        showForbiddenMembersCallout(
          showCallout,
          getMembersNamesString(selectedMembers, forbiddenMembers),
        );
      }

      if (otherErrors.length) {
        showCallout({
          message: otherErrors.map(({ response }) => response),
          type: 'error',
        });
      }
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
        // Validate settings uniqueness in scope of consortium
        const uniqueFieldsErrors = uniqueFields.reduce((_acc, field) => {
          const errorMessage = (
            <FormattedMessage
              id="ui-consortia-settings.validation.error.entry.duplicate"
              values={{ field: upperFirst(lowerCase(field)) }}
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

          if (error) _acc[field] = error;

          return _acc;
        }, {});

        const itemErrors = Object.assign(
          Object.fromEntries(
            Object.entries(validate(item, index, items, entries) || {}).filter(([, value]) => Boolean(value)),
          ),
          uniqueFieldsErrors,
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
      : hasTenantPerm(item.tenantId, perms);
  }, [hasTenantPerm, stripes]);

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

  const handleResolvedActionResults = useCallback(({
    actionType,
    entry,
    results,
  }) => {
    const { publicationErrors, publicationResults } = results;

    // Publish coordinator response might be successful for some tenants and failed for others.
    if (publicationErrors?.length) {
      const translationKeysMap = {
        [ACTION_TYPES.create]: ['termCreated', 'create'],
        [ACTION_TYPES.update]: ['termUpdated', 'update'],
        [ACTION_TYPES.delete]: ['termDeleted', 'delete'],
      };
      const [partialSuccessKey, partialFailureKey] = translationKeysMap[actionType];
      const term = entry[primaryField];
      const processedMembers = getMembersNamesString(selectedMembers, publicationResults);
      const message = (
        <span>
          <FormattedMessage
            tagName="p"
            id={`ui-consortia-settings.consortiumManager.error.publishCoordinator.partialFailure.${partialFailureKey}`}
            values={{ term, members: getMembersNamesString(selectedMembers, publicationErrors) }}
          />
          {Boolean(publicationResults.length) && (
            <FormattedMessage
              tagName="p"
              id={`ui-consortia-settings.consortiumManager.controlledVocab.common.${partialSuccessKey}`}
              values={{
                term,
                members: processedMembers,
                count: processedMembers.length,
              }}
            />
          )}
        </span>
      );

      showCallout({ message, type: 'error' });
    } else {
      showSuccessCallout({ actionType, entry });
    }
  }, [primaryField, selectedMembers, showCallout, showSuccessCallout]);

  const onShare = useCallback((entryToShare) => {
    const initEntryValue = entries.find(_entry => _entry[UNIQUE_FIELD_KEY] === entryToShare[UNIQUE_FIELD_KEY]);
    const entry = dehydrateEntry(omit(entryToShare, 'tenantId'));

    if (initEntryValue?.shared) return upsertSharedSetting({ entry });

    return buildDialog({ type: DIALOG_TYPES.confirmShare }, { term: entry[primaryField] })
      .then(() => upsertSharedSetting({ entry }));
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
      },
    ).then(() => {
      return createEntry({
        entry,
        tenants: selectedMembers.map(({ id: _id }) => _id),
      });
    });
  }, [buildDialog, createEntry, permissionNamesMap, permissions, primaryField, selectedMembers, showCallout]);

  const onCreate = useCallback(async (hydratedEntry) => {
    const entry = dehydrateEntry(hydratedEntry);
    const createPromise = hydratedEntry.shared
      ? onShare(entry)
      : handleCreateEntry({ entry });

    return createPromise.then((results) => {
      handleResolvedActionResults({
        actionType: ACTION_TYPES.create,
        entry: hydratedEntry,
        results,
      });
    })
      .then(refetch)
      .finally(() => eventEmitter.emit(EVENT_EMITTER_EVENTS.DISABLE_SELECT_MEMBERS, false))
      .catch(skipAborted);
  }, [eventEmitter, onShare, handleCreateEntry, handleResolvedActionResults, refetch]);

  const onUpdate = useCallback(async (hydratedEntry) => {
    const entry = dehydrateEntry(hydratedEntry);
    const updatePromise = hydratedEntry.shared
      ? onShare(entry)
      : updateEntry({ entry });

    return updatePromise.then((results) => {
      handleResolvedActionResults({
        actionType: ACTION_TYPES.update,
        entry: hydratedEntry,
        results,
      });
    })
      .then(refetch)
      .finally(() => eventEmitter.emit(EVENT_EMITTER_EVENTS.DISABLE_SELECT_MEMBERS, false))
      .catch(skipAborted);
  }, [eventEmitter, handleResolvedActionResults, onShare, refetch, updateEntry]);

  const handleDeleteEntry = useCallback((hydratedEntry) => {
    const entry = dehydrateEntry(hydratedEntry);
    const deleteHandler = hydratedEntry.shared ? deleteSharedSetting : deleteEntry;

    return deleteHandler({ entry })
      .then((results) => {
        handleResolvedActionResults({
          actionType: ACTION_TYPES.delete,
          entry,
          results,
        });
      })
      .then(refetch)
      .catch(() => buildDialog({ type: DIALOG_TYPES.itemInUse }));
  }, [buildDialog, deleteEntry, deleteSharedSetting, handleResolvedActionResults, refetch]);

  const onDelete = useCallback((uniqueFieldValue) => {
    const entryToDelete = entries.find(entry => entry[UNIQUE_FIELD_KEY] === uniqueFieldValue);

    return buildDialog({ type: DIALOG_TYPES.confirmDelete }, { term: entryToDelete[primaryField] })
      .then(() => handleDeleteEntry(entryToDelete));
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
          <ConsortiaEditableList
            label={label}
            contentData={entries}
            totalCount={totalRecords}
            fieldComponents={fieldComponents}
            itemTemplate={itemTemplate}
            formatter={formatter}
            columnMapping={columnMapping}
            readOnlyFields={readOnlyFields}
            visibleFields={visibleFields}
            actionSuppression={actionSuppression}
            canCreate={canCreate}
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            validate={validateSync}
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
  itemTemplate: PropTypes.object,
};
