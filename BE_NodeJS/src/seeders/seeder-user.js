'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '123456',
      firstName: 'Bích',
      lastName: 'Ngọc',
      address: 'Hà Nội',
      gender: 0,
      yearOfBirth: '2003',
      typeRole:'ROLE',
      keyRole:'R1',

      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
