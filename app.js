// Initilisation
const express = require('express');
//const mylog = require('./log');

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception, oh no! Shutting down...');
  console.log(`${err.message}, ${err}`);
  console.log(err.stack);

  process.exit(1);
});

const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authLimiter = require('./utils/rateLimit');
const mongoSanitise = require('express-mongo-sanitize');
const deepSanitize = require('./utils/sanitizer');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const dataRouter = require('./routes/dataRoute');
const userRouter = require('./routes/userRoute');
const dbcrossoverRouter = require('./routes/dbxRoute');
const viewRouter = require('./routes/viewRoute');
const AppError = require('./utils/AppError');
const globErrHandler = require('./controllers/errorController');

const { connectToDB, sequelize } = require('./sequelize/db');

// Mongoose
const DB = process.env.MONGO_DATABASE.replace(
  '<DB_PASSWORD>',
  process.env.MONGO_PASSWORD,
);

const connectDB = async () => {
  const date = new Date().toLocaleString('en-ZA');
  try {
    await mongoose.connect(DB);
    logger.info(
      `MongoDB: database connection succesful! At ${date.split(', ')[1]}`,
    );
  } catch (err) {
    logger.error('MongoDB connection failed!');
    logger.error(err.name, err.message);
  }
};

connectDB();

// Sequelize
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true }).then(() => {
    const date = new Date().toLocaleString('en-ZA');
    logger.info(`MariaDB connection successful! At ${date.split(', ')[1]}`);
  });
} else if (process.env.NODE_ENV === 'production') {
  (async () => {
    try {
      await connectToDB();
    } catch (err) {
      logger.error('Problem connecting to MariaDB database', err);
    }
  })();
}

// Global Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    ...Object.getOwnPropertyDescriptor(req, 'query'),
    value: req.query,
    writable: true,
  });
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString('en-ZA');
  logger.log({
    level: 'http',
    message: `/////// ${req.method} from ${req.socket.remoteAddress} at ${req.requestTime.split(', ')[1]}`,
  });

  next();
});

const morganLogStream = fs.createWriteStream(
  path.join('./logs', 'access.log'),
  {
    flags: 'a',
  },
);

if (process.env.NODE_ENV === 'production')
  app.use(morgan('combined', { stream: morganLogStream }));

const limiter = rateLimit({
  max: process.env.MAX_TRIES,
  windowMs: Number(process.env.TRY_WINDOW),
  message: 'Too many requests from this IP. Please try again later.',
});

app.use('/api', limiter);
app.use('/api/v1/users', authLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitise());

app.use((req, res, next) => {
  deepSanitize(req.body);
  next();
});

// Routes
app.use('/api/v1/data', dataRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/dbx', dbcrossoverRouter);
app.use('/', viewRouter);

// Server
const port = process.env.PORT || 3000;

const server = app.listen(port, '127.0.0.1', () => {
  const date = new Date().toLocaleString('en-ZA');
  logger.info(`App is running on port ${port}, at ${date}`);
});

//Error handling
app.all('/{*any}', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globErrHandler);

process.on('unhandledRejection', (err) => {
  logger.error(`${err.name}, ${err.message}`);
  logger.error('Unhandled rejection, oh no! Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info(`Server shutting down on ${new Date().toLocaleString('en-ZA')}`);
  server.close();
  process.exit(0);
});

module.exports = app;
