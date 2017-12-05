import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Notifications from '../../Notifications/Notifications';

Meteor.publish('app', function app() {
  Counts.publish(this, 'app.unreadNotifications', Notifications.find({ recipient: this.userId, read: false }));
});
