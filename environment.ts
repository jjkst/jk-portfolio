export const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:5002/api',
    googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    githubClientId: 'YOUR_GITHUB_CLIENT_ID',
    githubRedirectUri: 'http://localhost:4200/login'
  };

// NOTE: Production environment is at src/environments/environment.prod.ts
// angular.json fileReplacements swaps this file for prod during `ng build --configuration production`