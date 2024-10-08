// Script for setting environment.ts with system environment variables
const { writeFile, existsSync, mkdirSync } = require('fs');
const { argv } = require('yargs');
const path = require('path');

const currentEnvironment = argv.environment || argv.env || 'dev';

let envPath: string;
let targetPath: string;

switch (currentEnvironment) {
  case 'prod':
    targetPath = './src/environments/environment.prod.ts';
    envPath = './.env.production';
    break;
  case 'stage':
    targetPath = './src/environments/environment.stage.ts';
    envPath = './.env.staging';
    break;
  default:
    targetPath = './src/environments/environment.ts';
    envPath = './.env';
    break;
}

require('dotenv').config({ path: envPath });

console.debug(`Environment: ${currentEnvironment}`);
console.debug(`Target path: ${targetPath}`);
console.debug(`.env file path: ${envPath}`);

/**
 * Create the environment.ts file if it doesn't exist
 * Used for fileReplacements in angular.json
 * Without this file, the build will fail as the fileReplacements will not work
 */
const defaultEnvFilePath = path.resolve(__dirname, '../src/environments/environment.ts');
if (!existsSync(defaultEnvFilePath)) {
  mkdirSync(path.dirname(defaultEnvFilePath), { recursive: true });
  writeFile(defaultEnvFilePath, '', (err) => {
    if (err) {
      console.error(`Error creating ${defaultEnvFilePath}:`, err);
    }
  });
}

const isProduction = currentEnvironment === 'prod';

const environmentFileContent = `export const environment = {
  production: ${isProduction},
  apiKeys: '${process.env.API_KEYS}',
  apiMapKey: '${process.env.API_MAP_KEY}',
  backendLink: '${process.env.BACKEND_LINK}',
  backendChatLink: '${process.env.BACKEND_CHAT_LINK}',
  backendUserLink: '${process.env.BACKEND_USER_LINK}',
  backendUbsLink: '${process.env.BACKEND_UBS_LINK}',
  frontendLink: '${process.env.FRONTEND_LINK}',
  socket: '${process.env.SOCKET}',
  userSocket: '${process.env.USER_SOCKET}',
  chatSocket: '${process.env.CHAT_SOCKET}',
  ubsAdmin: {
    backendUbsAdminLink: '${process.env.UBS_ADMIN_BACKEND_UBS_ADMIN_LINK}'
  },
  googleClientId: '${process.env.GOOGLE_CLIENT_ID}',
  agmCoreModuleApiKey: '${process.env.AGM_CORE_MODULE_API_KEY}'
};
`;

writeFile(targetPath, environmentFileContent, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
