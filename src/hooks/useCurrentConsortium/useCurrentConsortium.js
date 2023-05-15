import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useCurrentConsortium = (options = {}) => {
  const ky = useOkapiKy();

  const { isLoading, data } = useQuery(
    ['consortium'],
    async () => {
      const { consortia } = await ky.get('consortia').json();

      return consortia[0];
    },
    options,
  );

  return ({
    consortium: data,
    isLoading,
  });
};
