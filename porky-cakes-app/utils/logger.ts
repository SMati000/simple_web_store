import Constants from 'expo-constants';

type LogLevel = 'debug' | 'info' | 'error';

let currentLogLevel: LogLevel = Constants.expoConfig?.extra?.LOG_LEVEL;

// Simple priority map
const logPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  error: 2,
};

function shouldLog(level: LogLevel) {
  return logPriority[level] >= logPriority[currentLogLevel];
}

function getCallerLocation(): string {
  const err = new Error();
  const stack = err.stack?.split('\n') ?? [];
  // usually the 3rd line is the caller
  const line = stack[3]?.trim() ?? '';

  // Extract only the part before the first space or URL query
  const match = line.match(/^(.+?)\s?\(/);
  if (match) return `(${match[1]})`;
  return `(${line})`;
}

const logger = {
  debug: (...args: any[]) => {
    if (!shouldLog('debug')) return;
    console.log('[DEBUG]', getCallerLocation(), ...args);
  },
  info: (...args: any[]) => {
    if (!shouldLog('info')) return;
    console.log('[INFO]', getCallerLocation(), ...args);
  },
  error: (...args: any[]) => {
    if (!shouldLog('error')) return;
    console.error('[ERROR]', getCallerLocation(), ...args);
  },
};

export default logger;
