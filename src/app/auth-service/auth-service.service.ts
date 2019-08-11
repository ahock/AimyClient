import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from '../app-variables';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { StatusService } from '../status/status.service';
//import { UserService } from '../user/user.service';

@Injectable()
export class AuthServiceService {

  private loginCallback: Function;
  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;
  private _userToken: string;
  
  public auth_detail = {
    email:"",
    name:"",
    nickname:"",
    gender:"",
    given_name:"",
    family_name:"",
    locale: ""
  };

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.callbackURL
  });

  constructor(public router: Router, public status: StatusService) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
    this._userToken = '';
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public setLoginCallback(callback: Function): void {
    console.log("localLogin", callback);
    this.loginCallback = callback;
//    this.loginCallback().call();
  }
  
  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(callback: Function): void {
    console.log("Auth-Service: handleAuthentication");
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult, () => {
          console.log("Auth-Service: handleAuthentication - callback", this._userToken, localStorage.getItem('user_token'));
          callback(this._userToken);
//          this.loginCallback(this._userToken);
        });
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  private localLogin(authResult, callback): void {
    console.log("Auth-Service: localLogin");

    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + Date.now();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
    this._userToken = authResult.idTokenPayload.sub;
    
//    console.log("AuthService: localLogin", authResult.idTokenPayload);

    console.log("localLogin:Token:", this._userToken);
    localStorage.setItem('user_token', this._userToken);
    
//    console.log("Expires: ", new Date(this._expiresAt));
//    console.log("Now:     ", new Date());

    this.auth_detail.email = authResult.idTokenPayload['email'];
    this.auth_detail.name = authResult.idTokenPayload['name'];
    this.auth_detail.nickname = authResult.idTokenPayload['nickname'];
    this.auth_detail.gender = authResult.idTokenPayload['gender'];
    this.auth_detail.given_name = authResult.idTokenPayload['given_name'];
    this.auth_detail.family_name = authResult.idTokenPayload['family_name'];
    this.auth_detail.locale = authResult.idTokenPayload['locale'];
    
    console.log("Details: ", this.auth_detail, authResult.idTokenPayload.sub);
    
//    localStorage.setItem('user_token', authResult.idTokenPayload.sub);
    localStorage.setItem('expires_at', String(expiresAt));
    localStorage.setItem('access_token', authResult.accessToken);
    
    this.status.setStatusText(authResult.idTokenPayload.sub);
    
//    this.loginCallback(authResult.idTokenPayload.sub);
    callback.call(this._userToken);
  }

  public renewTokens(): void {
    /*
    this.auth0.checkSession({}, (err, authResult) => {
        console.log("renewTokens", authResult);
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.localLogin(authResult, ()=>{});
       } else if (err) {
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
         this.logout();
       }
    });
    */
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;

    localStorage.removeItem('user_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('access_token');
    
    this.auth0.logout({
      returnTo: window.location.origin
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    
//    console.log("Result", this._accessToken && Date.now() < this._expiresAt);
    
    this._expiresAt = Number(localStorage.getItem('expires_at'));
    this._accessToken = localStorage.getItem('access_token');
    
    return this._accessToken && Date.now() < this._expiresAt;
  }

  public getToken(): string {
        return this._userToken;
//    return localStorage.getItem('user_token');
  }
  public setToken( token: string ): void {
        this._userToken = token;
  }

  
  public getExpiration(): string {
    return localStorage.getItem('expires_at');
  }
}