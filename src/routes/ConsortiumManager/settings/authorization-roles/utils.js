import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';

import { NoValue, TextLink } from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

export const getResultsFormatter = (path, users) => ({
  name: (item) => <TextLink to={`${path}/${item.id}`}>{item.name}</TextLink>,
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
    ...obj2.data, ...obj2.procedural, ...obj2.settings]; // Объединяем все массивы

  const seen = new Set();

  // Функция для фильтрации уникальных объектов по id
  const uniqueData = allData.filter(item => {
    if (!seen.has(item.id)) {
      seen.add(item.id);

      return true;
    }

    return false;
  });

  // Структурируем данные в соответствии с исходным форматом
  return {
    data: uniqueData.filter(item => obj1.data.includes(item) || obj2.data.includes(item)),
    procedural: uniqueData.filter(item => obj1.procedural.includes(item) || obj2.procedural.includes(item)),
    settings: uniqueData.filter(item => obj1.settings.includes(item) || obj2.settings.includes(item)),
  };
};
