import { useState } from "react";
import Container from "@mui/material/Container";
import Card from "./MultiActionAreaCard";
import { List, ListItem } from "@mui/material";
import mockBlogPosts from "./mockBlogPosts";
import Pagination from "@mui/material/Pagination";

const NUM_DISPLAYED = 5;

function Homepage() {
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container
      sx={{
        marginTop: "2vh",
        marginBottom: "2vh",
      }}
      maxWidth="sm"
    >
      <List>
        {mockBlogPosts
          .slice((page - 1) * NUM_DISPLAYED, page * NUM_DISPLAYED)
          .map((post) => {
            return (
              <ListItem key={post.image}>
                <Card
                  title={post.title}
                  summary={post.summary}
                  image={post.image}
                  alt={post.alt}
                />
              </ListItem>
            );
          })}
      </List>

      <Pagination
        count={Math.ceil(mockBlogPosts.length / NUM_DISPLAYED)}
        page={page}
        onChange={handleChange}
      />
    </Container>
  );
}

export default Homepage;
