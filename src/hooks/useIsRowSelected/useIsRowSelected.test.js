import { MemoryRouter } from 'react-router-dom';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { ORDERS_ROUTE } from '../../constants';
import { useIsRowSelected } from './useIsRowSelected';

// eslint-disable-next-line react/prop-types
const getWrapper = (initialEntries) => ({ children }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
);

describe('useIsRowSelected', () => {
  const id = 'orderId';
  const initPath = `${ORDERS_ROUTE}/view/${id}`;
  const matchPath = `${ORDERS_ROUTE}/view/:id`;

  it('should return \'true\' if the row should be selected', async () => {
    const { result } = renderHook(
      () => useIsRowSelected(matchPath),
      { wrapper: getWrapper([initPath]) },
    );

    const isSelected = result.current;

    expect(isSelected({ item: { id } })).toBeTruthy();
  });

  it('should return \'false\' if the row should not be selected', async () => {
    const { result } = renderHook(
      () => useIsRowSelected(matchPath),
      { wrapper: getWrapper([initPath]) },
    );

    const isSelected = result.current;

    expect(isSelected({ item: { id: 'anotherId' } })).toBeFalsy();
  });

  it('should return \'null\' if the path didn\'t match', async () => {
    const { result } = renderHook(
      () => useIsRowSelected(matchPath),
      { wrapper: getWrapper([`${ORDERS_ROUTE}/edit/${id}`]) },
    );

    const isSelected = result.current;

    expect(isSelected({ item: { id } })).toBeNull();
  });
});
