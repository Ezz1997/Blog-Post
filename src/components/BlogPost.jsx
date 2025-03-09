import Container from "@mui/material/Container";
import parse from "html-react-parser";
import "../styles.css";

const htmlContent = `<p class="editor-paragraph" dir="ltr"><b><strong 
class="editor-text-bold" style="white-space: pre-wrap;">Bold</strong></b></p><p 
class="editor-paragraph" dir="ltr"><i><em class="editor-text-italic" style="white-space: pre-wrap;">
Italic</em></i></p><p class="editor-paragraph" dir="ltr"><code spellcheck="false" style="white-space: pre-wrap;">
<span class="editor-text-code">Code</span></code></p><p class="editor-paragraph" dir="ltr"><a href="https://www.xyz.com"
rel="noreferrer" class="editor-link" dir="ltr"><span style="white-space: pre-wrap;">link</span></a></p><blockquote 
class="editor-quote"><span style="white-space: pre-wrap;">Quote</span></blockquote><ul class="editor-list-ul"><li value="1"
class="editor-listitem"><span style="white-space: pre-wrap;">Bullet list item 1</span></li><li value="2" class="editor-listitem">
<span style="white-space: pre-wrap;">Item 2</span></li></ul><p class="editor-paragraph" style="text-align: right;"><span 
style="white-space: pre-wrap;">Right</span></p><p class="editor-paragraph" style="text-align: center;"><span style="white-space:
pre-wrap;">Center</span></p><h1 class="editor-heading-h1" style="text-align: center;"><span style="white-space: pre-wrap;
">H1</span></h1><h2 class="editor-heading-h2" style="text-align: center;"><span style="white-space: pre-wrap;">H2</span></h2><p class="editor-paragraph"><br></p>`;

function BlogPost() {
  const reactElements = parse(htmlContent);

  return (
    <Container
      sx={{
        marginTop: "2vh",
        marginBottom: "2vh",
        rowGap: 2,
      }}
      maxWidth="sm"
    >
      {reactElements}
    </Container>
  );
}

export default BlogPost;
