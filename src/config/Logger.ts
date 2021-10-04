import NAMESPACES from "../enumerators/namespaces";

export const getTimestamp = (): string => new Date().toISOString();
const getMsg = (message: string) => (Boolean(message.trim().length) ? `: ${message}` : "");

const logInfoWIthOptionalObject = (info: string, object?: any) => {
  if (object) console.log(info, JSON.stringify(object));
  else console.log(info);
};

const info = (namespace: NAMESPACES, message: string, object?: any) => {
  const infoValue = `\n[INFO] [${getTimestamp()}] [${namespace}]${getMsg(message)}\n`;
  logInfoWIthOptionalObject(infoValue, object);
};

const warn = (namespace: NAMESPACES, message: string, object?: any) => {
  const warnValue = `\n[WARN] [${getTimestamp()}] [${namespace}]${getMsg(message)}\n`;
  logInfoWIthOptionalObject(warnValue, object);
};

const error = (namespace: NAMESPACES, message: string, object?: any) => {
  const errorValue = `\n[ERROR] [${getTimestamp()}] [${namespace}]${getMsg(message)}\n`;
  logInfoWIthOptionalObject(errorValue, object);
};

export { info, warn, error };
