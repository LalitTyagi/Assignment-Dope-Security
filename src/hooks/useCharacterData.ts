import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCharacters } from '../store/tableSlice';
import { selectFilteredAndSortedData, selectStats } from '../store/selectors';

export const useCharacterData = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.table);
    const data = useAppSelector(selectFilteredAndSortedData);
    const stats = useAppSelector(selectStats);

    useEffect(() => {
        dispatch(fetchCharacters());
    }, [dispatch]);

    return { data, loading, error, stats };
};
