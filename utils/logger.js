const { createLogger, format, transports, addColors } = require('winston');

const { combine, timestamp, label, printf } = format;

const mattFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}[${label}]${level}: ${message}`;
});

const myLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    info: 'green',
    http: 'blue',
  },
};

addColors(myLevels.colors);

const logger = createLogger({
  level: 'http',
  levels: myLevels.levels,
  format: combine(
    label({ label: 'OFS' }),
    timestamp(),
    mattFormat,
    format.colorize(),
  ),
  transports: [
    new transports.File({ filename: './logs/app-info.log ' }),
    new transports.File({
      filename: './logs/app-error.log',
      level: 'error',
    }),
  ],
});

module.exports = logger;
