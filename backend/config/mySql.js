const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mrtecno', 'mrtecno', 'mrtecno', {
  host: 'mysql',
  dialect: 'mysql',
  port: 3306,
});


async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connect();