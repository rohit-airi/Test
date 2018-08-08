import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TokenService } from 'angular2-auth';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CookieService } from 'ngx-cookie-service';
import { Configuration } from '../../app.configuration';
@Injectable()
export class AuthService {
  constructor(private _configuration:Configuration,private _coockieService:CookieService,
    private _http: Http, private _tokenService: TokenService) {}
  login(body:any):Observable<Response> {
  return this._http.post(this._configuration.Server +'token', body);
  }
  deleteCoockies() {
    this._coockieService.deleteAll();
  }
  logout() {
    this._tokenService.removeToken();
    return true;
  }
  loggedIn() {
    const token = this._tokenService.getToken();
    if(token && token.token) {
      const loginDetails=JSON.parse(token.token);
      if(loginDetails.access_token) {
       return true;
      } else {
        return false;
      }
    }
    return false;
  }
  refreshToken(userName:string,refreshToken:string) {
    const modal = {'Email':userName,'RefreshToken':refreshToken};
    return this._http.post(this._configuration.Server+this._configuration.ApiUrl+'/Authenticate/refresh', modal)
        .map(this.extractData)
        .catch(this.handleError);
}
private extractData(res: Response) {
  const user = res.json();
  const data = user;// JSON.parse(user);
  const status = data.access_token;
  // login successful if there's a jwt token in the response
  if (status !== null && status.length>0) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', data);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refreshtoken','');
      return 'success';
  } else {
      return 'error';
  }
}
private handleError(error: Response | any) {
  return Observable.throw(error.message || error);
}
}
