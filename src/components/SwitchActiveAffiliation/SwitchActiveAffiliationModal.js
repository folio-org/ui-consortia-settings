import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
  Selection,
} from '@folio/stripes/components';

import css from './SwitchActiveAffiliationModal.css';

export const SwitchActiveAffiliationModal = ({
  activeAffiliation,
  dataOptions,
  isLoading,
  onChangeActiveAffiliation,
  onSubmit,
  open,
  toggle,
}) => {
  const modalFooter = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        id="save-active-affiliation"
        onClick={onSubmit}
        disabled={isLoading}
        marginBottom0
      >
        <FormattedMessage id="ui-consortia-settings.button.saveAndClose" />
      </Button>
      <Button
        onClick={toggle}
        marginBottom0
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      contentClass={css.modalContent}
      dismissible
      label={<FormattedMessage id="ui-consortia-settings.switchActiveAffiliation.modal.heading" />}
      open={open}
      onClose={toggle}
      size="small"
      footer={modalFooter}
    >
      <Selection
        autoFocus
        dataOptions={dataOptions}
        disabled={isLoading}
        id="consortium-affiliations-select"
        label={<FormattedMessage id="ui-consortia-settings.switchActiveAffiliation.modal.select.label" />}
        onChange={onChangeActiveAffiliation}
        value={activeAffiliation}
      />
    </Modal>
  );
};

SwitchActiveAffiliationModal.propTypes = {
  activeAffiliation: PropTypes.string.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  isLoading: PropTypes.bool,
  onChangeActiveAffiliation: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
