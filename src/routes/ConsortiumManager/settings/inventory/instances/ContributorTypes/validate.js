import { validateRequired } from '../../../../../../components/ConsortiaControlledVocabulary/validators';

export const validate = (item, _index, _items) => {
  const nameError = validateRequired({ value: item.name });
  const codeError = validateRequired({ value: item.code });

  return {
    name: nameError,
    code: codeError,
  };
};
