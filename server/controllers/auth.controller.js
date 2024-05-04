const { OAuth2Client } = require("google-auth-library");
const db = require("../models/index");
const { Op } = require("sequelize");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bcrypt = require("bcrypt");
const constants = require("../utils/constants");
const { catchError } = require("../utils/catchBlock");
const jwt = require("jsonwebtoken");

const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  const googleResponse = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email_verified, name, email, given_name, family_name, picture } =
    googleResponse.payload;
  try {
    let user = await db.users.findOne({ where: { email: email } });
    if (user) {
      await user.update({ access_token: tokenId });
      return res.status(200).json({
        code: "OLD",
        data: user,
      });
    }
    const newUser = await db.users.create({
      name: name,
      email: email,
      profile_picture: picture,
      access_token: tokenId,
    });
    return res.status(200).json({
      code: "NEW",
      data: newUser,
    });
  } catch (error) {
    catchError(res, error);
  }
};

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Required details are missing");
    }
    const user = await db.users.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });
    if (user) {
      return res.status(400).json({
        code: "Duplicate",
        data: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, constants.SALT_ROUNDS);
    const newUser = await db.users.create({
      email: email,
      password: hashedPassword,
    });
    const { password: _, ...filteredUser } = newUser.toJSON();
    return res.status(200).json({
      code: "account created",
      data: filteredUser,
    });
  } catch (error) {
    catchError(res, error);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Required details are missing");
  }
  let user = await db.users.findOne({
    where: {
      email: {
        [Op.eq]: email,
      },
    },
  });
  if (!user || !user.password) {
    return res.status(404).json({
      code: "Invalid email",
      data: `User with email\t${email}\tnot found`,
    });
  }
  const isPasswordMatching = await bcrypt.compare(password, user.password);
  if (!isPasswordMatching) {
    return res.status(400).json({
      code: "bad authorization",
      data: `ENTERED CREDENTIALS NOT VALID`,
    });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  await user.update(
    { access_token: token },
    {
      where: {
        id: user.id,
      },
    }
  );
  const { password: _, ...filteredUser } = user.toJSON();
  return res.status(200).json({
    code: "login sucess",
    data: filteredUser,
  });
};

module.exports = {
  googleLogin,
  signUp,
  signIn,
};
