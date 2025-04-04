import { jwtDecode } from "jwt-decode";

// A function for validating jwt token
export const validateToken = (token) => {
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);

    if (!decodedToken || typeof decodedToken.exp !== "number") {
      console.error("Invalid token payload for validation.");
      return false;
    }

    const curDate = new Date();
    // Check if expiration time is in the future
    // Add small buffer (e.g., 10 seconds) to prevent issues near expiry
    const bufferSeconds = 10;
    return decodedToken.exp * 1000 > curDate.getTime() + bufferSeconds * 1000;
  } catch (error) {
    console.error("Error validating token", error);
    return false;
  }
};
