
module.exports = (sequelize, Datatypes) => {
    const UserMetric = sequelize.define('UserMetric', {
        userMetricId: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customSettings: {
            type: Datatypes.JSON
        }
    });
    return UserMetric;
    };
    