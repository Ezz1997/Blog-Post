import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Container } from "@mui/material";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PORT = import.meta.env.VITE_PORT;

export default function Test() {
  const { userPost } = useContext(AppContext);

  return (
    <>
      {userPost && (
        <Container
          sx={{
            marginTop: "2vh",
            marginBottom: "2vh",
          }}
          maxWidth="sm"
          dangerouslySetInnerHTML={{ __html: userPost }}
        />
      )}
    </>
  );
}
