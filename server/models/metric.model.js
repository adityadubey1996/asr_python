
module.exports = (sequelize, Datatypes) => {
    const Metric = sequelize.define('Metric', {
        metricId: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Datatypes.STRING
        },
        description: {
            type: Datatypes.TEXT
        },
        createdAt: {
            allowNull: false,
            type: Datatypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedAt: {
            allowNull: false,
            type: Datatypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
          }
    });
    return Metric;
    };
    