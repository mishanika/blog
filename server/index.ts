import cors from "cors";
import "dotenv/config";
import express from "express";
import router from "./src/routes/index";
import { createSocket } from "./src/modules/socket.module";

const app = express();
const port = 3030;

// const corsOptions = {
//   origin: "http://localhost:3000",
// };

//console.log(process.env);
app.use(express.static("photos"));
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(router);
const socket = createSocket();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
