import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { TreeNode } from 'primeng/api';
import { OpenMarcService } from '@service/openMarc/open-marc.service';
import { DashBoardService } from '@service/dashBoard/dash-board.service';

@Component({
  standalone: false,
  selector: 'app-open-marc',
  templateUrl: './open-marc.component.html',
  styleUrls: ['./open-marc.component.css']
})
export class OpenMarcComponent implements OnInit {
  constructor(private openMarcService: OpenMarcService, private spinner: NgxSpinnerService,
    private routeParams: ActivatedRoute, private titleService: Title, private dashBoardService: DashBoardService) { }
  bibliographicMarcForm: TreeNode[];
  errorMessageDiv = false;
  successMessageDiv = false;
  public id;
  ngOnInit(): void {
    this.spinner.show();
    this.titleService.setTitle('Marc Record');
    this.routeParams.queryParams.subscribe(params => {
      this.id = parseInt(params['bibId']);
    });
    this.openMarcService.openMarc(this.id).subscribe(
      (res) => {
        this.bibliographicMarcForm = res;
        if (this.bibliographicMarcForm['errorMessage'] != null) {
          this.errorMessageDiv = true;
          this.successMessageDiv = false;
        } else {
          this.errorMessageDiv = false;
          this.successMessageDiv = true;
        }
        this.spinner.hide();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
}
