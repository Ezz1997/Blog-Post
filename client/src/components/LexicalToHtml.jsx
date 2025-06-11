import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { Button } from "@mui/material";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

export const LexicalToHtml = () => {
  const [editor] = useLexicalComposerContext();
  const { setUserPost } = useContext(AppContext);

  const handleOnClick = () => {
    editor.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      setUserPost(htmlString);
      console.log("Hi, this is the post in html:\n ", htmlString);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <Button
        onClick={handleOnClick}
        variant="contained"
        sx={{ margin: 1, backgroundColor: "#222831" }}
      >
        Post
      </Button>
    </div>
  );
};
