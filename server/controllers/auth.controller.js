const { OAuth2Client } = require("google-auth-library");
const db = require("../models/index");
const { Op } = require("sequelize");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bcrypt = require("bcryptjs");
const {constants} = require("../utils/constants");
const { catchError } = require("../utils/catchBlock");
const jwt = require("jsonwebtoken");

const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  console.log('tokenId', tokenId)
  let token;

  try {
    const googleResponse = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email_verified, name, email, picture } = googleResponse.payload;

    if (!email_verified) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    let user = await db.users.findOne({ where: { email: email } });

    if (user) {
      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { algorithm: 'HS256' });
      await user.update({ access_token: token });

      const userMetrics = await db.userMetrics.findOne({ where: { userId: user.id } });
      const metricsExist = !!userMetrics; 

      return res.status(200).json({
        code: 'OLD',
        data: user,
        metricsExist: metricsExist,
      });
    }

    let newUser = await db.users.create({
      name: name,
      email: email,
      profile_picture: picture,
    });

    token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { algorithm: 'HS256' });
    await newUser.update({ access_token: token }, { where: { id: newUser.id } });

    return res.status(200).json({
      code: 'NEW',
      data: newUser,
      metricsExist: false,
    });

  } catch (error) {
    if (error.message.includes('No pem found for envelope')) {
      console.error('Public key not found for JWT verification:', error);
      return res.status(500).json({
        code: 'INTERNAL ERROR',
        message: 'Failed to verify token. Please try again later.',
      });
    }
    console.error('An error occurred during Google login:', error);
    return catchError(res, error);
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
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET,{ algorithm: 'HS256' });
  await user.update(
    { access_token: token },
    {
      where: {
        id: user.id,
      },
    }
  );
  const userMetrics = await db.userMetrics.findOne({ where: { userId: user.id } });
  const metricsExist = !!userMetrics;
  const { password: _, ...filteredUser } = user.toJSON();
  return res.status(200).json({
    code: "login sucess",
    data: filteredUser,
    metricsExist: metricsExist,
  });
};

module.exports = {
  googleLogin,
  signUp,
  signIn,
};
