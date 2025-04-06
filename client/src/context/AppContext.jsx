import { createContext, useState, useEffect } from "react";

// Environment variables
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PORT = import.meta.env.VITE_PORT;
const REFRESH_URL = `${BASE_URL}:${PORT}/api/users/refresh`;

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(false);

  const value = {
    userData,
    setUserData,
    accessToken,
    setAccessToken,
    isLoading,
    setIsLoading,
  };

  useEffect(() => {
    console.log("Access Token: ", accessToken);
  }, [accessToken]);

  useEffect(() => {
    let isMounted = true; // Prevent state update if component unmounts during fetch
    setIsLoading(true); // Ensure loading is true when effect runs

    fetch(REFRESH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          // Handle HTTP errors (like 401 Unauthorized)
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && isMounted) {
          if (!data.error && data.accessToken) {
            // Check specifically for accessToken
            setAccessToken(data.accessToken);
          } else {
            setAccessToken(null); // Set explicitly to null on error or missing token
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Refresh error:", err);
          setAccessToken(null); // Clear token on any fetch error
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false); // <-- Set loading to false regardless of success/failure
        }
      });

    return () => {
      isMounted = false; // Cleanup function for when the component unmounts
    };
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
