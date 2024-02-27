import {DotenvParseOutput, config} from 'dotenv';

export class ConfigService {
   private readonly envConfig: DotenvParseOutput;

   constructor() {
      const {error, parsed} = config();
      if (error) throw new Error(`ConfigService not found`);
      if (!parsed) throw new Error(`ConfigService are empty`);
      this.envConfig = parsed;
   }

   get(key: string): string {
      const res: string = this.envConfig[key];
      if (!res) throw new Error(`Not found value for key ${key} in ConfigService`);
      return res;
   }
}
