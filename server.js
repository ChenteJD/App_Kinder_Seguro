console.log('¡Servidor iniciado con nodemon!');

import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('¡Servidor iniciado con nodemon y morgan!');
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});