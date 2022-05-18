import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { urls } from '@config/urls';
import { environment } from 'src/environments/environment';
import { RolesPermissionsService } from '@service/rolesPermissions/roles-permissions.service';
enum CONSTANTS {
  USER_DESC = 'userDesc',
  CSRF_TOKEN = 'CSRF-TOKEN',
  USER_NAME = 'userName'
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  LOGOUT = urls.LOGOUT;
  userName: string;
  userDesc: string;
  tempUserName: string;
  url: string = '';
  rolesRes: Object;
  constructor(private cookieService: CookieService,private rolesService: RolesPermissionsService) { }
  ngOnInit(): void {
    this.url = environment.homeUrl + this.LOGOUT + this.cookieService.get(CONSTANTS.CSRF_TOKEN);
    this.rolesRes = this.rolesService.getRes();
    if (this.rolesRes[CONSTANTS.USER_DESC]) {
      localStorage.setItem(CONSTANTS.USER_DESC, this.rolesRes[CONSTANTS.USER_DESC]);
      localStorage.setItem(CONSTANTS.USER_NAME, this.rolesRes[CONSTANTS.USER_NAME]);
      this.userDesc = localStorage.getItem(CONSTANTS.USER_DESC);
    }
  }
}
