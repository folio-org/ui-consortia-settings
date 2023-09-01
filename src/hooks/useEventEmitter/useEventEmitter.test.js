import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useEventEmitter } from './useEventEmitter';

describe('useEventEmitter', () => {
  it('should ', async () => {
    const { result } = renderHook(() => useEventEmitter());

    // expect(result.current).toBe(kyMock);
  });
});
