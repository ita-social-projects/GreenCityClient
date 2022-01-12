// Script for setting environment.ts with systeme environment variables
const { writeFile } = require('fs');
const { argv } = require('yargs');
require('dotenv').config();
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction ? `./src/environments/environment.prod.ts` : `./src/environments/environment.ts`;
const environmentFileContent = `export const environment = {
    production: ${isProduction},
    apiKeys: '${process.env.apiKeys}',
    backendLink: '${process.env.backendLink}',
    frontendLink: '${isProduction ? process.env.frontendLink : process.env.localFrontendLink}',
    firebaseConfig: {
        apiKey: '${process.env.apiKey}',
        authDomain: '${process.env.authDomain}',
        databaseURL: '${process.env.databaseURL}',
        projectId: '${process.env.projectId}',
        storageBucket: '${process.env.storageBucket}',
        messagingSenderId: '${process.env.messagingSenderId}',
        appId: '${process.env.appId}',
        measurementId: '${process.env.measurementId}'
    }
};
`;
writeFile(targetPath, environmentFileContent, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
