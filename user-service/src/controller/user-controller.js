const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User, RefreshToken, BlacklistedToken } = require("../../models");

// helper functions
const {
  VALIDATION_ERROR,
  STATUS_BAD_REQUEST,
  NOT_FOUND_ERROR,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
} = require("../constants/error-constants");
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_ALREADY_EXISTS,
  STATUS_NOT_FOUND,
  STATUS_UNAUTHORIZED,
  STATUS_FORBIDDEN,
} = require("../constants/status-codes");
const { makeStringLowercase } = require("../utils/string-modifier");
const { consumer, producer } = require("../../config/kafka");

const secretKey = process.env.JWT_SECRET || "SOME_VERY_STRONG_SECRET_KEY";

//helper functions
const generateToken = (user, type = "access") => {
  const options = {
    expiresIn: type === "access" ? "15m" : "7d", // Token expiration time
  };

  const token = jwt.sign(user, secretKey, options);

  return token;
};

const generateId = (user, count) => {
  if (count < 10) {
    count = "0000" + count;
  } else if (count < 100) {
    count = "000" + count;
  } else if (count < 1000) {
    count = "000" + count;
  } else if (count < 10000) {
    count = "0000" + count;
  }

  return user.split("").slice(0, 4).join("") + "_" + count;
};

// main functions
const login = async (req, res, next) => {
  const { username = null, email = null, password } = req.body;
  try {
    if ((!username && !email) || !password) {
      const error = new Error("Username or email and password are required");
      error.name = VALIDATION_ERROR;
      error.status = STATUS_BAD_REQUEST;
      throw error;
    }

    let user = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    });

    if (!user) {
      const error = new Error("User not found please register!");
      error.name = NOT_FOUND_ERROR;
      error.status = STATUS_NOT_FOUND;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("wrong username or password!");
      error.name = UNAUTHORIZED_ERROR;
      error.status = STATUS_UNAUTHORIZED;
      throw error;
    }

    const userdata = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      dob: user.dob || "",
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    let access_token = `Bearer ${generateToken(userdata)}`;
    let refresh_token = generateToken(userdata, "refresh");

    await RefreshToken.upsert({
      userId: user.userId,
      refreshToken: refresh_token,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true, // Not accessible via JavaScript
      //   secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
      maxAge: 3600000, // 1 hour
    });

    res.status(STATUS_OK).json({
      msg: "Login successful",
      user,
      token: access_token,
      status: STATUS_OK,
    });
  } catch (e) {
    next(e);
  }
};

const register = async (req, res, next) => {
  let { username, password, email, dob, firstName, lastName } = req.body;

  try {
    if (email) {
      const emailValidationErr = () => {
        const error = new Error("Email is not correct!");
        error.name = VALIDATION_ERROR;
        error.status = STATUS_BAD_REQUEST;
        throw error;
      };

      const temp = email.split("@")[1];
      if (!temp || temp.length <= 0) {
        emailValidationErr();
      } else {
        const [a, b] = temp.split(".");

        if (!a || !b || a.length <= 0 || b.length <= 0) {
          emailValidationErr();
        }
      }
    }

    if (!username || !password || !email) {
      const error = new Error("Username, email and password are required");
      error.name = VALIDATION_ERROR;
      error.status = STATUS_BAD_REQUEST;
      throw error;
    }

    const userCount = await User.count();

    let userId = generateId(username, userCount);

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }, { userId }],
      },
    });

    if (user) {
      const error = new Error("Username or email already exists");
      error.name = VALIDATION_ERROR;
      error.status = STATUS_ALREADY_EXISTS;
      throw error;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userObj = {
      username: makeStringLowercase(username),
      password: hashedPassword,
      email: makeStringLowercase(email),
      userId: makeStringLowercase(userId),
      firstName: firstName || "",
      lastName: lastName || "",
    };

    await User.create(userObj);

    res
      .status(STATUS_CREATED)
      .json({ msg: "User registered", status: STATUS_CREATED });
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      const error = new Error("User is not authorized!");
      error.name = FORBIDDEN_ERROR;
      error.status = STATUS_FORBIDDEN;
      throw error;
    }

    const refreshTokenFromBlackList = await BlacklistedToken.findOne({ token });

    if (refreshTokenFromBlackList) {
      const error = new Error("User is not authorized!");
      error.name = FORBIDDEN_ERROR;
      error.status = STATUS_FORBIDDEN;
      throw error;
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      const error = new Error("Invalid Creds!");
      error.name = UNAUTHORIZED_ERROR;
      error.status = STATUS_UNAUTHORIZED;
      throw error;
    }

    delete decoded.iat;
    delete decoded.exp;

    const access_token = `Bearer ${generateToken(decoded)}`;
    const refresh_token = generateToken(decoded, "refresh");

    await RefreshToken.updateOne(
      { user_id: decoded.id },
      { user_id: decoded.id, refresh_token }
    );

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true, // Not accessible via JavaScript
      //   secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
      maxAge: 3600000, // 1 hour
    });

    res
      .status(STATUS_OK)
      .json({ msg: "token", token: access_token, status: STATUS_OK });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const token = req.cookies.refresh_token;
  try {
    await BlacklistedToken.create({ token });

    res.status(STATUS_OK).json({ msg: "logged out", status: STATUS_OK });
  } catch (e) {
    next(e);
  }
};

const requestForMerchant = async (req, res, next) => {
  try {
    if (!req.user && req.user !== "user") {
      const error = new Error("User not valid!");
      error.name = VALIDATION_ERROR;
      error.status = STATUS_BAD_REQUEST;
      throw error;
    }

    // TODO: send message to dashboard service for merchant maker

    await producer.connect();
    await producer.send({
      topic: "make_merchant",
      messages: [{ value: req.user }],
    });
    await producer.disconnect();

    res
      .status(STATUS_OK)
      .json({ msg: "requested for merchant", status: STATUS_OK });
  } catch (e) {
    next(e);
  }
};

module.exports = { login, register, logout, refreshToken, requestForMerchant };
