const { check, validationResult } = require("express-validator");

exports.registerRules = () => [
  check("name", "Name is required").notEmpty(),
  check("last_name", "Last name is required").notEmpty(),
  check("email", "Valid email is required").isEmail(),
  check("password", "Password must be 6-20 characters").isLength({ min: 6, max: 20 }),
];

exports.loginRules = () => [
  check("email", "Valid email is required").isEmail(),
  check("password", "Password must be 6-20 characters").isLength({ min: 6, max: 20 }),
];

exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array().map((el) => ({ msg: el.msg })),
    });
  }
  next();
};
