import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router";

export default function MultiActionAreaCard({ title, summary, image, alt }) {
  let navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 552 }}>
      <CardActionArea onClick={() => navigate("/blog-post")}>
        <CardMedia component="img" height="140" image={image} alt={alt} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {summary}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
