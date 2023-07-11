import PropTypes from 'prop-types';

import { HasCommand, Layer } from '@folio/stripes/components';

import { PermissionSetForm } from '../../../../../../../temp';

export const PermissionSetsCreate = ({
  onSave,
  onCancel,
  intl,
  stripes,
}) => {
  const keyboardCommands = [
    {
      name: 'cancel',
      handler: onCancel,
      shortcut: 'esc',
    },
  ];

  return (
    <HasCommand
      commands={keyboardCommands}
      scope={document.body}
    >
      <Layer isOpen inRootSet contentLabel="permission-sets-create">
        <PermissionSetForm
          intl={intl}
          stripes={stripes}
          onSubmit={onSave}
          onCancel={onCancel}
        />
      </Layer>
    </HasCommand>
  );
};

PermissionSetsCreate.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};