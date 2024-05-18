
module.exports = (sequelize, Datatypes) => {
    const UserSubscription = sequelize.define('UserSubscription', {
        subscriptionId: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        startDate: {
            type: Datatypes.DATEONLY
        },
        endDate: {
            type: Datatypes.DATEONLY
        }
    });
    return UserSubscription;
    };
    