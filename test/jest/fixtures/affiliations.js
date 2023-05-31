import { tenants } from './tenants';

export const affiliations = tenants.map(({ id, name }, i) => ({
  id: `affiliation-${i}`,
  tenantId: id,
  tenantName: name,
  username: 'testuser',
  userId: 'user-id',
  isPrimary: i === 1,
}));
