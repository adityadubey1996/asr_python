
module.exports = (sequelize, Datatypes) => {
const Transcription = sequelize.define('Transcription', {
    transcriptionId: {
        type: Datatypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    transcriptionText: {
        type: Datatypes.TEXT('medium')
    },
    processingTime: {
        type: Datatypes.INTEGER
    }
});
return Transcription;
};
