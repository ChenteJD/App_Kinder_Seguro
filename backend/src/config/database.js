const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '../../', process.env.DB_PATH || 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite conectado correctamente en:', dbPath);
    // Sync: alter=true en dev para migraciones automáticas sin borrar datos
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Modelos sincronizados con la DB');
  } catch (error) {
    console.error('❌ Error conectando a SQLite:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
