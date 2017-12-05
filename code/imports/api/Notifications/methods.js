import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import Notifications from './Notifications';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'notifications.fetch': function notificationsFetch(page) {
    check(page, Number);
    try {
      const notificationsPerPage = 10;
      return Notifications.find(
        { recipient: this.userId },
        { sort: { date: -1 }, limit: (page * notificationsPerPage) },
      ).fetch();
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'notifications.markRead': function notificationsMarkRead(notifications) {
    check(notifications, Match.OneOf([String], String));
    try {
      const query = {};

      if (typeof notifications !== 'string') {
        const notificationsToMark = _.reject(notifications, notification => (
          !Notifications.findOne({ _id: notification, recipient: this.userId })
        ));

        query._id = { $in: notificationsToMark };
      }

      return Notifications.update(
        query,
        { $set: { read: true } },
        { multi: true },
      );
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'notifications.markUnread': function notificationsMarkUnread(notifications) {
    check(notifications, [String]);

    try {
      const notificationsToMark = _.reject(notifications, (notification) => {
        return !Notifications.findOne({ _id: notification, recipient: this.userId });
      });

      return Notifications.update(
        { _id: { $in: notificationsToMark } },
        { $set: { read: false } },
        { multi: true },
      );
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'notifications.fetch',
    'notifications.markRead',
    'notifications.markUnread',
  ],
  limit: 100,
  timeRange: 1000,
});
