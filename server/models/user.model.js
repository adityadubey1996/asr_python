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
      },
      is_email_confirmed: {
        type: Datatypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      email_confirmation_token: {
        type: Datatypes.STRING,
        allowNull: true
      }
    },
    {
      timestamps: false,
    }
  );
  return users;
};
