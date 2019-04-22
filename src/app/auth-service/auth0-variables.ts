interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'Mf5V73R0MsibOggb2306fpDknAcuITs3',
  domain: 'iod.eu.auth0.com',
//  callbackURL: 'https://927ea09df5fe4913be6a026f14625e02.vfs.cloud9.eu-west-1.amazonaws.com/comp1'
  //callbackURL: 'http://46.137.82.116:8080/comp1'
  callbackURL: 'http://aimy.iod4all.com:8080/comp1'
};