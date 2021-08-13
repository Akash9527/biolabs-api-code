import { Inject, Injectable } from "@nestjs/common";
import { Pool, QueryResult } from "pg";
const fsp = require('fs').promises;
const { info, debug, error } = require('../../utils/logger');


@Injectable()
export class DatabaseService {

    constructor(@Inject('DATABASE_POOL') private pool: Pool) {
        info('Database pool initialized', __filename, 'DatabaseService.constructor()');
    }

    /**
     * @description This method for executing the .sql file from SQL folder
     * @param queryText Query statements
     * @param values parameters
     * @returns query result
     */
    executeQuery(queryText: string): Promise<any[]> {
        debug(`Executing query`, __filename, 'executeQuery()');
        return this.pool.query(queryText).then((result: QueryResult) => {
            debug(`Executed query, result size ${result.rows.length}`,__filename,'executeQuery()');
            return result.rows;
        });
    }

    /**
     * @description This method for executing the .sql file from SQL folder
     */
    public async executeScript() {
        try {
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
                    this.executeQuery(fileData);
                }
            }
            debug('Database updated', __filename, 'executeScript()');
        } catch (e) {
            error('Error in executing script to update the databse',e,__filename, 'executeScript()');

        }
    }
}