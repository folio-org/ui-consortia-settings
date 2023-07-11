import PropTypes from 'prop-types';

import { HasCommand, Layer, Loading } from '@folio/stripes/components';

import { PermissionSetForm } from '../../../../../../../temp';

export const PermissionSetsEdit = ({
  onCancel,
  onRemove,
  onSave,
  intl,
  initialValues,
  isLoading,
  stripes,
}) => {
  const keyboardCommands = [
    {
      name: 'cancel',
      handler: onCancel,
      shortcut: 'esc',
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

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
          onRemove={onRemove}
          initialValues={initialValues}
        />
      </Layer>
    </HasCommand>
  );
};

PermissionSetsEdit.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
};
