'use strict';

const databaseConfig = {
    dialect:process.env.DB_DIALECT || 'mysql',// | 'mariadb' | 'postgres' | 'mssql'
    host:process.env.DB_HOST||"localhost",
    username:process.env.DB_USER || "root",
    database:process.env.DB_DATABASE || "sequelize_simple_1",
    password:process.env.DB_PASSWORD || "",
    define:{
        timestamps:true,
        underscored:true,
        underscoredAll:true,
    },
    // Choose one of the logging options
    //logging: console.log,                  // Default, displays the first parameter of the log function call
    logging: (...msg) => (process.env.END_MOD === 'DEV' ? console.log(msg) : ''), // Displays all log function call parameters
    logging: (process.env.END_MOD === 'PROD' ? true : false),                        // Disables logging
    //logging: msg => logger.debug(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
    //logging: logger.debug.bind(logger)     // Alternative way to use custom logger, displays all messages
};

module.exports = databaseConfig;