import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import {
  stripesShape,
  updateConsortium,
  useModules,
} from '@folio/stripes/core';
import { useToggle } from '@folio/stripes-acq-components';

import { useUserAffiliations } from '../../hooks';
import { getCurrentModulePath } from '../../utils';
import { SwitchActiveAffiliationModal } from './SwitchActiveAffiliationModal';

export const SwitchActiveAffiliation = ({ stripes }) => {
  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();
  const modules = useModules();
  const [open, toggle] = useToggle(true);
  const [activeAffiliation, setActiveAffiliation] = useState(stripes.consortium?.activeAffiliation?.tenantId);

  const {
    affiliations,
    isFetching,
  } = useUserAffiliations({ userId: stripes.user.user.id });

  const userPrimaryTenant = stripes.consortium?.userPrimaryTenant;

  const dataOptions = useMemo(() => (
    affiliations?.map(({ tenantId, tenantName }) => {
      const label = [
        tenantName,
        (userPrimaryTenant === tenantId) && intl.formatMessage({ id: 'ui-consortia-settings.affiliation.primary.suffix' }),
      ]
        .filter(Boolean)
        .join(' ');

      return {
        value: tenantId,
        label,
      };
    })
  ), [affiliations, intl, userPrimaryTenant]);

  const resetCurrentModule = useCallback(() => {
    const path = getCurrentModulePath(modules, location.pathname) ?? '/';

    history.replace(path);
  }, [history, modules, location.pathname]);

  const onSubmit = useCallback(() => {
    const affiliation = affiliations.find(({ tenantId }) => tenantId === activeAffiliation);

    toggle();
    updateConsortium(stripes.store, { activeAffiliation: affiliation });
    resetCurrentModule();
  }, [activeAffiliation, affiliations, resetCurrentModule, stripes.store, toggle]);

  return (
    <SwitchActiveAffiliationModal
      activeAffiliation={activeAffiliation}
      dataOptions={dataOptions}
      isLoading={isFetching}
      onChangeActiveAffiliation={setActiveAffiliation}
      onSubmit={onSubmit}
      open={open}
      toggle={toggle}
    />
  );
};

SwitchActiveAffiliation.propTypes = {
  stripes: stripesShape,
};
