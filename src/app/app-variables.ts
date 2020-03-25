interface AppConfig {
  clientID: string;
  storageURL: string;
  apiVersion: string;
  version: string;
  togPlaylist: boolean;
  togSkillCat: boolean;
}

export const APP_CONFIG: AppConfig = {
  clientID: 'gb2306fpDknAcuITs3Mf5V73R0MsibOg',
  // Development API Gateway
//  storageURL: 'http://storage.aimyonline.com:8080',
  // Showcase  API Gateway
  storageURL: 'http://3.121.45.234:3000',
  // Production  API Gateway
  
  apiVersion: '0.0.1',
  version: '0.0.17',
  // Feature toggler activate or deactivate a specific functionality
  togPlaylist: true,
  togSkillCat: true
};

interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'Mf5V73R0MsibOggb2306fpDknAcuITs3',
  domain: 'iod.eu.auth0.com',
  
//  callbackURL: 'http://www.aimyonline.com/#comp2'
//  callbackURL: 'http://aimyp.s3-website.eu-central-1.amazonaws.com/#comp2'

  
  callbackURL: 'http://showcase.aimyonline.com:8080/comp2'
  
//  callbackURL: 'http://aimyc.s3-website.eu-central-1.amazonaws.com/#comp2'

};