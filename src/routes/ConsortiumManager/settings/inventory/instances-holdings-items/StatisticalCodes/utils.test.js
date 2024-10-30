import { getCurrentStatisticalCodeType, getStatisticalCodeTypeOptions } from './utils';

const localStatisticalCodeTypes = [
  { id: '1', name: 'name1' },
  { id: '2', name: 'name2' },
];
const sharedStatisticalCodeTypes = [
  { id: '3', name: 'name3' },
  { id: '4', name: 'name4' },
];

const codeTypes = {
  local: { 'tenantId': localStatisticalCodeTypes },
  shared: sharedStatisticalCodeTypes,
};

describe('getCurrentStatisticalCodeType', () => {
  it('should return undefined when statisticalCodeTypeId is not provided', () => {
    const shared = false;
    const tenantId = 'tenantId';

    const result = getCurrentStatisticalCodeType({
      shared,
      tenantId,
    });

    expect(result).toBeUndefined();
  });

  it('should return current statistical code type', () => {
    const statisticalCodeTypeId = '2';
    const shared = false;
    const tenantId = 'tenantId';

    const result = getCurrentStatisticalCodeType({
      shared,
      tenantId,
      codeTypes,
      statisticalCodeTypeId,
    });

    expect(result).toEqual({ id: '2', name: 'name2' });
  });

  it('should return current statistical code type when shared is true', () => {
    const statisticalCodeTypeId = '3';
    const shared = true;
    const tenantId = 'tenantId';

    const result = getCurrentStatisticalCodeType({
      shared,
      tenantId,
      codeTypes,
      statisticalCodeTypeId,
    });

    expect(result).toEqual({ id: '3', name: 'name3' });
  });
});

describe('getStatisticalCodeTypeOptions', () => {
  it('should return statistical code type options', () => {
    const groupedStatisticalCodeTypes = codeTypes;
    const statisticalCodeTypeId = '2';
    const shared = false;
    const tenantId = 'tenantId';

    const result = getStatisticalCodeTypeOptions({
      shared,
      tenantId,
      statisticalCodeTypeId,
      groupedStatisticalCodeTypes,
    });

    expect(result).toEqual([
      { label: 'name2', value: '2' },
      { label: 'name3', value: '3' },
      { label: 'name4', value: '4' },
    ]);
  });
});
