import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import Documents from '../../api/Documents/Documents';
import Notifications from '../../api/Notifications/Notifications';

const documentsSeed = userId => ({
  collection: Documents,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 5,
  model(dataIndex) {
    return {
      owner: userId,
      title: `Document #${dataIndex + 1}`,
      body: `This is the body of document #${dataIndex + 1}`,
    };
  },
});

seeder(Meteor.users, {
  environments: ['development', 'staging'],
  noLimit: true,
  data: [{
    email: 'admin@admin.com',
    password: 'password',
    profile: {
      name: {
        first: 'Andy',
        last: 'Warhol',
      },
    },
    roles: ['admin'],
    data(userId) {
      return documentsSeed(userId);
    },
  }],
  modelCount: 5,
  model(index, faker) {
    const userCount = index + 1;
    return {
      email: `user+${userCount}@test.com`,
      password: 'password',
      profile: {
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
      },
      roles: ['user'],
      data(userId) {
        return documentsSeed(userId);
      },
    };
  },
});

seeder(Notifications, {
  noLimit: false,
  environments: ['development', 'staging'],
  modelCount: 500,
  model(index) {
    const recipient = Meteor.users.findOne({ 'emails.address': 'admin@admin.com' });
    const sender = Meteor.users.findOne({ 'emails.address': { $ne: 'admin@admin.com' } });
    const exampleDocument = Documents.findOne({ owner: recipient._id });
    return {
      recipient: recipient._id,
      message: `<strong>${sender.profile.name.first} ${sender.profile.name.last}</strong> favorited ${exampleDocument.title}.`,
      date: (new Date()).toISOString(),
      read: false,
      icon: {
        symbol: 'heart',
        background: '#DA5847',
      },
      action: `/documents/${exampleDocument._id}`,
    };
  },
});
