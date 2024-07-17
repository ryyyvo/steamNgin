import express, { json } from "express";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("steamNgin");
});

app.get("/app", (req, res) => {
    res.send("steamNgin");
});

app.get("/app", (req, res) => {
	res.send("steamNgin");
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });


