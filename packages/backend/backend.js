import express from "express";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("steamNgin");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });