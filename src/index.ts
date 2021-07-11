import * as express from 'express';
import { Request, Response } from 'express';

import serverConfig from './config/serverConfig';
import serverRunning from './utils/serverRunnings';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request: Request, response: Response) => {
  return response.json({ success: true });
});


app.listen(serverConfig.port, () => serverRunning(serverConfig));
