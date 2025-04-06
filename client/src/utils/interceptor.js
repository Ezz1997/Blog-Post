import { validateToken } from "../utils/tokenValidation";

// Environment variables
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PORT = import.meta.env.VITE_PORT;
const REFRESH_URL = `${BASE_URL}:${PORT}/api/users/refresh`;

const { fetch: originalFetch } = window;

export async function apiFetch(resource, config = {}, setAccessToken = null) {
  console.log("Intercepted fetch for: ", resource);

  const authHeader = config.headers["Authorization"];
  if (!authHeader || resource === REFRESH_URL) {
    return originalFetch(resource, config);
  }

  // Ensure headers object exists if we need to modify later
  config.headers = new Headers(config.headers || {});

  const accessToken = authHeader.split("Bearer ")[1];
  const isTokenValid = validateToken(accessToken);

  if (isTokenValid) {
    console.log(
      "Interceptor: Token is valid, proceeding with original request."
    );
    return originalFetch(resource, config);
  } else {
    try {
      console.log(
        "Interceptor: Token is not valid, proceeding with token refresh request."
      );
      const refresh_res = await originalFetch(REFRESH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!refresh_res.ok) {
        // Refresh failed (e.g, expired refresh token, server error)
        console.error(
          `Interceptor: Token refresh failed with status: ${refresh_res.status}`
        );
        return refresh_res;
      }

      const data = await refresh_res.json();
      const newToken = data.accessToken;

      if (!newToken) {
        console.error(
          "Interceptor: Refresh endpoint did not return a new token"
        );
        return new Response(
          JSON.stringify({ error: "Token refresh failed internally." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log(
        "Interceptor: Token refreshed successfully. Retrying original request."
      );

      // Update the config with the NEW token obtained by the ongoing refresh
      config.headers.set("Authorization", `Bearer ${newToken}`);

      setAccessToken(newToken);

      const retryRes = await originalFetch(resource, config);
      return retryRes;
    } catch (error) {
      console.error(
        "Interceptor: Unhandled error during token refresh or retry: ",
        error
      );
      throw error;
    }
  }
}
