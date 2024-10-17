import { validateRequired } from '../../../components/ConsortiaControlledVocabulary/validators';

export const validateNameRequired = (item) => ({ name: validateRequired({ value: item.name }) });
