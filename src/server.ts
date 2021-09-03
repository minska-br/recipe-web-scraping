import express, { Request, Response } from "express";
import serverConfig from "./config/serverConfig";
import recipeRouter from "./routes/recipeRouter";
import translationsRouter from "./routes/translationsRouter";
import serverRunning from "./utils/serverRunnings";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request: Request, response: Response) => {
  return response.json({ success: true });
});

app.use("/recipes", recipeRouter);
app.use("/translations", translationsRouter);

app.listen(serverConfig.port, () => serverRunning(serverConfig));
