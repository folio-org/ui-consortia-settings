import { validateRequired } from '../../../../../../components/ConsortiaControlledVocabulary/validators';

export const validate = (item) => {
  const nameError = validateRequired({ value: item.name });
  const codeError = validateRequired({ value: item.code });
  const statisticalCodeTypeError = validateRequired({ value: item.statisticalCodeTypeId });

  return {
    name: nameError,
    code: codeError,
    statisticalCodeTypeId: statisticalCodeTypeError,
  };
};
