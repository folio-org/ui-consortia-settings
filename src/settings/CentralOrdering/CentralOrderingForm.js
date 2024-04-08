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
  Pane,
  PaneFooter,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

const CentralOrderingForm = ({
  handleSubmit,
  pristine,
  submitting,
}) => {
  const intl = useIntl();
  const paneTitleRef = useRef();

  const handlePaneFocus = useCallback(() => {
    return paneTitleRef.current?.focus();
  }, []);

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
        <Col xs={12}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id="ui-consortia-settings.settings.centralOrdering.checkbox.label" />}
            name="enabled"
            type="checkbox"
          />
        </Col>
      </Row>
    </Pane>
  );
};

CentralOrderingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(CentralOrderingForm);
