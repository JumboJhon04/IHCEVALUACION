const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const initializeDatabase = () => {
  // Conexión sin base de datos para crear la BD
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  connection.connect((err) => {
    if (err) {
      console.warn('⚠️  No se pudo conectar a MySQL. Saltando inicialización de BD.');
      console.warn('    Error:', err.message);
      return;
    }

    // Primero crear la BD si no existe
    connection.query('CREATE DATABASE IF NOT EXISTS usability_dashboard', (error) => {
      if (error) {
        console.warn('⚠️  Error al crear BD:', error.message);
        connection.end();
        return;
      }

      // Cambiar a la BD
      connection.query('USE usability_dashboard', (error) => {
        if (error) {
          console.warn('⚠️  Error al seleccionar BD:', error.message);
          connection.end();
          return;
        }

        // Ejecutar el SQL
        const sqlPath = path.join(__dirname, 'usability_dashboard.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        connection.query(sql, (error) => {
          if (error) {
            console.warn('⚠️  Advertencia al inicializar BD:', error.message);
          } else {
            console.log('✓ Base de datos inicializada correctamente');
          }
          connection.end();
        });
      });
    });
  });
};

module.exports = initializeDatabase;
