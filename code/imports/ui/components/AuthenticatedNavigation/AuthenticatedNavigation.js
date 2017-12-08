import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Icon from '../Icon/Icon';
import Notifications from '../Notifications/Notifications';
import isMobile from '../../../modules/is-mobile';

import './AuthenticatedNavigation.scss';

class AuthenticatedNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showNotifications: false };
    this.handleShowNotifications = this.handleShowNotifications.bind(this);
    this.ignoredSelectors = [
      'Notifications__mark-all-as-read',
      'Notifications__notification-action',
      'ViewAllNotifications',
      'IconButton',
      'fa',
    ];
    this.isIgnored = this.isIgnored.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', (event) => {
      if (this.state.showNotifications && !this.isIgnored(event)) {
        this.setState({ showNotifications: false });
      }
    });
  }

  isIgnored(event) {
    const isViewAllLink = event.target.classList.contains('ViewAllNotifications');
    const isNotificationLink = (event.target && event.target.href && event.target.href.includes('notifications') && !isViewAllLink) || event.target.classList.contains('fa-globe');

    if (isNotificationLink) {
      event.preventDefault();
      return true;
    }

    return this.ignoredSelectors.indexOf(event.target.classList[0]) > -1;
  }

  handleShowNotifications(event) {
    if (!isMobile() && !this.isIgnored(event)) event.preventDefault();
    this.setState({ showNotifications: !this.state.showNotifications });
  }

  render() {
    const { name, unreadNotifications } = this.props;
    return (
      <div className="AuthenticatedNavigation">
        <Nav>
          <LinkContainer to="/documents">
            <NavItem eventKey={1} href="/documents">Documents</NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
          <span className="Notifications__popover">
            <LinkContainer to="/notifications" className="Notifications__popover-toggle">
              <NavItem eventKey={3} href="/notifications" onClick={this.handleShowNotifications}>
                {unreadNotifications > 0 ? <span className="Notifications__popover-toggle-badge">{unreadNotifications}</span> : ''}
                <span className="Notifications__popover-toggle-link">
                  <Icon icon="globe" /> <span>Notifications</span>
                </span>
              </NavItem>
            </LinkContainer>
            {this.state.showNotifications ? <Notifications showViewAll onSetShow={this.handleShowNotifications} /> : ''}
          </span>
          <NavDropdown eventKey={4} title={name} id="user-nav-dropdown">
            <LinkContainer to="/profile">
              <NavItem eventKey={4.1} href="/profile">Profile</NavItem>
            </LinkContainer>
            <MenuItem divider />
            <MenuItem eventKey={4.2} onClick={() => Meteor.logout()}>Logout</MenuItem>
          </NavDropdown>
        </Nav>
      </div>
    );
  }
}

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  unreadNotifications: PropTypes.number.isRequired,
};

export default AuthenticatedNavigation;
