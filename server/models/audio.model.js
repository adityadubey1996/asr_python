module.exports = (sequelize, DataTypes) => {
    const AudioFile = sequelize.define('AudioFile', {
      fileId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('uploaded', 'processing', 'completed', 'failed'),
        defaultValue: null
      },
      transcriptionStatus: {
        type : DataTypes.ENUM('failed', 'processing', 'completed', 'not_started'),
        default : 'not_started',
      },
      userMetricId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'UserMetrics', // This is the table name as defined in Sequelize
            key: 'userMetricId' // The column in UserMetrics that this refers to
        }
    }
    });
    return AudioFile;
  };