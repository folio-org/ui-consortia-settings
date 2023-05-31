import contains from 'dom-helpers/query/contains';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { useToggle } from '@folio/stripes-acq-components';

import { FindConsortiumMemberModal } from './FindConsortiumMemberModal';

export const FindConsortiumMember = ({
  disabled,
  onClose,
  selectRecords,
  renderTrigger,
  trigerless,
  ...props
}) => {
  const triggerRef = useRef();
  const modalRef = useRef();
  const [isModalOpen, toggleModal] = useToggle(trigerless);

  const onCloseModal = useCallback(() => {
    if (
      modalRef.current
      && triggerRef.current
      && contains(modalRef.current, document.activeElement)
    ) {
      triggerRef.current.focus();
    }

    toggleModal();
    onClose();
  }, [onClose, toggleModal]);

  const onSave = useCallback(async (members) => {
    await selectRecords(members);
    toggleModal();
  }, [selectRecords, toggleModal]);

  const renderDefaultTrigger = useCallback(({ buttonRef, onClick }) => (
    <Button
      ref={buttonRef}
      disabled={disabled}
      buttonStyle="primary"
      onClick={onClick}
      marginBottom0
    >
      <FormattedMessage id="ui-consortia-settings.consortiumManager.findMember.trigger.label" />
    </Button>
  ), [disabled]);

  const renderTriggerButton = useCallback(() => (
    (renderTrigger || renderDefaultTrigger)({
      buttonRef: triggerRef,
      onClick: toggleModal,
    })
  ), [renderDefaultTrigger, renderTrigger, toggleModal]);

  return (
    <>
      {!trigerless && renderTriggerButton()}
      {isModalOpen && (
        <FindConsortiumMemberModal
          onClose={onCloseModal}
          onSave={onSave}
          {...props}
        />
      )}
    </>
  );
};

FindConsortiumMember.defaultProps = {
  disabled: false,
  onClose: noop,
  trigerless: false,
};

FindConsortiumMember.propTypes = {
  disabled: PropTypes.bool,
  onClose: PropTypes.func,
  renderTrigger: PropTypes.func,
  selectRecords: PropTypes.func.isRequired,
  trigerless: PropTypes.bool,
};
