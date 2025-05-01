import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export const getRuntimeEnv = () => {
  const envPath = path.resolve(process.cwd(), '.env');

  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    return envConfig;
  } else {
    // for works on pipeline github actions
    fs.writeFileSync(envPath, '');
    return {};
  }
};
