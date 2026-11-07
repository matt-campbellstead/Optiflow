const { undoMigrations, sequelize } = require('./db');

undoMigrations()
  .then(async () => {
    await sequelize.close();
    process.exit(0);
  })
  .catch(async (err) => {
    logger.error('Migration rollback failed:', err);
    await sequelize.close();
    process.exit(1);
  });
