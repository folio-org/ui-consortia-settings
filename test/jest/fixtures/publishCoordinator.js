export const pcPostRequest = {
  url: '/organizations-storage/organizations',
  method: 'POST',
  tenants: [
    'central',
    'secondary',
  ],
  payload: {
    name: 'ORG-NAME',
    status: 'Active',
    code: 'ORG-CODE',
  },
};
