import validator from "validator";

export const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

export const validateEditProfileData = (req) => {
  const allowedMethods = [
    "firstName",
    "age",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedMethods.includes(field)
  );
  return isAllowed;
};

