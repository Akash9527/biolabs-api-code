/**
 * @author Akhilesh Prajapati
 */
import { NestFactory } from '@nestjs/core';
const logger = require('./loggerConfig');

/**
 * @description :   log error messages
 * @param message : error messages
 * @param service : name of the service from where log generated
 * @param method  : name of the service from where log generated
 */
const error = function (message: String, service: String, method: String) {
    logger.defaultMeta.service = service;
    logger.defaultMeta.method = method;
    logger.log({
        level: 'error',
        message: message
    });

};

/**
 * @description :   log warning messages
 * @param message : warning message
 * @param service : name of the service from where log generated
 * @param method  : name of the method from where log generated
 */
const warn = function (message: String, service: String, method: String) {
    logger.defaultMeta.service = service;
    logger.defaultMeta.method = method;
    logger.log({
        level: 'warn',
        message: message
    });

};

/**
 * @description :   log info messages
 * @param message : info message
 * @param service : name of the service from where log generated
 * @param method  : name of the method from where log generated
 */
const info = function (message: String, service: String, method: String) {
    logger.defaultMeta.service = service;
    logger.defaultMeta.method = method;
    logger.log({
        level: 'info',
        message: message
    });

};

/**
 * @description :   log http messages
 * @param message : http message
 * @param service : name of the service from where log generated
 * @param method  : name of the method from where log generated
 */
const http = function (message: String, service: String, method: String) {
    logger.defaultMeta.service = service;
    logger.defaultMeta.method = method;
    logger.log({
        level: 'http',
        message: message
    });

};

/**
 * @description :   log verbose messages
 * @param message : versbose message
 * @param service : name of the service from where log generated
 * @param method  : name of the method from where log generated
 */
const verbose = function (message: String, service: String, method: String) {
    logger.defaultMeta.service = service;
    logger.defaultMeta.method = method;
    logger.log({
        level: 'verbose',
        message: message
    });

};

/**
 * @description :   log debug messages
 * @param message : debug message
 * @param service : name of the service from where log generated
 * @param method  : name of the method from where log generated
 */
const debug = function (message: String, service: String, method: String) {
    logger.defaultMeta.service = service;
    logger.defaultMeta.method = method;
    logger.log({
        level: 'debug',
        message: message
    });

};

/**
 * @description :   log silly messages
 * @param message : silly message
 * @param service : name of the service from where log generated
 * @param method  : name of the method from where log generated
 */
const silly = function (message: String, service: String, method: String) {
    logger.defaultMeta.service = service;
    logger.defaultMeta.method = method;
    logger.log({
        level: 'silly',
        message: message
    });
}

module.exports = { error, warn, info, http, verbose,debug, silly};