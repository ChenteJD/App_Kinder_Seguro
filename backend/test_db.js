const { connectDB, query } = require('./src/config/database');
connectDB().then(() => {
  console.log('DB OK');
  const users = query('SELECT id, nombre, email, rol FROM usuarios LIMIT 5');
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
