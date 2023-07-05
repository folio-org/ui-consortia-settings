import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';
import { Link } from 'react-router-dom';

import { NoValue } from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

import css from './ConsortiaControlledVocabulary.css';

export const renderLastUpdated = (metadata, users) => {
  if (!metadata) return <NoValue />;

  const record = users?.find(r => r.id === metadata.updatedByUserId);
  const name = getFullName(record);
  const user = record
    ? <Link to={`/users/view/${metadata.updatedByUserId}`}>{name}</Link>
    : <NoValue />;

  return (
    <div className={css.lastUpdated}>
      <FormattedMessage
        id="stripes-smart-components.cv.updatedAtAndBy"
        values={{
          date: <FormattedDate value={metadata.updatedDate} />,
          user,
        }}
      />
    </div>
  );
};
