

require('dotenv').config({path : `${__dirname}/../.env`})
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs')
let dbConfig =   {
  host: process.env.DB_HOST,  // Database host
  port: process.env.DB_PORT,  // Database port
  dialect: 'mysql',  // Using MySQL
  pool: { 
    max: 5,  // Maximum number of connection in pool
    min: 0,  // Minimum number of connection in pool
    idle: 10000  // The maximum time, in milliseconds, that a connection can be idle before being released
  },
  benchmark: false,  // Set to `true` if you want to output the execution time
  logging: false  // Set to `true` to log SQL queries, or pass a function to log in a custom way
}

if(process.env.ENVIRONMENT === 'PROD'){
  // dbConfig.ssl={
  //   sslmode: 'verify-full',
  //   ca: fs.readFileSync(process.env.DB_ROOT_CERT), // e.g., '/path/to/my/server-ca.pem'
  //   key: fs.readFileSync(process.env.DB_KEY), // e.g. '/path/to/my/client-key.pem'
  //   cert: fs.readFileSync(process.env.DB_CERT), // e.g. '/path/to/my/client-cert.pem'
  // }
}

const sequelize = new Sequelize(
  process.env.DB_NAME,   // Database name
  process.env.DB_USER,   // Username
  process.env.DB_PASSWORD,  // Password
  dbConfig
);


const  db={}
db.Sequelize = Sequelize
db.sequelize = sequelize

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

db.users = require('../models/user.model')(sequelize, DataTypes);
db.audioFiles = require('../models/audio.model')(sequelize, DataTypes);
db.transcriptions = require('../models/transcription.model')(sequelize, DataTypes);
db.metrics = require('../models/metric.model')(sequelize, DataTypes);
db.userMetrics = require('../models/user_metric.model')(sequelize, DataTypes);
db.subscriptionPlans = require('../models/subscription.model')(sequelize, DataTypes);
db.userSubscriptions = require('../models/user_subscription.model')(sequelize, DataTypes);
db.feedback = require('../models/feedback.model')(sequelize, DataTypes);

// Define relationships


db.users.hasMany(db.transcriptions);
db.transcriptions.belongsTo(db.users);

db.users.hasMany(db.userMetrics);
db.userMetrics.belongsTo(db.users, {foreignKey: 'userId',
as: 'user'
});

db.users.hasMany(db.audioFiles, { as: 'AudioFiles' });
db.audioFiles.belongsTo(db.users, { foreignKey: 'userId', as: 'Uploader' });











module.exports = db