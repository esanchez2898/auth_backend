const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Function to log events to a log file
const logEvents = async (message, logName) => {    
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`; // Formats the current date and time and generates a unique ID for the event
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    try {        
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {   // Creates the 'logs' directory if it doesn't exist
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);  // Appends the logItem to the specified log file (logName)
    } catch (err) {
        console.log(err);
    }
}

// Middleware to log HTTP requests
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');    // Calls logEvents to log the HTTP method, origin, and request URL to 'reqLog.txt'
    console.log(`${req.method} ${req.path}`);   // Logs the request method and path to the console
    next(); // Proceeds to the next middleware
}

module.exports = { logger, logEvents };
