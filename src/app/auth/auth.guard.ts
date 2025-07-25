import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RolesPermissionsService } from 'src/app/services/rolesPermissions/roles-permissions.service';
import { appHeaders } from 'src/config/headers';
import { urls } from 'src/config/urls';

enum CONSTANTS {
  HOME = 'home',
  IS_AUTHENTICATED = 'isAuthenticated'
}
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private cookieService: CookieService, private http: HttpClient,
    private router: Router, private rolesService: RolesPermissionsService) { }
  resVal: Object;
  API = urls.API;
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const httpOptions = {
      headers: appHeaders.getHeaders(),
      withCredentials: true,
      observe: 'response' as 'response'
    };
    return this.http.get(this.API + '/loginCheck', httpOptions).pipe(
      map(res => {
        this.resVal = res.body;
        if (!res.body[CONSTANTS.IS_AUTHENTICATED]) {
          this.cookieService.deleteAll();
          sessionStorage.clear();
          this.router.navigate([CONSTANTS.HOME]);
          return false;
        } else {
          this.rolesService.setRes(this.resVal);
          return true;
        }
      }),
      catchError((err) => {
        this.router.navigate([CONSTANTS.HOME]);
        return of(false);
      })
    );

  }
}



