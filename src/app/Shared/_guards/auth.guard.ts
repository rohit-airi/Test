import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from '../../../app/Shared/_services/auth.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private authenticationService: AuthService
    ) { }
    canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
        // Check to see if a user has a valid JWT
        // if (tokenNotExpired('token')) {
          if(localStorage.getItem('auth_token')) {
            // If they do, return true and allow the user to load the home component
            const userInfoModel = JSON.parse(localStorage.getItem('auth_token'));
            if(userInfoModel.Role === 'User' || userInfoModel.AuthTokenId!==''
            || ((userInfoModel.Role==='Admin' || userInfoModel.Role==='SuperAdmin')
            && userInfoModel.MerchantId !=='')) {
                return true;
            } else {
                this.router.navigate(['/app/amazonsetup']);
            }
            return true;
        } else {
            const flag = this.refreshToken();
            if (typeof flag === 'boolean') {
              if (!flag) {
                localStorage.clear();
                this.router.navigate(['/account/login']);
              }

              return flag;
            } else {
                flag.subscribe((refreshed) => {
                    if (!refreshed) {
                        localStorage.clear();
                        this.router.navigate(['/account/login']);
                        return false;
                    }
                });
            }
            return flag;
        }
    }
    public refreshToken(): Observable<any> | boolean {
        const userName = JSON.parse(localStorage.getItem('currentUser'));
        if(userName!==null) {
        const data = JSON.parse(userName);
        const refreshToken = localStorage.getItem('refreshtoken');
        return this.authenticationService.refreshToken(data.Data.user.UserName, refreshToken).map(result => {
            if (result === 'success') {
                return true;
            } else {
                return false;
            }
        });
      } else {
        return false;
      }
    }
}
