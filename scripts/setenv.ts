const fs = require('fs');
const envPath = require('path');

const envName = process.argv[2] || '';

const environment = {
  production: process.env.PRODUCTION === 'true',
  enableUBS: process.env.ENABLE_UBS === 'true',
  enableGreenCity: process.env.ENABLE_GREENCITY === 'true',
  apiKeys: process.env.API_KEYS,
  apiMapKey: process.env.API_MAP_KEY,
  backendLink: process.env.BACKEND_LINK,
  backendChatLink: process.env.BACKEND_CHAT_LINK,
  backendUserLink: process.env.BACKEND_USER_LINK,
  backendUbsLink: process.env.BACKEND_UBS_LINK,
  frontendLink: process.env.FRONTEND_LINK,
  socket: process.env.SOCKET,
  userSocket: process.env.USER_SOCKET,
  chatSocket: process.env.CHAT_SOCKET,
  ubsAdmin: {
    backendUbsAdminLink: process.env.BACKEND_UBS_ADMIN_LINK
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  agmCoreModuleApiKey: process.env.AGM_CORE_MODULE_API_KEY
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

console.log(`--- Content of ${envPath.basename(environmentTsPath)} ---`);
console.log(fs.readFileSync(environmentTsPath, 'utf8'));
