import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { apiFetch } from "../utils/interceptor";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PORT = import.meta.env.VITE_PORT;

export default function Test() {
  const [users, setUsers] = useState(null);
  const { accessToken, setAccessToken, userPost } = useContext(AppContext);

  useEffect(() => {
    let isMounted = true; // prevent state update if component is unmounted

    apiFetch(
      `${BASE_URL}:${PORT}/api/users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
      setAccessToken
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          if (isMounted) {
            setUsers(data);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setUsers(null);
        }
        console.error(err);
      });

    return () => {
      isMounted = false; // Cleanup function for when the compoent unmounts
    };
  }, []);

  return (
    <>
      <h1>Get all users: </h1>
      {users &&
        users.map((user, idx) => {
          return (
            <h1 key={user._id}>
              {idx}: firstname: {user.firstname}, lastname: {user.lastname},
              email: {user.email}
            </h1>
          );
        })}
    </>
  );
}
