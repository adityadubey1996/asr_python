
module.exports = (sequelize, Datatypes) => {
    const Feedback = sequelize.define('Feedback', {
        feedbackId: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        feedbackText: {
            type: Datatypes.TEXT
        }
    });
    return Feedback;
    };
    