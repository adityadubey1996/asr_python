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

db.users = require('../models/user.model')(sequelize,DataTypes)


module.exports = db