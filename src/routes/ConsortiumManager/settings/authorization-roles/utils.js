import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';

import {
  NoValue,
  TextLink,
} from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

import { INTERACTION_REQUIRED_INTERFACES } from './constants';

export const hasInteractionRequiredInterfaces = (stripes) => {
  return INTERACTION_REQUIRED_INTERFACES.every((interfaceName) => stripes.hasInterface(interfaceName));
};

export const getResultsFormatter = (path, users, stripes) => ({
  name: (item) => {
    return hasInteractionRequiredInterfaces(stripes) && item.id
      ? <TextLink to={`${path}/${item.id}`}>{item.name}</TextLink>
      : item.name;
  },
  type: (item) => {
    if (!item?.type) return <NoValue />;

    return (
      <FormattedMessage
        id={`stripes-authorization-components.role.type.${item.type.toLowerCase()}`}
        defaultMessage={item.type}
      />
    );
  },
  updatedBy: (item) => (item.metadata.updatedByUserId
    ? getFullName(users[item.metadata.updatedByUserId])
    : <NoValue />
  ),
  updated: (item) => (
    item.metadata?.updatedDate
      ? <FormattedDate value={item.metadata?.updatedDate} />
      : <NoValue />
  ),
});

export const onFilter = (value, dataOptions) => {
  return dataOptions.filter(option => new RegExp(value, 'i').test(option.label));
};

export const mergeAndGetUniqueById = (obj1, obj2) => {
  const allData = [...obj1.data, ...obj1.procedural, ...obj1.settings,
    ...obj2.data, ...obj2.procedural, ...obj2.settings];

  const seen = new Set();

  const uniqueData = allData.filter(item => {
    if (!seen.has(item.id)) {
      seen.add(item.id);

      return true;
    }

    return false;
  });

  return {
    data: uniqueData.filter(item => obj1.data.includes(item) || obj2.data.includes(item)),
    procedural: uniqueData.filter(item => obj1.procedural.includes(item) || obj2.procedural.includes(item)),
    settings: uniqueData.filter(item => obj1.settings.includes(item) || obj2.settings.includes(item)),
  };
};
