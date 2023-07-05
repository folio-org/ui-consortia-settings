import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
} from '@folio/stripes/components';

import { translationsShape } from '../../../shapes';

export const ItemInUseModal = ({
  open,
  onConfirm,
  translations: { cannotDeleteTermHeader, cannotDeleteTermMessage },
}) => {
  return (
    <Modal
      open={open}
      footer={(
        <Button
          buttonStyle="primary"
          onClick={onConfirm}
          marginBottom0
        >
          <FormattedMessage id="stripes-core.label.okay" />
        </Button>
      )}
      label={<FormattedMessage id={cannotDeleteTermHeader} />}
      size="small"
    >
      <FormattedMessage id={cannotDeleteTermMessage} />
    </Modal>
  );
};

ItemInUseModal.propTypes = {
  open: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  translations: translationsShape.isRequired,
};
