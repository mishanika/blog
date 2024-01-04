import cors from "cors";
import express from "express";
import router from "./src/routes/index";

const app = express();
const port = 3030;
// const corsOptions = {
//   origin: "http://localhost:3000",
// };

app.use(express.static("photos"));
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
