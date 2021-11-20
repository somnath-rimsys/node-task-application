const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendAccountCancelEmail } = require("../emails/email");
const settings = require("../constant/constants");

const router = express.Router();
const User = require("../models/user");
const auth = require("../middlewares/auth");

const avatarUploadConfig = new multer({
  limits: {
    fileSize: settings.profile.fileSize,
  },
  fileFilter(req, file, cb) {
    const allowedTypes = settings.profile.fileType
      .replaceAll(" ", "")
      .replaceAll(",", "|");
    const regx = new RegExp(`\.(${allowedTypes})$`, "g");
    if (!file.originalname.match(regx)) {
      return cb(
        new Error(
          "File must be any of these types " + settings.profile.fileType
        )
      );
    }
    cb(undefined, true); // File is correct type
  },
});

/*
 *
 *  type: post
 *  header: none
 *  body: {
 *           name(String),
 *           email(String),
 *           password(String),
 *           age(Number)(optional)
 *        }
 *  description: Create a new user
 *
 */
router.post("/user/create", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
 *
 *  type: post
 *  header: none
 *  body: {
 *          email (String)
 *          password (String)
 *        }
 *  description: User login
 *
 */
router.post("/user/login", async (req, res) => {
  try {
    /*
     *   User.findByCredentials is a user defined method.
     *   It is defined in the models/user.js file.
     */
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    /*
     *   user.generateAuthToken() is a user defined method.
     *   It is defined in the models/user.js file.
     */
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
 *
 *  type: post
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: none
 *  description: User logout
 *
 */
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((d) => d.token != req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

/*
 *
 *  type: post
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: none
 *  description: Logout from all sessions
 *
 */
router.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

/*
 *
 *  type: get
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: none
 *  description: Get all users
 *
 */
router.get("/user/all", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
 *
 *  type: get
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: none
 *  description: Get user profile
 *
 */
router.get("/user/profile", auth, async (req, res) => {
  res.send(req.user);
});

/*
 *
 *  type: patch
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: {
 *          name(String),
 *          email(String),
 *          password(String),
 *          age(Number)
 *        }
 *  param: none
 *  description: Update a user profile
 *
 */
router.patch("/user/update", auth, async (req, res) => {
  // Checking if the req.body contains some invalid keys or not.
  const allowedUpdateKeys = ["name", "email", "password", "age"];
  const updateKeys = Object.keys(req.body);

  if (!updateKeys.length)
    return res.status(400).send({ error: `Invalid upates!` });

  const isValidKeys = updateKeys.every((value) =>
    allowedUpdateKeys.includes(value)
  );

  if (!isValidKeys) return res.status(400).send({ error: `Invalid upates!` });

  try {
    updateKeys.forEach(
      (updateKey) => (req.user[updateKey] = req.body[updateKey])
    );
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
 *
 *  type: delete
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: none
 *  param: none
 *  description: Delete a user profile
 *
 */
router.delete("/user/delete", auth, async (req, res) => {
  try {
    req.user.remove();
    sendAccountCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

/*
 *
 *  type: post
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: avatar(file)
 *  description: Upload user avatar
 *
 */
router.post(
  "/user/profile/avatar",
  auth,
  avatarUploadConfig.single("avatar"),
  async (req, res) => {
    // Converting the uploaded image to .png format and resizing it before saving it to db.
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: settings.profile.width,
        height: settings.profile.height,
      })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);

/*
 *
 *  type: delete
 *  header: {
 *            "Authorization" : "Bearer jwt-token"
 *          }
 *  body: none
 *  description: Delete user avatar
 *
 */
router.delete("/user/profile/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

/*
 *
 *  type: get
 *  header: none
 *  body: none
 *  param: id
 *  description: Get user avatar by id
 *
 */
router.get("/user/profile/avatar", async (req, res) => {
  try {
    const id = req.query.id;
    const user = await User.findById(id);
    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
