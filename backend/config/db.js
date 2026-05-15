const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ihc_2026',
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Verifica conectividad inicial sin bloquear el arranque.
db.getConnection((err, connection) => {
  if (err) {
    console.warn('⚠️  Advertencia: No se pudo conectar a MySQL:', err.message);
    console.warn('El servidor API funcionará pero sin acceso a la base de datos');
    return;
  }

  console.log('✓ ¡Conectado a MySQL!');
  connection.release();
});

// Registra errores de pool/conexiones para observabilidad.
db.on('error', (err) => {
  console.error('Error en el pool de MySQL:', err.message);
});

module.exports = db;