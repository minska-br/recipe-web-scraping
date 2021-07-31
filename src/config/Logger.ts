import NAMESPACES from '../enumerators/namespaces';

const getTimesStamp = (): string => new Date().toISOString();

const logInfoWIthOptionalObject = (info: string, object?: any) => {
  if (object) console.log(info, object);
  else console.log(info);
};

const info = (namespace: NAMESPACES, message: string, object?: any) => {
  const infoValue = `\n[INFO] [${getTimesStamp()}] [${namespace}] - ${message}\n`;
  logInfoWIthOptionalObject(infoValue, object);
};

const warn = (namespace: NAMESPACES, message: string, object?: any) => {
  const warnValue = `\n[WARN] [${getTimesStamp()}] [${namespace}] - ${message}\n`;
  logInfoWIthOptionalObject(warnValue, object);
};

const error = (namespace: NAMESPACES, message: string, object?: any) => {
  const errorValue = `\n[ERROR] [${getTimesStamp()}] [${namespace}] - ${message}\n`;
  logInfoWIthOptionalObject(errorValue, object);
};

export { info, warn, error };
