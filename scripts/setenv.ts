const fs = require('fs');
const envPath = require('path');
const dotenv = require('dotenv');

const envName = process.argv[2] || '';
const envFilePath = envName ? `.env.${envName}` : '.env';

const envConfig = dotenv.config({ path: envPath.resolve(process.cwd(), envFilePath) }).parsed;

if (!envConfig) {
  console.error(`Error: .env file not found at ${envFilePath}`);
  process.exit(-1);
}

const environment = {
  production: envConfig.PRODUCTION === 'true',
  enableUBS: envConfig.ENABLE_UBS === 'true',
  enableGreenCity: envConfig.ENABLE_GREENCITY === 'true',
  apiKeys: envConfig.API_KEYS,
  apiMapKey: envConfig.API_MAP_KEY,
  backendLink: envConfig.BACKEND_LINK,
  backendChatLink: envConfig.BACKEND_CHAT_LINK,
  backendUserLink: envConfig.BACKEND_USER_LINK,
  backendUbsLink: envConfig.BACKEND_UBS_LINK,
  frontendLink: envConfig.FRONTEND_LINK,
  socket: envConfig.SOCKET,
  userSocket: envConfig.USER_SOCKET,
  chatSocket: envConfig.CHAT_SOCKET,
  ubsAdmin: {
    backendUbsAdminLink: envConfig.BACKEND_UBS_ADMIN_LINK
  },
  googleClientId: envConfig.GOOGLE_CLIENT_ID,
  agmCoreModuleApiKey: envConfig.AGM_CORE_MODULE_API_KEY
};

const environmentFileContent = `export const environment = ${JSON.stringify(environment, null, 2)};`;

const environmentsDir = envPath.resolve(process.cwd(), './src/environments');
const environmentTsPath = envPath.resolve(environmentsDir, `environment.ts`);
const environmentStageTsPath = envPath.resolve(environmentsDir, `environment.${envName}.ts`);

if (!fs.existsSync(environmentsDir)) {
  fs.mkdirSync(environmentsDir, { recursive: true });
}

fs.writeFileSync(environmentTsPath, environmentFileContent);
console.log(`Successfully generated ${envPath.basename(environmentTsPath)}`);

fs.writeFileSync(environmentStageTsPath, environmentFileContent);
console.log(`Successfully generated ${envPath.basename(environmentStageTsPath)}`);
