import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TreeNode } from 'primeng/api';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { MonitoringService } from '@service/monitoring/monitoring.service';

@Component({
  standalone: false,
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {
  constructor(private monitoring: MonitoringService, public sanitizer: DomSanitizer, private dashBoardService: DashBoardService) { }
  data: TreeNode;
  scsbURL: string;
  dockerURL: string;
  awsURL: string;
  ngOnInit(): void {
    this.dashBoardService.setApiPath('monitoring');
    this.monitoring.pullData().subscribe(
      (res) => {
        this.data = res;
        this.scsbURL = this.data['scsbURL'];
        this.dockerURL = this.data['dockerURL'];
        this.awsURL = this.data['awsURL'];
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
}
