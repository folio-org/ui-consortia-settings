jest.mock('@folio/stripes-authorization-components', () => ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  useAuthorizationPolicies: jest.fn().mockReturnValue({
    policies: [
      {
        id: 'id',
        name: 'Test Policy',
        description: 'policy description in free form',
        metadata: {
          updatedDate: '2023-03-14T13:11:59.601+00:00',
        },
      },
    ],
    refetch: jest.fn(),
  }),
  useUsers: jest.fn().mockReturnValue({
    users: [],
  }),
}));
