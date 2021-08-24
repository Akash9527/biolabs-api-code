
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp, service, method }) => {
    return `[${timestamp}] [${label}] [${level}]: [${message}] [${service}] [${method}]`;
});

let logger = createLogger({
    level: '',
    format: combine(
        label({ label: 'Biolabs' }),
        timestamp(),
        logFormat
    ),
    defaultMeta: { },
    transports: [
        new transports.File({ filename: 'logs/biolabs-error.log', level: 'error', handleExceptions: true }),
        new transports.File({ filename: 'logs/biolabs.log' }),
        new transports.Console({})
    ],
    exitOnError: false
});

module.exports = logger;
