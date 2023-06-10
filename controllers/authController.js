const Joi = require("joi");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// generate token
function generateToken(id) {
  console.log(process.env.JWT_SECRET)
  return jwt.sign({ id }, 'model' , { expiresIn: "1h" });
}

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "this email already registered";
    return errors;
  }

  if (err.message.includes("email")) {
    errors.email = err.message;
    return errors;
  } else if (err.message.includes("password")) {
    errors.password = err.message;
    return errors;
  }

  return errors;
};

// signup controller
module.exports.Signup_post = async (req, res) => {
  const { body } = req;

  const JoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(16),
  });

  const result = JoiSchema.validate(body);
  const { value, error } = result;

  const valid = error == null;

  if (!valid) {
    const errors = handleErrors(error);
    res.status(422).json({ errors, data: value, success: false });
  } else {
    const salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(value.password, salt);

    try {
      const user = await User.create({
        email: value.email,
        password: hashed,
      });

      const token = generateToken(user._id);

      res.status(200).json({
        message: "Signup Successfully",
        data: {
          user: {
            email: user.email,
            _id: user.id,
          },
        },
        success: true,
        jwt: token,
      });
    } catch (error) {
      console.log(error);
      const errors = handleErrors(error);
      res.status(500).json({ errors: errors, success: false });
    }
  }
};

module.exports.Login_post = async (req, res) => {
  const { body } = req;

  const JoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(16),
  });

  const result = JoiSchema.validate(body);
  const { value, error } = result;

  const valid = error == null;

  if (!valid) {
    const errors = handleErrors(error);
    res.status(422).json({ errors, data: value, success: false });
  } else {
    try {
      const user = await User.login(value.email, value.password);
      const token = generateToken(user?._id);
      // res.setHeader("Authorization", `Bearer ${token}`);
      res.status(200).json({
        message: "Login Successfully",
        data: {
          user: {
            email: user?.email,
            _id: user?.id,
            role: user?.role,
          },
        },
        success: true,
        jwt: token,
      });
    } catch (error) {
      const errors = handleErrors(error);
      res.status(422).json({ errors, data: value, success: false });
      // res.status(400).json({error})
    }
  }
};

module.exports.remove_all_users = async function (req, res) {
  try {
    const remove = await User.deleteMany();
    res.status(200).json({ remove });
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports.get_all_users = async function (req, res) {
  try {
    const all = await User.find();
    res.status(200).json({ data: all });
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports.edit_user = async function (req, res) {
  const { body } = req;
  let data = {
    email: body.email,
    password: body.password,
    role: body.role,
  };

  try {
    const currentUser = await User.findById(req.params.id);
    if (currentUser) {
      const update = await User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            email: data.email,
            password: data.password,
            role: data.role,
          },
        }
      );

      res.status(200).json({
        success: true,
        data: update,
        msg: "Update successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating record" });
  }
};
