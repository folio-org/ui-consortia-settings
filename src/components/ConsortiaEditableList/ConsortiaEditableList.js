import {
  memo,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  noop,
} from 'lodash';

import { EditableList } from '@folio/stripes/smart-components';

import {
  UNIQUE_FIELD_KEY,
} from '../../constants';

const CREATE_BUTTON_LABEL = <FormattedMessage id="stripes-core.button.new" />;

const EditableListMemoized = memo(EditableList);

const ConsortiaEditableListComponent = ({
  label,
  contentData,
  totalCount,
  fieldComponents,
  itemTemplate,
  formatter,
  columnMapping,
  readOnlyFields,
  visibleFields,
  actionSuppression,
  canCreate,
  onCreate,
  onUpdate,
  onDelete,
  onStatusChange,
  validate,
}) => {
  return (
    <EditableListMemoized
      formType="final-form"
      label={label}
      createButtonLabel={CREATE_BUTTON_LABEL}
      contentData={contentData}
      totalCount={totalCount}
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
      onSubmit={noop}
      onStatusChange={onStatusChange}
      validate={validate}
      uniqueField={UNIQUE_FIELD_KEY}
    />
  );
};

ConsortiaEditableListComponent.propTypes = {
  label: PropTypes.string,
  contentData: PropTypes.arrayOf(PropTypes.object),
  totalCount: PropTypes.number,
  fieldComponents: PropTypes.object,
  itemTemplate: PropTypes.object,
  formatter: PropTypes.object,
  columnMapping: PropTypes.object,
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  actionSuppression: PropTypes.shape({
    delete: PropTypes.func,
    edit: PropTypes.func,
  }),
  canCreate: PropTypes.bool,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  validate: PropTypes.func,
};

export const ConsortiaEditableList = memo(ConsortiaEditableListComponent);
