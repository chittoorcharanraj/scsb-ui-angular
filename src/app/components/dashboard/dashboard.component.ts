import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { RolesPermissionsService } from '@service/rolesPermissions/roles-permissions.service';
@Component({
  standalone: false,
  selector: 'app-maindashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  res: Object;
  frozenInstitutionMessages: string[];
  constructor(private router: Router, private rolesService: RolesPermissionsService, private dashboardService: DashBoardService) { }

  ngOnInit(): void {
    this.res = this.rolesService.getRes();
    this.dashboardService.getFrozenInstitutionMessages().subscribe(data => {
      this.frozenInstitutionMessages = data;
    });
  }
  reload() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}

