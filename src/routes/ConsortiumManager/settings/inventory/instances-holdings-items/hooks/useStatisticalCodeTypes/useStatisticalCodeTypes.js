import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  LIMIT_MAX,
  LIMIT_PARAMETER,
  SEARCH_PARAMETER,
} from '@folio/stripes-acq-components';

import { STATISTICAL_CODE_TYPES_API } from '../../../../../../../constants';

const DEFAULT_DATA = [];

export const useStatisticalCodeTypes = () => {
  // TODO: update to leverage of publish coordinator
  const ky = useOkapiKy();

  const searchParams = {
    [SEARCH_PARAMETER]: 'cql.allRecords=1',
    [LIMIT_PARAMETER]: LIMIT_MAX,
  };

  const {
    isFetching,
    isLoading,
    data,
  } = useQuery(
    ['statistical-code-types'],
    () => ky.get(STATISTICAL_CODE_TYPES_API, { searchParams }).json(),
  );

  return ({
    isFetching,
    isLoading,
    statisticalCodeTypes: data?.statisticalCodeTypes || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
  });
};
