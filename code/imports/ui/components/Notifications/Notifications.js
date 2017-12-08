/* eslint-disable react/no-danger */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import Loading from '../Loading/Loading';
import { timeago } from '../../../modules/dates';
import delay from '../../../modules/delay';

import './Notifications.scss';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, currentPage: 1, notifications: [] };
    this.fetchNotifications = this.fetchNotifications.bind(this);
    this.handleMarkNotifications = this.handleMarkNotifications.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;

    this.fetchNotifications(this.state.currentPage);
    const scrollToWatch = match ? window : document.querySelector('.Notifications__container');

    scrollToWatch.addEventListener('scroll', () => {
      const containerToWatch = match ? window : document.querySelector('.Notifications__container');
      const isAtBottom = match ? ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) : (containerToWatch.scrollHeight - containerToWatch.scrollTop === containerToWatch.clientHeight);
      if (isAtBottom) this.fetchNotifications(this.state.currentPage);
    });
  }

  fetchNotifications(currentPage) {
    this.setState({ loading: true });
    delay(() => {
      Meteor.call('notifications.fetch', currentPage, (error, notifications) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          this.setState({
            loading: false,
            notifications,
            currentPage: (currentPage + 1),
          });
        }
      });
    }, 500);
  }

  handleMarkNotifications(items, markAsRead, event) {
    if (event) event.preventDefault();
    Meteor.call('notifications.mark', items, markAsRead, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.fetchNotifications(this.state.currentPage);
      }
    });
  }

  render() {
    const { onSetShow, showViewAll } = this.props;
    return (
      <div className="Notifications">
        <header className="page-header clearfix">
          <h4 className="pull-left">Notifications</h4>
          <button
            href="#"
            className="Notifications__mark-all-as-read pull-right"
            onClick={event => this.handleMarkNotifications('all', true, event)}
          >
            Mark All as Read
          </button>
        </header>
        <div className="Notifications__container">
          <ol>
            {this.state.notifications.map(({
              _id, read, date, action, message, icon,
            }) => (
              <li key={_id} className={`Notifications__notification clearfix ${!read ? 'unread' : ''}`}>
                <Link
                  className="Notifications__notification-action"
                  to={action}
                  onClick={(event) => {
                    this.handleMarkNotifications([_id], true);
                    onSetShow(event);
                  }}
                >
                  {message}
                </Link>
                <div className="Notifications__notification-icon" style={{ backgroundColor: (icon && icon.background) || '#4cae4c' }}>
                  <Icon icon={(icon && icon.symbol) || 'bell'} />
                </div>
                <div className="Notifications__notification-body">
                  <div className="Notifications__notification-body-message" dangerouslySetInnerHTML={{ __html: message }} />
                  <span className="Notifications__notification-body-timestamp">
                    {timeago(date)}
                    {read ?
                      <IconButton
                        onClick={event => this.handleMarkNotifications([_id], false, event)}
                        icon="check-circle-o"
                      /> :
                      <IconButton
                        onClick={event => this.handleMarkNotifications([_id], true, event)}
                        icon="circle-o"
                      />}
                  </span>
                </div>
              </li>
            ))}
          </ol>
          {!this.state.loading && this.state.notifications.length === 0 ? <Alert bsStyle="warning">No recent notifications.</Alert> : ''}
          {this.state.loading ? <Loading /> : ''}
        </div>
        {showViewAll ? (
          <footer>
            <Link
              to="/notifications"
              className="ViewAllNotifications"
              onClick={onSetShow}
            >
              View All Notifications
            </Link>
          </footer>
        ) : ''}
      </div>
    );
  }
}

Notifications.defaultProps = {
  match: null,
  onSetShow: (() => {}),
  showViewAll: false,
};

Notifications.propTypes = {
  match: PropTypes.object,
  onSetShow: PropTypes.func,
  showViewAll: PropTypes.bool,
};

export default Notifications;
