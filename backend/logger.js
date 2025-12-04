const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, 'application.log');

// Log levels
const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
};

/**
 * Write log entry to file
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} metadata - Additional metadata
 */
function writeLog(level, message, metadata = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    application: 'fusion-electronics',
    environment: process.env.NODE_ENV || 'development',
    ...metadata
  };

  // Write to file
  fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');

  // Also log to console
  const consoleMessage = `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`;
  
  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error(consoleMessage, metadata);
      break;
    case LOG_LEVELS.WARN:
      console.warn(consoleMessage, metadata);
      break;
    case LOG_LEVELS.DEBUG:
      console.debug(consoleMessage, metadata);
      break;
    default:
      console.log(consoleMessage, metadata);
  }
}

/**
 * Express middleware for request logging
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Log request
  writeLog(LOG_LEVELS.INFO, `Incoming request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.path} ${res.statusCode} - ${duration} ms`;
    
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip
    };

    if (res.statusCode >= 500) {
      writeLog(LOG_LEVELS.ERROR, message, logData);
    } else if (res.statusCode >= 400) {
      writeLog(LOG_LEVELS.WARN, message, logData);
    } else {
      writeLog(LOG_LEVELS.INFO, message, logData);
    }
  });

  next();
}

/**
 * Logger object with methods for different log levels
 */
const logger = {
  info: (message, metadata) => writeLog(LOG_LEVELS.INFO, message, metadata),
  warn: (message, metadata) => writeLog(LOG_LEVELS.WARN, message, metadata),
  error: (message, metadata) => writeLog(LOG_LEVELS.ERROR, message, metadata),
  debug: (message, metadata) => writeLog(LOG_LEVELS.DEBUG, message, metadata),
  middleware: requestLogger
};

module.exports = logger;
