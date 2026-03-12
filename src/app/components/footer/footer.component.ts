import { Component, OnInit } from '@angular/core';
import { DashBoardService } from '@service/dashBoard/dash-board.service';

@Component({
  standalone: false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private dashBoardService: DashBoardService) { }
  versionNumber: string;
  footerYear:string;
  ngOnInit(): void {
    this.dashBoardService.getVersionNumber().subscribe(
      res => {
        this.versionNumber = res['versionNumber'];
        this.footerYear = res['footerYear'];
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
}
