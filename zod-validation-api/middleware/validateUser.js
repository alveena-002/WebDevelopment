import { userSchema } from "../schemas/userSchema.js";

const validateUser = (req, res, next) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
  }

  req.body = result.data;

  next();
};

export default validateUser;