import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Checkbox,
  Col,
  ConfirmationModal,
  MessageBanner,
  Pane,
  PaneFooter,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { useToggle } from '@folio/stripes-acq-components';

const CENTRAL_ORDERING_FIELD_NAME = 'enabled';

const CentralOrderingForm = ({
  form: { change },
  handleSubmit,
  initialValues,
  pristine,
  submitting,
}) => {
  const intl = useIntl();
  const paneTitleRef = useRef();
  const stripes = useStripes();
  const confirmEnableSettingPromiseRef = useRef(Promise);

  const [isConfirmEnableSettingModalOpen, toggleConfirmEnableSettingModal] = useToggle(false);

  const isCentralOrderingDisabled = !stripes.hasPerm('ui-consortia-settings.settings.networkOrdering.edit') || initialValues[CENTRAL_ORDERING_FIELD_NAME];
  const confirmCentralOrderingMessage = [
    intl.formatMessage({ id: 'ui-consortia-settings.settings.centralOrdering.alert.message' }),
    intl.formatMessage({ id: 'ui-consortia-settings.settings.centralOrdering.confirmModal.message' }),
  ].join(' ');

  const handlePaneFocus = useCallback(() => {
    return paneTitleRef.current?.focus();
  }, []);

  const handleCentralOrderingChange = useCallback(async ({ target }) => {
    const checked = target?.checked;
    const changeFieldValue = (value) => change(CENTRAL_ORDERING_FIELD_NAME, value);

    if (checked) {
      await new Promise((resolve, reject) => {
        confirmEnableSettingPromiseRef.current = { resolve, reject };

        toggleConfirmEnableSettingModal();
      })
        .then(() => {
          changeFieldValue(true);
          toggleConfirmEnableSettingModal();
        })
        .catch(toggleConfirmEnableSettingModal);
    } else {
      changeFieldValue(checked);
    }
  }, [change, toggleConfirmEnableSettingModal]);

  const paneFooter = useMemo(() => {
    const end = (
      <Button
        id="clickable-save-central-ordering-footer"
        type="submit"
        buttonStyle="primary mega"
        disabled={pristine || submitting}
        onClick={handleSubmit}
        marginBottom0
      >
        <FormattedMessage id="stripes-core.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={end} />;
  }, [handleSubmit, pristine, submitting]);

  const renderHeader = (renderProps) => (
    <PaneHeader
      {...renderProps}
      paneTitle={<FormattedMessage id="ui-consortia-settings.settings.centralOrdering.label" />}
    />
  );

  return (
    <Pane
      defaultWidth="fill"
      id="central-ordering"
      renderHeader={renderHeader}
      paneTitleRef={paneTitleRef}
      footer={paneFooter}
      onMount={handlePaneFocus}
    >
      <TitleManager
        page={intl.formatMessage({ id: 'ui-consortia-settings.document.settings.title' })}
        record={intl.formatMessage({ id: 'ui-consortia-settings.settings.centralOrdering.label' })}
      />
      <Row>
        {initialValues[CENTRAL_ORDERING_FIELD_NAME] && (
          <Col xs={12}>
            <MessageBanner type="warning">
              <FormattedMessage id="ui-consortia-settings.settings.centralOrdering.alert.message" />
            </MessageBanner>
          </Col>
        )}
        <Col xs={12}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id="ui-consortia-settings.settings.centralOrdering.checkbox.label" />}
            name={CENTRAL_ORDERING_FIELD_NAME}
            type="checkbox"
            disabled={isCentralOrderingDisabled}
            onChange={handleCentralOrderingChange}
          />
        </Col>
      </Row>

      <ConfirmationModal
        id="enable-central-ordering-confirmation"
        open={isConfirmEnableSettingModalOpen}
        heading={intl.formatMessage({ id: 'ui-consortia-settings.settings.centralOrdering.label' })}
        message={confirmCentralOrderingMessage}
        confirmLabel={intl.formatMessage({ id: 'ui-consortia-settings.button.confirm' })}
        onConfirm={confirmEnableSettingPromiseRef.current.resolve}
        onCancel={confirmEnableSettingPromiseRef.current.reject}
      />
    </Pane>
  );
};

CentralOrderingForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(CentralOrderingForm);
