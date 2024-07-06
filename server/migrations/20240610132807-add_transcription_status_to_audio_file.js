'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('AudioFiles');

    if (!tableInfo.transcriptionStatus) {
      await queryInterface.addColumn('AudioFiles', 'transcriptionStatus', {
        type: Sequelize.ENUM('failed', 'processing', 'completed', 'not_started'),
        defaultValue: 'not_started'
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('AudioFiles', 'transcriptionTarget');
  }
};
