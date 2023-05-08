// TODO: add legacy token/cookie support

export const fetchConsortiaCentralTenant = ({ okapi }) => {
  const searchParams = new URLSearchParams({
    query: '(module=CONSORTIA and configName=centralTenantId)',
  });

  return fetch(`${okapi.url}/configurations/entries?${searchParams}`, {
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
      'Content-Type': 'application/json',
    },
  })
    .then(resp => resp.json())
    .then(data => {
      return data.configs[0]?.value || okapi.tenant;
    });
};

export const fetchConsortium = ({ okapi }, tenant) => {
  return fetch(`${okapi.url}/consortia`, {
    headers: {
      'X-Okapi-Tenant': tenant,
      'Content-Type': 'application/json',
    },
  })
    .then(resp => resp.json())
    .then(data => data.consortia[0]);
};

export const fetchConsortiumTenants = ({ okapi }, tenant, { id: consortiumId }) => {
  return fetch(`${okapi.url}/consortia/${consortiumId}/tenants`, {
    headers: {
      'X-Okapi-Tenant': tenant,
      'Content-Type': 'application/json',
    },
  })
    .then(resp => resp.json())
    .then(data => data.tenants);
};

export const fetchConsortiumUserTenants = ({ okapi }, tenant, { id: consortiumId }) => {
  return fetch(`${okapi.url}/consortia/${consortiumId}/user-tenants?userId=${okapi.currentUser.id}`, {
    headers: {
      'X-Okapi-Tenant': tenant,
      'X-Okapi-Token': okapi.token,
      'Content-Type': 'application/json',
    },
  })
    .then(resp => resp.json())
    .then(data => data.userTenants);
};
