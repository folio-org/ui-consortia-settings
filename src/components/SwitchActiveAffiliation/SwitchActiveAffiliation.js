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
  updateTenant,
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
  const [submitting, toggleSubmit] = useToggle(false);
  const [activeAffiliation, setActiveAffiliation] = useState(stripes.okapi.tenant);

  const {
    affiliations,
    isFetching,
  } = useUserAffiliations({ userId: stripes.user.user.id });

  const dataOptions = useMemo(() => (
    affiliations?.map(({ tenantId, tenantName, isPrimary }) => {
      const label = [
        tenantName,
        isPrimary && intl.formatMessage({ id: 'ui-consortia-settings.affiliation.primary.suffix' }),
      ]
        .filter(Boolean)
        .join(' ');

      return {
        value: tenantId,
        label,
      };
    })
  ), [affiliations, intl]);

  const resetCurrentModule = useCallback(() => {
    const path = getCurrentModulePath(modules, location.pathname) ?? '/';

    history.replace(path);
    history.go(0);
  }, [history, modules, location.pathname]);

  const onSubmit = useCallback(async () => {
    const affiliation = affiliations.find(({ tenantId }) => tenantId === activeAffiliation);

    toggleSubmit();

    await updateTenant(stripes.okapi, stripes.store, affiliation.tenantId);

    resetCurrentModule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAffiliation, affiliations, toggleSubmit, resetCurrentModule]);

  return (
    <SwitchActiveAffiliationModal
      activeAffiliation={activeAffiliation}
      dataOptions={dataOptions}
      isLoading={isFetching || submitting}
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
