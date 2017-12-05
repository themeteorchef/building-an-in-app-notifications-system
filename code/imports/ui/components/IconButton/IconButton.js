import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Icon from '../Icon/Icon';

import './IconButton.scss';

const IconButton = ({ icon, onClick }) => (
  <div className="IconButton">
    <Button onClick={onClick}><Icon icon={icon} /></Button>
  </div>
);

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default IconButton;
