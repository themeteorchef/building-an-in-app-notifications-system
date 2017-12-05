import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Notifications = new Mongo.Collection('Notifications');

Notifications.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Notifications.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const NotificationsSchema = new SimpleSchema({
  date: {
    type: String,
    label: 'The date this notification was triggered.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    }
  },
  recipient: {
    type: String,
    label: 'The ID of the user receiving this notification.',
  },
  read: {
    type: Boolean,
    label: 'Has the user acknowledged this notification?',
    defaultValue: false,
  },
  icon: {
    type: Object,
    label: 'The icon for the notification.',
    optional: true,
  },
  'icon.symbol': {
    type: String,
    label: 'The symbol to display for the notification icon.',
  },
  'icon.background': {
    type: String,
    label: 'The hex code to display as the background for the notification icon.',
    optional: true,
  },
  message: {
    type: String,
    label: 'The message for this notification.',
  },
  action: {
    type: String,
    label: 'The action URL for this notification.',
    optional: true,
  },
});

Notifications.attachSchema(NotificationsSchema);

export default Notifications;
