const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

class Singleton{
    
  static createSingleton = (function () {
      let instance;

      function createInstance() {
        const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
          host: process.env.MYSQL_HOST,
          dialect: 'mysql',
          port: process.env.MYSQL_PORT,
        });
          return sequelize;
      }

      return {
          getInstance: function () {
              if (!instance) {
                  instance = createInstance();
              }
              return instance;
          }
      };
  })();

};

const User = Singleton.createSingleton.getInstance().define('user', {
  user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  lastname: {
      type: Sequelize.STRING,
      allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false
  },
  role: {
      type: Sequelize.STRING,
      allowNull: false
  }
}, { 
  timestamps: false,
  freezeTableName: true
});

  module.exports = {
    sequelize: Singleton.createSingleton.getInstance(),
    user : User
};