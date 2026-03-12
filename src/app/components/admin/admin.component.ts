import { Component, OnInit } from '@angular/core';
import { AdminService } from '@service/admin/admin.service';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { TreeNode } from 'primeng/api';
@Component({
  standalone: false,
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(private adminService: AdminService, private dashBoardService: DashBoardService) { }
  AdminPanelDiv = true;
  IMSLocationDiv = true;
  enableOnBoardDiv: boolean = false;
  enableIMSLocationDiv: boolean = false;
  uploadRes: TreeNode[];
  resIMS: TreeNode[];
  errorMessageDiv = false;
  choosenFile: string = '';
  onBoardFile: boolean;
  successMessageDiv = false;
  onBoardStatusDiv = false;
  onBoardIMSStatusDiv = false;
  fileToUpload: File = null;
  ngOnInit(): void { }
  handleFileInput(files: FileList) {
    this.fileToUpload = null;
    this.choosenFile = '';
    this.fileToUpload = files.item(0);
    this.choosenFile = this.fileToUpload.name;
    this.validateUploadFile();
  }
  uploadFileToActivity() {
    if ((this.choosenFile == undefined || this.choosenFile == '')) {
      this.onBoardFile = true;
    } else {
      this.onBoardFile = false;
      this.adminService.upload(this.fileToUpload).subscribe(
        res => {
          this.uploadRes = res;
          this.onBoardStatusDiv = true;
          this.choosenFile = '';
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
    }
  }
  uploadIMSFIle() {
    if ((this.choosenFile == undefined || this.choosenFile == '')) {
      this.onBoardFile = true;
    } else {
      this.onBoardFile = false;
      this.adminService.uploadIMSLocations(this.fileToUpload).subscribe(
        res => {
          this.resIMS = res;
          this.onBoardIMSStatusDiv = true;
          this.choosenFile = '';
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
    }
  }
  validateUploadFile() {
    if ((this.choosenFile == undefined || this.choosenFile == '')) {
      this.onBoardFile = true;
    } else {
      this.onBoardFile = false;
    }
  }
  enableOnBoardDivs() {
    this.onBoardStatusDiv = false;
  }
  enableOnBoardIMSDivs() {
    this.onBoardIMSStatusDiv = false;
  }
}
