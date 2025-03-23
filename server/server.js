import { createServer } from "http";
import userRoutes from "./routes/userRoutes.js";

const PORT = process.env.PORT || 4000;
const HOST_NAME = process.env.HOST_NAME;

// Json middleware
const jsonMiddleware = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
};

const server = createServer((req, res) => {
  jsonMiddleware(req, res, () => {
    try {
      const method = req.method;
      const path = req.url;

      let handler = userRoutes[path] && userRoutes[path][method];

      if (handler) {
        const dynamicRoute = userRoutes[path][method];
        dynamicRoute(req, res);
        return;
      } else {
        const routeKeys = Object.keys(userRoutes).filter((key) =>
          key.includes(":")
        );

        const matchedKey = routeKeys.find((key) => {
          // replacing each segment of the key that starts with a colon (:)
          const regex = new RegExp(`^${key.replace(/:[^/]+/g, "([^/]+)")}$`);
          return regex.test(path);
        });

        if (matchedKey) {
          const dynamicHandler = userRoutes[matchedKey][method];

          handler = dynamicHandler;
        }
      }

      // url and method not match
      if (!handler) {
        handler = userRoutes.notFound;
      }

      handler(req, res);
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
});

server.listen(PORT, HOST_NAME, () => {
  console.log(`Server running at http:/${HOST_NAME}:${PORT}`);
});
