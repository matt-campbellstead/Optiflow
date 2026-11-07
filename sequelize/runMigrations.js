const { runMigrations, sequelize } = require('./db');

runMigrations()
  .then(async () => {
    await sequelize.close();
    process.exit(0);
  })
  .catch(async (err) => {
    logger.error('Migration failed:', err);
    await sequelize.close();
    process.exit(1);
  });
