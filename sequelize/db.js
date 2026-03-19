'use strict';
process.loadEnvFile(`${__dirname}/../config.env`);
const { Sequelize, DataTypes } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const mylog = require('../log');
const logging =
  process.env.NODE_ENV === 'production' ? false : (...msg) => mylog.log(msg[0]); //mylog.log.bind(mylog);

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: 'localhost',
    dialect: 'mariadb',
    logging: logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

const connectToDB = async () => {
  const date = new Date().toLocaleString('en-ZA');
  await sequelize.authenticate();
  mylog.log(
    `MariaDB: database connection established successfully. At ${date.split(', ')[1]}.`,
  );
};

const migratorConfig = {
  migrations: { glob: 'migrations/*.js' },
  storage: new SequelizeStorage({ sequelize }),
  context: sequelize.getQueryInterface(),
  logger: mylog,
};

const runMigrations = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migratorConfig);
  const migrations = await migrator.up();
  mylog.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const undoMigrations = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migratorConfig);
  const migrations = await migrator.down();
  mylog.log('Migrations reverted', {
    files: migrations.map((mig) => mig.name),
  });
};

module.exports = { sequelize, connectToDB, runMigrations, undoMigrations };
