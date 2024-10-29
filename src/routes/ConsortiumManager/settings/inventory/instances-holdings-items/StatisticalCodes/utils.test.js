import { getCurrentStatisticalCodeType } from "./utils";


describe('getCurrentStatisticalCodeType', () => {
  it('should return current statistical code type', () => {
    const codeTypes = {
      local: {
        'tenantId': [
          { id: '1', name: 'name1' },
          { id: '2', name: 'name2' },
        ]
      },
      shared: [
        { id: '3', name: 'name3' },
        { id: '4', name: 'name4' },
      ]
    };
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
    const codeTypes = {
      local: {
        'tenantId': [
          { id: '1', name: 'name1' },
          { id: '2', name: 'name2' },
        ]
      },
      shared: [
        { id: '3', name: 'name3' },
        { id: '4', name: 'name4' },
      ]
    };
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
