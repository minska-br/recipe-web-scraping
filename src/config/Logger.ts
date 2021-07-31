import NAMESPACES from "../enumerators/namespaces";

const getTimesStamp = (): string => new Date().toISOString();
const getMsg = (message: string) => (Boolean(message.trim().length) ? `: ${message}` : "");

const logInfoWIthOptionalObject = (info: string, object?: any) => {
  if (object) console.log(info, object);
  else console.log(info);
};

const info = (namespace: NAMESPACES, message: string, object?: any) => {
  const infoValue = `\n[INFO] [${getTimesStamp()}] [${namespace}]${getMsg(message)}\n`;
  logInfoWIthOptionalObject(infoValue, object);
};

const warn = (namespace: NAMESPACES, message: string, object?: any) => {
  const warnValue = `\n[WARN] [${getTimesStamp()}] [${namespace}]${getMsg(message)}\n`;
  logInfoWIthOptionalObject(warnValue, object);
};

const error = (namespace: NAMESPACES, message: string, object?: any) => {
  const errorValue = `\n[ERROR] [${getTimesStamp()}] [${namespace}]${getMsg(message)}\n`;
  logInfoWIthOptionalObject(errorValue, object);
};

export { info, warn, error };
