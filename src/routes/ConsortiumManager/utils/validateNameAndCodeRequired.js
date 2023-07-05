import { validateRequired } from '../../../components/ConsortiaControlledVocabulary/validators';

export const validateNameAndCodeRequired = (item) => {
  const nameError = validateRequired({ value: item.name });
  const codeError = validateRequired({ value: item.code });

  return {
    name: nameError,
    code: codeError,
  };
};
