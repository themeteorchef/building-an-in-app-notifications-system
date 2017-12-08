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
  'notifications.mark': function notificationsMarkRead(notifications, markAsRead) {
    check(notifications, Match.OneOf([String], String));
    check(markAsRead, Boolean);

    try {
      const query = notifications === 'all' ? { recipient: this.userId } : { _id: { $in: notifications }, recipient: this.userId };
      return Notifications.update(
        query,
        { $set: { read: markAsRead } },
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
    'notifications.mark',
  ],
  limit: 100,
  timeRange: 1000,
});
