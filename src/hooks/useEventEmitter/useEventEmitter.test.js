import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { EventEmitter } from '../../utils';
import { useEventEmitter } from './useEventEmitter';

describe('useEventEmitter', () => {
  it('should return event emitter instance', async () => {
    const { result } = renderHook(() => useEventEmitter());

    expect(result.current).toBeInstanceOf(EventEmitter);
  });
});
