const axios = require('axios');
const API = 'http://localhost:3001/api';

async function run() {
  try {
    // 1. Auth as superadmin
    console.log('Logging in...');
    const login = await axios.post(`${API}/auth/login`, {
      email: 'chentejardcruzz@gmail.com',
      password: 'coder225589'
    });
    const token = login.data.token;
    console.log('Login OK. Token obtained.');

    // 2. Get Alumnos
    const reqConf = { headers: { Authorization: `Bearer ${token}` } };
    const alumnos = await axios.get(`${API}/alumnos`, reqConf);
    const alumnoId = alumnos.data[0].id;
    console.log('Alumno selected:', alumnoId);

    // 3. Post Radar
    const payload = {
      alumno_id: alumnoId,
      emoji: '😡',
      estado: 'enojado',
      nota: '',
      fecha: new Date().toISOString().split('T')[0]
    };
    console.log('Sending payload:', payload);

    const res = await axios.post(`${API}/radar/reporte`, payload, reqConf);
    console.log('Success:', res.data);

  } catch (err) {
    if (err.response) {
      console.error('Server Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

run();
