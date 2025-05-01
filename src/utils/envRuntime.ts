import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export const getRuntimeEnv = () => {
  const envPath = path.resolve(process.cwd(), '.env.runtime');

  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    return envConfig;
  }

  throw new Error('.env.runtime file not found');
};
