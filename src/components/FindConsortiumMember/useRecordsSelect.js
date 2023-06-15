import keyBy from 'lodash/keyBy';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const useRecordsSelect = ({ records, initialSelected }) => {
  const [selectedRecordsMap, setSelectedRecordsMap] = useState({});

  useEffect(() => {
    setSelectedRecordsMap(() => {
      const initialSelectedMap = keyBy(initialSelected, 'id');

      return records.reduce((acc, { id }) => ({ ...acc, [id]: Boolean(initialSelectedMap[id]) }), {});
    });
  }, [initialSelected, records]);

  const isAllSelected = useMemo(() => (
    Object.values(selectedRecordsMap).every(value => Boolean(value))
  ), [selectedRecordsMap]);

  const totalSelected = useMemo(() => (
    Object.values(selectedRecordsMap).filter(Boolean).length
  ), [selectedRecordsMap]);

  const select = useCallback(({ id }) => {
    setSelectedRecordsMap(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const selectAll = useCallback(() => {
    setSelectedRecordsMap(prev => (
      Object.entries(prev).reduce((acc, [key]) => ({ ...acc, [key]: !isAllSelected }), {})
    ));
  }, [isAllSelected]);

  return {
    selectedRecordsMap,
    isAllSelected,
    select,
    selectAll,
    totalSelected,
  };
};
