import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  /**
   * Description: This method will return the system enviourment by key name.
   * @description This method will return the system enviourment by key name.
   */
  get(key: string): string {
    return this.envConfig[key];
  }

  /**
   * Description: This method will return the system enviourment.
   * @description This method will return the system enviourment.
   */
  isEnv() {
    return process.env.APPSETTING_APP_ENV;
  }
}