/* eslint-disable react/prop-types */

import { useSearchParams } from 'react-router-dom';
import Select from './Select';

const SortBy = ({ options }) => {
  const [searchParams, setSearchparams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || '';

  const handleChange = (e) => {
    searchParams.set('sortBy', e.target.value);
    setSearchparams(searchParams);
  };

  return (
    <Select
      options={options}
      type="white"
      onChange={handleChange}
      value={sortBy}
    />
  );
};

export default SortBy;
