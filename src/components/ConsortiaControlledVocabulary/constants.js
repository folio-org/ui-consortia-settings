import {
  ConfirmCreateEntryModal,
  ConfirmDeleteEntryModal,
  ConfirmShareEntryModal,
  ItemInUseModal,
} from './modals';

export const ACTION_TYPES = {
  create: 'create',
  delete: 'delete',
  update: 'update',
};

export const TRANSLATION_KEYS_MAP = {
  [ACTION_TYPES.create]: 'termCreated',
  [ACTION_TYPES.delete]: 'termDeleted',
  [ACTION_TYPES.update]: 'termUpdated',
};

export const PANESET_PREFIX = 'consortia-controlled-vocabulary-paneset-';

export const DIALOG_TYPES = {
  confirmCreate: 'confirmCreate',
  confirmDelete: 'confirmDelete',
  confirmShare: 'confirmShare',
  itemInUse: 'itemInUse',
};

export const DIALOGS_MAP = {
  // eslint-disable-next-line react/prop-types
  [DIALOG_TYPES.confirmCreate]: ({ members, resolve, reject, term }) => (
    <ConfirmCreateEntryModal
      open
      members={members}
      term={term}
      onConfirm={resolve}
      onCancel={reject}
    />
  ),
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
  [DIALOG_TYPES.itemInUse]: ({ reject, translations }) => (
    <ItemInUseModal
      open
      translations={translations}
      onConfirm={reject}
    />
  ),
  // eslint-disable-next-line react/prop-types
  [DIALOG_TYPES.confirmShare]: ({ resolve, reject, term }) => (
    <ConfirmShareEntryModal
      open
      term={term}
      onConfirm={resolve}
      onCancel={reject}
    />
  ),
};
