import { Box } from '@mui/material';
import { STATUS_CHIP } from '../../consts/statusCode';
import ChipCustom from '../ChipCustom';
import styles from './styles.module.scss';

export interface ISearchResult {
  label: string;
  value: string;
}

interface SearchResultProps {
  results: ISearchResult[];
}

const SearchResult = (props: SearchResultProps) => {
  const { results } = props;
  const isShowResult = results.some((result) => !!result.value);
  if (!isShowResult) return <></>;
  return (
    <Box className="search-by-container">
      <Box className="search-label">Tìm kiếm:</Box>
      <Box style={{width: '100%'}}>
        {!!results.length &&
          results.map((result) => {
            if (!result.label || !result.value) return;
            let label = `${result.label}: ${result.value}`;
            return <ChipCustom key={result.label} label={label} chipType={STATUS_CHIP.ACTIVE} className={styles.chipStyles} />;
          })}
      </Box>
    </Box>
  );
};

export default SearchResult;
