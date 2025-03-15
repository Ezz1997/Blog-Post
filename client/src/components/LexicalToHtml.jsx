import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { Button } from "@mui/material";

export const LexicalToHtml = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = () => {
    editor.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      console.log(htmlString);
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
