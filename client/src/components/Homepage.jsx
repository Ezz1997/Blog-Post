import { useState } from "react";
import Container from "@mui/material/Container";
import Card from "./MultiActionAreaCard";
import { Box, Grid, Grid2, List, ListItem } from "@mui/material";
import mockBlogPosts from "./mockBlogPosts";
import Pagination from "@mui/material/Pagination";
const NUM_DISPLAYED = 6;

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
      maxWidth="lg"
    >
      <Grid2
        container
        spacing={2}
        sx={{
          m: 1,
          p: 1,
          justifyContent: { xs: "center", lg: "left" },
        }}
      >
        {mockBlogPosts
          .slice((page - 1) * NUM_DISPLAYED, page * NUM_DISPLAYED)
          .map((post) => (
            <Grid2 key={post.title}>
              <Card
                title={post.title}
                summary={post.summary}
                image={post.image}
                alt={post.alt}
                category={post.category}
                author={post.author}
                date={post.date}
              ></Card>
            </Grid2>
          ))}
      </Grid2>

      <Pagination
        count={Math.ceil(mockBlogPosts.length / NUM_DISPLAYED)}
        page={page}
        onChange={handleChange}
      />
    </Container>
  );
}

export default Homepage;
