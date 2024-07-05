import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';

import {useNamespace, useOkapiKy, useStripes} from '@folio/stripes/core';

const ROLES_ENDPOINT = (limit) => `roles?limit=${limit}&query=cql.allRecords=1 sortby name`;

export const useAuthorizationRoles = (tenantId) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace();
  const stripes = useStripes();
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);

  const handleSubmitSearch = searchValue => setSearchTerm(searchValue);

  const { data, isLoading, isSuccess } = useQuery(
    [namespace, tenantId],
    () => ky.get(ROLES_ENDPOINT(stripes.config.maxUnpagedResourceCount)).json(),
    {
      enabled: Boolean(tenantId),
    },
  );

  useEffect(() => {
    if (isSuccess && data?.roles) {
      setRoles(data.roles);
    }
  }, [data, isSuccess]);

  const filteredRoles = roles.filter(role => role.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return {
    roles: filteredRoles,
    isLoading,
    onSubmitSearch: handleSubmitSearch,
  };
};
