import { FormattedMessage } from 'react-intl';

import { LoadingPane } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import {
  CENTRAL_ORDERING_SETTINGS_KEY,
  ORDERS_STORAGE_SETTINGS_API,
  useCentralOrderingSettings,
  useShowCallout,
} from '@folio/stripes-acq-components';

import CentralOrderingForm from './CentralOrderingForm';

export const CentralOrdering = () => {
  const ky = useOkapiKy();
  const showCallout = useShowCallout();

  const {
    isFetching,
    enabled,
    data,
    refetch,
  } = useCentralOrderingSettings();

  const createSetting = ({ enabled: value }) => {
    return ky.post(ORDERS_STORAGE_SETTINGS_API, {
      json: {
        key: CENTRAL_ORDERING_SETTINGS_KEY,
        value,
      },
    });
  };

  const updateSetting = ({ enabled: value }) => {
    return ky.put(`${ORDERS_STORAGE_SETTINGS_API}/${data.id}`, {
      json: {
        ...data,
        value,
      },
    });
  };

  const onSubmit = async (values) => {
    const handler = data?.id ? updateSetting : createSetting;

    return handler(values)
      .then(() => {
        refetch();
        showCallout({ messageId: 'ui-consortia-settings.settings.centralOrdering.submit.success' });
      })
      .catch(() => {
        showCallout({
          messageId: 'ui-consortia-settings.settings.centralOrdering.submit.error.generic',
          type: 'error',
        });
      });
  };

  if (isFetching) {
    return <LoadingPane paneTitle={<FormattedMessage id="ui-consortia-settings.settings.centralOrdering.label" />} />;
  }

  return (
    <CentralOrderingForm
      onSubmit={onSubmit}
      initialValues={{ enabled }}
    />
  );
};
