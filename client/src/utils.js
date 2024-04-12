const validatePassword = (password) => {
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
  const hasNumber = /[0-9]+/.test(password);
  const hasUpperCase = /[A-Z]+/.test(password);
  const hasMinimumLength = password.length >= 8;

  const errors = [];
  if (!hasSpecialChar) {
    errors.push({
      isError: true,
      message: "Password must contain at least one special character",
    });
  }
  if (!hasNumber) {
    errors.push({
      isError: true,
      message: "Password must contain at least one number.",
    });
  }
  if (!hasUpperCase) {
    errors.push({
      isError: true,
      message: "Password must contain at least one uppercase letter.",
    });
  }
  if (!hasMinimumLength) {
    errors.push({
      isError: true,
      message: "Password must be at least 8 characters long.",
    });
  }

  return errors;
};

export { validatePassword };
