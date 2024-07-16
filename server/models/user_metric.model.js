module.exports = (sequelize, DataTypes) => {
    const UserMetric = sequelize.define('UserMetric', {
        userMetricId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // This is the table name
                key: 'id', // This is the column name of the primary key in the Users table
            }
        },
        customSettings: {
            type: DataTypes.JSON,
            allowNull: false
        },
        workflowTitle: {
            type: DataTypes.STRING,
            allowNull: false // Make sure this aligns with your DB schema and migration
        }
    });

    return UserMetric;
};