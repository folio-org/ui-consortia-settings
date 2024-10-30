import get from 'lodash/get';
import uniqBy from 'lodash/unionBy';

export const getCurrentStatisticalCodeType = ({
  shared,
  tenantId,
  codeTypes = {},
  statisticalCodeTypeId,
}) => {
  let currentStatisticalCode = null;

  if (!shared) {
    currentStatisticalCode = codeTypes.local?.[tenantId]?.find(({ id }) => id === statisticalCodeTypeId);
  }

  if (!currentStatisticalCode) {
    currentStatisticalCode = codeTypes.shared?.find(({ id }) => id === statisticalCodeTypeId);
  }

  return currentStatisticalCode;
};

export const getStatisticalCodeTypeOptions = ({
  id,
  shared,
  tenantId,
  statisticalCodeTypeId,
  groupedStatisticalCodeTypes,
}) => {
  const mapKey = shared || !id ? 'shared' : `local[${tenantId}]`;
  const currentStatisticalCode = getCurrentStatisticalCodeType({
    shared,
    codeTypes: groupedStatisticalCodeTypes,
    tenantId,
    statisticalCodeTypeId,
  });

  const statisticalCodes = get(groupedStatisticalCodeTypes, mapKey, []);

  if (currentStatisticalCode) {
    statisticalCodes.push(currentStatisticalCode);
  }

  return uniqBy(statisticalCodes, 'id')
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id: _id, name }) => ({ label: name, value: _id }));
};
