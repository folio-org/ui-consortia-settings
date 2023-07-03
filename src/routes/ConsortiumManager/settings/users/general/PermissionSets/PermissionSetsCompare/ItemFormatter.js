import PropTypes from 'prop-types';
import React, { memo } from 'react';

const ItemFormatter = ({ item, uniqueItems = [] }) => {
  return <li key={item}>{uniqueItems.includes(item) ? <mark>{item}</mark> : item}</li>;
};

ItemFormatter.propTypes = {
  item: PropTypes.string.isRequired,
  uniqueItems: PropTypes.arrayOf(PropTypes.string),
};

export default memo(ItemFormatter);
