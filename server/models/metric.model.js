
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
            type: Datatypes.DATE,
            defaultValue: Datatypes.NOW,
          },
          updatedAt: {
            type: Datatypes.DATE,
            defaultValue: Datatypes.NOW,
            onUpdate: Datatypes.NOW,
          },
    },{  timestamps: true,
});
    return Metric;
    };
    