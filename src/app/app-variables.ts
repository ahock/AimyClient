interface AppConfig {
  clientID: string;
  storageURL: string;
  apiVersion: string;
}

export const APP_CONFIG: AppConfig = {
  clientID: 'gb2306fpDknAcuITs3Mf5V73R0MsibOg',
//  storageURL: 'http://storage.iod4all.com:8080',
  storageURL: 'http://3.121.45.234:3000',
  apiVersion: '0.0.1'
};

interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'Mf5V73R0MsibOggb2306fpDknAcuITs3',
  domain: 'iod.eu.auth0.com',
//  callbackURL: 'http://aimy.iod4all.com:8080/comp2'
  callbackURL: 'http://aimyc.s3-website.eu-central-1.amazonaws.com/#comp2'
};