'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('AudioFiles', 'userMetricId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'UserMetrics', // name of Target model
        key: 'userMetricId', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('AudioFiles', 'userMetricId');
  }
};
