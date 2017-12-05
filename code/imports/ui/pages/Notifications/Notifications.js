import React from 'react';
import PropTypes from 'prop-types';
import Notifications from '../../components/Notifications/Notifications';

const NotificationsPage = ({ match }) => (
  <div className="NotificationsPage">
    <Notifications match={match} />
  </div>
);

NotificationsPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default NotificationsPage;
