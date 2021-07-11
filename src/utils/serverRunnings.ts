interface serverInfo {
  hostname: string;
  port: number;
}
export default function serverRunning({ hostname, port }: serverInfo) {
  console.info(`\n\tServer running on http://${hostname}:${port}\n`);
}
