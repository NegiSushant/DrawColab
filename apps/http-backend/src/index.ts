import express from "express";
import router from "./routes/routes";
const app = express();
app.use(express.json());

console.log("test 1");
const port = 3003;

app.use("/api", router);
app.listen(port, () => {
  `http server is running on: http://localhost:${port}`;
});
