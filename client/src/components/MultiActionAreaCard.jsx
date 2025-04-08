import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router";
import { Stack } from "@mui/material";

export default function MultiActionAreaCard({
  title,
  summary,
  image,
  alt,
  category,
  author,
  date,
}) {
  let navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 552 }}>
      <CardActionArea onClick={() => navigate("/blog-post")}>
        <CardMedia component="img" height="300px" image={image} alt={alt} />
        <CardContent>
          <Typography gutterBottom variant="subtitle2" component="div">
            {category}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {summary}
          </Typography>
          <br />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" component="div">
              {author}
            </Typography>
            <Typography variant="subtitle2" component="div">
              {date}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
