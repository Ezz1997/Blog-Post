const MAX_NAME_LENGTH = 50;

// Validates that the name only contains characters
export function validateName(value) {
  let isAlphabetic = /^[a-zA-Z\s]+$/.test(value);

  // remove spaces
  let removedSpaceLength = value.replace(/\s/g, "").length;

  return (
    isAlphabetic && removedSpaceLength >= 1 && value.length <= MAX_NAME_LENGTH
  );
}

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const validatePassword = (password) => {
  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  return regex.test(password);
};
