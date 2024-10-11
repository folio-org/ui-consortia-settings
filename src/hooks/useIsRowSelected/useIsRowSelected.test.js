import { MemoryRouter } from 'react-router-dom';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useIsRowSelected } from './useIsRowSelected';

const getWrapper = (initialEntries) => ({ children }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
);

const ROUTE = 'route';

describe('useIsRowSelected', () => {
  const id = 'orderId';
  const initPath = `${ROUTE}/view/${id}`;
  const matchPath = `${ROUTE}/view/:id`;

  it('should return \'true\' if the row should be selected', () => {
    const { result } = renderHook(
      () => useIsRowSelected(matchPath),
      { wrapper: getWrapper([initPath]) },
    );

    const isSelected = result.current;

    expect(isSelected({ item: { id } })).toBeTruthy();
  });

  it('should return \'false\' if the row should not be selected', () => {
    const { result } = renderHook(
      () => useIsRowSelected(matchPath),
      { wrapper: getWrapper([initPath]) },
    );

    const isSelected = result.current;

    expect(isSelected({ item: { id: 'anotherId' } })).toBeFalsy();
  });

  it('should return \'null\' if the path didn\'t match', () => {
    const { result } = renderHook(
      () => useIsRowSelected(matchPath),
      { wrapper: getWrapper([`${ROUTE}/edit/${id}`]) },
    );

    const isSelected = result.current;

    expect(isSelected({ item: { id } })).toBeNull();
  });
});
