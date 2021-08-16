import { Inject, Injectable } from "@nestjs/common";
import { Pool, QueryResult } from "pg";
const fsp = require('fs').promises;
const { info, debug, error } = require('../../../utils/logger');
import { getManager } from 'typeorm';


@Injectable()
export class DatabaseService {

    /**
     * @description This method for executing the .sql file from SQL folder
     * @param queryText Query statements
     * @param values parameters
     * @returns query result
     */
    public async executeScript() {
        try {
            info(`Script execution started `, __filename, 'executeQuery()');
            const appRoot = require('app-root-path');
            let basePath = appRoot.path.split('src');
            basePath = basePath[0] + '/SQL';
            const folders = await fsp.readdir(basePath);
            for (let folder of folders) {
                debug("Reading folder  :", folder, __filename, 'executeScript()');
                const files = await fsp.readdir(basePath + '/' + folder);
                for (let f of files) {
                    debug("executing script from file :", f, __filename, 'executeScript()');
                    const fileData = await fsp.readFile(basePath + '/' + folder + '/' + f, 'utf-8');
                    const entityManager = getManager();
                    entityManager.query(fileData).then((result: QueryResult) => {
                        debug(`Executed query ${result}`, __filename, 'executeQuery()');
                        return result.rows;
                    });
                }
            }
            debug('Database updated', __filename, 'executeScript()');
        } catch (e) {
            error('Error in executing script to update the databse', e, __filename, 'executeScript()');

        }
    }
}