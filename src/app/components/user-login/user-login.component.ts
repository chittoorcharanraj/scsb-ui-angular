import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

declare var $: any;
@Component({
  standalone: false,
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  constructor(private router: Router, private dashBoardService: DashBoardService, private cookieService: CookieService) { }
  email: string;
  descEmail: string
  url: string;
  ngOnInit(): void {
    this.url = environment.homeUrl + '/logout';
    this.dashBoardService.getEmail().subscribe(
      res => {
        this.email = res['email'];
        this.descEmail = 'mailto:' + this.email;
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
    localStorage.clear();
    this.cookieService.deleteAll()
  }
}
