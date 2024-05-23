require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize');



const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      pool: { max: 5, min: 0, idle: 10000 },
      benchmark: false, 
    }
  );

const  db={}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('../models/user.model')(sequelize, DataTypes);
db.audioFiles = require('../models/audio.model')(sequelize, DataTypes);
db.transcriptions = require('../models/transcription.model')(sequelize, DataTypes);
db.metrics = require('../models/metric.model')(sequelize, DataTypes);
db.userMetrics = require('../models/user_metric.model')(sequelize, DataTypes);
db.subscriptionPlans = require('../models/subscription.model')(sequelize, DataTypes);
db.userSubscriptions = require('../models/user_subscription.model')(sequelize, DataTypes);
db.feedback = require('../models/feedback.model')(sequelize, DataTypes);

// Define relationships
db.users.hasMany(db.audioFiles);
db.audioFiles.belongsTo(db.users);

db.users.hasMany(db.transcriptions);
db.transcriptions.belongsTo(db.users);

db.users.hasMany(db.userMetrics);
db.userMetrics.belongsTo(db.users);

db.metrics.hasMany(db.userMetrics);
db.userMetrics.belongsTo(db.metrics);

db.users.hasMany(db.userSubscriptions);
db.userSubscriptions.belongsTo(db.users);

db.subscriptionPlans.hasMany(db.userSubscriptions);
db.userSubscriptions.belongsTo(db.subscriptionPlans);

db.users.hasMany(db.feedback);
db.feedback.belongsTo(db.users);



module.exports = db