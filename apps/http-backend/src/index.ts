import express from "express";
const app = express();
app.use(express.json());

const port = 3003;


app.listen(port, () => {
  `http server is running on: http://localhost:${port}`;
});
