import { FormattedMessage } from 'react-intl';

import { MAX_NAME_LENGTH } from './constants';
import { validate } from './validate';

const items = [
  { name: 'foo', id: 'item-1' },
  { name: 'bar', id: 'item-2' },
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
});
