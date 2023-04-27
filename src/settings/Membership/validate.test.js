import { FormattedMessage } from 'react-intl';
import {
  MAX_CODE_LENGTH,
  MAX_NAME_LENGTH,
} from './constants';
import { validate } from './validate';

const items = [
  { code: 'aaa', name: 'foo', id: 'item-1' },
  { code: 'bbb', name: 'bar', id: 'item-2' },
];

describe('validate', () => {
  it('should return an error for invalid \'name\' field - uniqueness', () => {
    const errors = validate({ name: items[0].name }, 1, items);

    expect(errors.name).toEqual(
      <FormattedMessage id="ui-consortia-settings.settings.membership.error.duplicate" />,
    );
  });

  it('should return an error for invalid \'name\' field - max length', () => {
    const tooLongName = `${'abc'.repeat(50)}d`;

    const errors = validate({ name: tooLongName }, 1);

    expect(errors.name).toEqual(
      <FormattedMessage
        id="ui-consortia-settings.settings.membership.error.nameExceedsLength"
        values={{ count: MAX_NAME_LENGTH }}
      />,
    );
  });

  it('should return \'undefined\' for valid \'name\' field', () => {
    const errors = validate({ name: 'abc' }, 1, items);

    expect(errors.name).toBeUndefined();
  });

  it('should return max length error message for the code field', () => {
    const errors = validate({ code: '1234' }, 1, items);

    expect(errors.code).toEqual(
      <FormattedMessage
        id="ui-consortia-settings.settings.membership.error.codeExceedsLength"
        values={{ count: MAX_CODE_LENGTH }}
      />,
    );
  });

  it('should return unique error message for the code field', () => {
    const errors = validate({ code: 'aaa', name: 'new-item' }, 1, items);

    expect(errors.code).toEqual(
      <FormattedMessage
        id="ui-consortia-settings.settings.membership.error.duplicate.code"
      />,
    );
  });
});
