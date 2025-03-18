import express from "express";
import routes from "./routes/routes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send("Hello World!");
});
	
app.use("/api", routes);

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
