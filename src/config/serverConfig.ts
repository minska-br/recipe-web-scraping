import * as dotenv from "dotenv";

dotenv.config();

const port: number = parseInt(process.env.PORT as string, 10);
const hostname: string = process.env.HOSTNAME as string;

const serverConfig = { port, hostname };

export default serverConfig;
