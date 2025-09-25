import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';

import { EditableList } from '@folio/stripes/smart-components';

import { UNIQUE_FIELD_KEY } from '../../constants';

const CREATE_BUTTON_LABEL = <FormattedMessage id="stripes-core.button.new" />;

const EditableListMemoized = memo(EditableList);

const ConsortiaEditableListComponent = ({
  actionSuppression,
  canCreate,
  columnMapping,
  contentData,
  fieldComponents,
  formatter,
  itemTemplate,
  label,
  onCreate,
  onDelete,
  onStatusChange,
  onUpdate,
  readOnlyFields,
  totalCount,
  validate,
  visibleFields,
}) => {
  return (
    <EditableListMemoized
      actionSuppression={actionSuppression}
      canCreate={canCreate}
      columnMapping={columnMapping}
      contentData={contentData}
      createButtonLabel={CREATE_BUTTON_LABEL}
      fieldComponents={fieldComponents}
      formatter={formatter}
      formType="final-form"
      itemTemplate={itemTemplate}
      label={label}
      onCreate={onCreate}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
      onSubmit={noop}
      onUpdate={onUpdate}
      readOnlyFields={readOnlyFields}
      totalCount={totalCount}
      uniqueField={UNIQUE_FIELD_KEY}
      validate={validate}
      visibleFields={visibleFields}
    />
  );
};

ConsortiaEditableListComponent.propTypes = {
  actionSuppression: PropTypes.shape({
    delete: PropTypes.func,
    edit: PropTypes.func,
  }),
  canCreate: PropTypes.bool,
  columnMapping: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  fieldComponents: PropTypes.object,
  formatter: PropTypes.object,
  label: PropTypes.string,
  itemTemplate: PropTypes.object,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onUpdate: PropTypes.func,
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  totalCount: PropTypes.number,
  validate: PropTypes.func,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
};

export const ConsortiaEditableList = memo(ConsortiaEditableListComponent);
