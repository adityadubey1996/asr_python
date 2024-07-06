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
        defaultValue: 'uploaded'
      },
      transcriptionStatus: {
        type : DataTypes.ENUM('failed', 'processing', 'completed', 'not_started'),
        default : 'not_started',
      }
    });
    return AudioFile;
  };