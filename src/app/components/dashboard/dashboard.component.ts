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
  res: any = {};
  frozenInstitutionMessages: string[];
  isCollapsed: boolean = false;

  constructor(private router: Router, private rolesService: RolesPermissionsService, private dashboardService: DashBoardService) { }

  ngOnInit(): void {
    this.res = this.rolesService.getRes() || {};
    this.dashboardService.getFrozenInstitutionMessages().subscribe(data => {
      this.frozenInstitutionMessages = data;
    });

    // Load persisted navigation states
    this.isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebarCollapsed', String(this.isCollapsed));
  }

  get activeRouteInfo() {
    const url = this.router.url;
    if (url.includes('/search-request')) {
      return { title: 'Search Request', desc: 'Track requests' };
    } else if (url.includes('/search')) {
      return { title: 'Search Items', desc: 'Search across the shared collection catalog.' };
    } else if (url.includes('/collection')) {
      return { title: 'Collection', desc: 'Manage collections' };
    } else if (url.includes('/requestLog')) {
      return { title: 'Gateway Request Log', desc: 'View gateway logs' };
    } else if (url.includes('/request')) {
      return { title: 'Request', desc: 'Create requests' };
    } else if (url.includes('/bulkrequest')) {
      return { title: 'Bulk Request', desc: 'Process bulk requests' };
    } else if (url.includes('/reports')) {
      return { title: 'Reports', desc: 'View analytics' };
    } else if (url.includes('/roles')) {
      return { title: 'Roles', desc: 'Manage roles' };
    } else if (url.includes('/userRoles')) {
      return { title: 'Users', desc: 'Manage users' };
    } else if (url.includes('/jobs')) {
      return { title: 'Jobs', desc: 'Monitor jobs' };
    } else if (url.includes('/dataExport')) {
      return { title: 'Data Export', desc: 'Export data' };
    } else if (url.includes('/monitoring')) {
      return { title: 'Monitoring', desc: 'System monitoring' };
    } else if (url.includes('/logging')) {
      return { title: 'Logging', desc: 'View logs' };
    }
    return { title: '', desc: '' };
  }

  reload() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
