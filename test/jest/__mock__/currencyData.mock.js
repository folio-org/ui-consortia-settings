jest.mock('currency-codes/data', () => ({
  filter: () => [
    {
      code: 'USD',
      countries: [],
      currency: 'US Dollar',
      digits: 2,
      number: '840',
    },
    {
      code: 'BYN',
      countries: [],
      currency: 'Rubles',
      digits: 2,
      number: '841',
    },
  ],
}));
