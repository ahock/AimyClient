interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'Mf5V73R0MsibOggb2306fpDknAcuITs3',
  domain: 'iod.eu.auth0.com',
  callbackURL: 'http://aimy.iod4all.com:8080/comp1'
//  callbackURL: 'http://aimyc.s3-website.eu-central-1.amazonaws.com'
};