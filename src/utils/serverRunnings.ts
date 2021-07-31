import { info } from "../config/logger";
import NAMESPACES from "../enumerators/namespaces";

interface serverInfo {
  hostname: string;
  port: number;
}
export default function serverRunning({ hostname, port }: serverInfo) {
  info(NAMESPACES.Server, `\n\tServer running on http://${hostname}:${port}\n`);
}
