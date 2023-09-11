import {
  useLocalStorage,
  writeStorage,
} from '@rehooks/local-storage';

import {
  useNamespace,
} from '@folio/stripes/core';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { tenants, affiliations } from 'fixtures';

import { useMembersSelection, STORAGE_POSTFIX } from './useMembersSelection';

describe('useMembersSelection', () => {
  beforeEach(() => {
    useLocalStorage.mockClear().mockReturnValue([tenants]);
    writeStorage.mockClear();
  });

  it('should retrieve members from localStorage', async () => {
    const { result } = renderHook(() => useMembersSelection());

    expect(result.current.members).toEqual(tenants);
  });

  it('should update members in localStorage when updateMembersSelection is called', async () => {
    const [namespace] = useNamespace();
    const { result } = renderHook(() => useMembersSelection());

    result.current.updateMembersSelection(tenants);

    expect(writeStorage).toHaveBeenCalledWith(`${namespace}/${STORAGE_POSTFIX}`, tenants);
  });

  it('should init members in localStorage when members are empty', async () => {
    useLocalStorage.mockClear().mockReturnValue([null]);

    const [namespace] = useNamespace();
    const { result } = renderHook(() => useMembersSelection());

    result.current.initMembersSelection(affiliations);

    expect(writeStorage).toHaveBeenCalledWith(
      `${namespace}/${STORAGE_POSTFIX}`,
      affiliations.map(({ tenantId, tenantName }) => ({ id: tenantId, name: tenantName })),
    );
  });

  it('should init members in localStorage when members are not empty (update based on current affiliations)', async () => {
    const [namespace] = useNamespace();
    const { result } = renderHook(() => useMembersSelection());

    result.current.initMembersSelection([affiliations[0]]);

    expect(writeStorage).toHaveBeenCalledWith(
      `${namespace}/${STORAGE_POSTFIX}`,
      [{ id: affiliations[0].tenantId, name: affiliations[0].tenantName }],
    );
  });
});
