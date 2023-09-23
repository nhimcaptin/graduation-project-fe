'use strict';
module.exports = {
    // patientId: DataTypes.INTEGER,
    // doctorId: DataTypes.INTEGER,
    // date: DataTypes.DATE,
    // description: DataTypes.TEXT,
    // prescription: DataTypes.TEXT,
    // guarantee: DataTypes.STRING,

  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.TEXT
      },
      prescription: {
        type: Sequelize.TEXT
      },
      guarantee: {
        type: Sequelize.STRING
      },
      file: {
        type: Sequelize.TEXT
      },
      
//thoi gian tao va update bang   
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('histories');
  }
};