import Joi from "joi";
//  This ensures users provide valid and secure data when registering.
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase, one lowercase, one number, and one special character",
      "string.min": "Password must be at least 8 characters long",
    }),
});
// Ensuring login credentials are present and email is valid.
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
// Ensuring that the user choosse a strong and diff pass
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .required()
    .invalid(Joi.ref("currentPassword")) // Alternative to disallow
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase, one lowercase, one number and one special character",
      "any.invalid": "New password cannot be the same as current password",
    }),
});
