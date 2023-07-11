import {
  validateRequired,
  validateUniqueness,
} from '../../../../../../components/ConsortiaControlledVocabulary/validators';

export const validate = (item, index, items) => {
  const validateFieldUniqueness = (field) => validateUniqueness({ index, item, items, field });

  const nameError = validateRequired({ value: item.name }) || validateFieldUniqueness('name');
  const codeError = validateRequired({ value: item.code }) || validateFieldUniqueness('code');
  const statisticalCodeTypeError = validateRequired({ value: item.statisticalCodeTypeId });

  return {
    name: nameError,
    code: codeError,
    statisticalCodeTypeId: statisticalCodeTypeError,
  };
};
