import express from "express";
import cors from "cors";
import router from "./routes/routes";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "http backend up!",
  });
});


const port = 3003;

app.use("/api", router);
app.listen(port, () => {
  `http server is running on: http://localhost:${port}`;
});
