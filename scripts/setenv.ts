const fs = require('fs');
const envPath = require('path');
const envName = process.argv[2] || '';
const envFile = envName ? `.env.${envName}` : '.env';

require('dotenv').config({ path: envPath.resolve(process.cwd(), envFile) });

const environmentFileContent = `export const environment = {
  production: ${process.env.PRODUCTION},
  enableUBS: ${process.env.ENABLE_UBS},
  enableGreenCity: ${process.env.ENABLE_GREENCITY},
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
    backendUbsAdminLink: '${process.env.BACKEND_UBS_ADMIN_LINK}'
  },
  googleClientId: '${process.env.GOOGLE_SCLIENT_ID}',
  agmCoreModuleApiKey: '${process.env.AGM_CORE_MODULE_API_KEY}'
};
`;

const environmentsDir = envPath.resolve(process.cwd(), './src/environments');
const environmentPath = envPath.resolve(environmentsDir, `environment${envName ? `.${envName}` : ''}.ts`);

if (!fs.existsSync(environmentsDir)) {
  fs.mkdirSync(environmentsDir, { recursive: true });
}

fs.writeFile(environmentPath, environmentFileContent, (err) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log(`Successfully generated ${envPath.basename(environmentPath)}`);
});
