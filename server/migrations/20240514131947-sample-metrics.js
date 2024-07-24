'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('Metrics', [{
    //   name: 'Primary Purpose',
    //   description: 'What is the primary purpose of this video/audio? E.g., Training, Meeting, Presentation.',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }, {
    //   name: 'Specific Industry',
    //   description: 'Is this video/audio content related to a specific industry or domain?',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }, {
    //   name: 'Number of Speakers',
    //   description: 'Approximately how many speakers are involved in this video/audio?',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }, {
    //   name: 'Compliance Requirements',
    //   description: 'Would you like us to analyze the content for any specific compliance requirements?',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }, {
    //   name: 'Type of Insights',
    //   description: 'What type of insights would be most valuable initially? E.g., Speaker ratios, Key topics, Sentiment analysis.',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }], {});
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('Metrics', null, {});
  }
};
