
module.exports = (sequelize, Datatypes) => {
    const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
        planId: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        planName: {
            type: Datatypes.STRING
        },
        price: {
            type: Datatypes.DECIMAL(10, 2)
        },
        features: {
            type: Datatypes.JSON
        }
    });
    return SubscriptionPlan;
    };
    