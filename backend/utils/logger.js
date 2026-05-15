const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

// Crear directorio de logs si no existe
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);

const logger = {
  info: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] INFO: ${message} ${JSON.stringify(data)}\n`;
    fs.appendFileSync(logFile, logEntry);
    console.log(`✓ ${message}`, data);
  },

  error: (message, error = {}) => {
    const timestamp = new Date().toISOString();
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      code: error.code
    } : error;
    const logEntry = `[${timestamp}] ERROR: ${message} ${JSON.stringify(errorDetails)}\n`;
    fs.appendFileSync(logFile, logEntry);
    console.error(`✗ ERROR: ${message}`, errorDetails);
  },

  warn: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] WARN: ${message} ${JSON.stringify(data)}\n`;
    fs.appendFileSync(logFile, logEntry);
    console.warn(`⚠ ${message}`, data);
  }
};

module.exports = logger;
