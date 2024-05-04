module.exports = (sequelize, Datatypes) => {
  const users = sequelize.define(
    "users",
    {
      name  :{
        type: Datatypes.STRING,
      },
      email: {
        type: Datatypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      access_token: {
        type: Datatypes.TEXT,
      },
      profile_picture :{
        type : Datatypes.STRING
      }
    },
    {
      timestamps: false,
    }
  );
  return users;
};
