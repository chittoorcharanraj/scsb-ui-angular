import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { DataExportService } from '@service/dataExport/data-export.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TreeNode } from 'primeng/api';
declare var $: any;
@Component({
  standalone: false,
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.css']
})
export class DataExportComponent implements OnInit {
  errorMessage: string = '';
  status = true;
  resVal: TreeNode[];
  resValExport: TreeNode[];
  result = [];
  dataDumpErrorMessageDiv = false;
  dataDumpResultsDiv = false;
  dataDumpDiv = false;
  dataExportDiv = false;
  dataExport_panel = true;
  try_out_toggle = false;
  isChecked = true;
  collectionGroupIds: string = null;
  date: string = null;
  emailToAddress: string = null;
  fetchType: string;
  imsDepositoryCodes: string = null;
  institutionCodes: string;
  outputFormat: string;
  requestingInstitutionCode: string;
  transmissionType: string = null;

  fetchTypeErrorMessageDiv = false;
  institutionCodesErrorMessageDiv = false;
  outputFormatErrorMessageDiv = false;
  requestingInstitutionCodeErrorMessageDiv = false;

  successMessageDiv = false;
  errorMessageDiv = false;
  //Descriptions
  institutionCodesDescription: string;
  resInstDescription: TreeNode[];
  constructor(private router: Router, private dataExportService: DataExportService, private spinner: NgxSpinnerService, private dashBoardService: DashBoardService) { }
  res: any[];
  ngOnInit(): void {
    this.dashBoardService.setApiPath('dataExport');
    this.result = [];
    this.dataExportService.getDescriptions().subscribe(
      (res) => {
        this.resInstDescription = res;
        this.institutionCodesDescription = this.resInstDescription['desc'];
        this.enableDataDumpDetails();
      });
  }
  tryOutToggle() {
    this.try_out_toggle = !this.try_out_toggle;
  }
  enableDataDumpDetails() {
    this.dataExportDiv = false;
    this.dataDumpErrorMessageDiv = false;
    this.dataDumpResultsDiv = false;
    this.dataExportDiv = false;
    this.spinner.show();
    this.dataExportService.getRecentDataExportsInfo().subscribe(
      (res) => {
        this.spinner.hide();
        this.resVal = res;
        if (this.resVal == null) {
          this.errorMessage = 'SCSB Etl Service is Unavailable.';
          this.dataDumpDiv = true;
          this.dataDumpErrorMessageDiv = true;
          this.dataDumpResultsDiv = false;
          this.dataExportDiv = false;
        } else {
          this.mappingRes(this.resVal['recentDataExportInfoList']);
          this.dataExportDiv = false;
          this.dataDumpDiv = true;
          this.dataDumpResultsDiv = true;
          this.dataDumpErrorMessageDiv = false;
        }

      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  enabledDataExport() {
    this.result = [];
    this.dataExportDiv = true;
    this.dataDumpDiv = false;
    this.dataDumpResultsDiv = false;
    this.dataDumpErrorMessageDiv = false;
    this.errorMessageDiv = false;
    this.successMessageDiv = false;
    this.hideErrorDivs();
    this.resetFields();
  }
  mappingRes(data) {
    var groups = new Set(data.map(item => item.institution));
    groups.forEach(g =>
      this.result.push({
        name: g,
        values: data.filter(i => i.institution === g)
      }
      ));
    this.result.forEach((items, i) => {
      items.length = items.values.length;
    });
  }
  startDataDump(collectionGroupIds, date, emailToAddress, fetchType, imsDepositoryCodes, institutionCodes, outputFormat, requestingInstitutionCode, transmissionType) {
    if (this.validateMandatoryInputs(collectionGroupIds, date, emailToAddress, fetchType, imsDepositoryCodes, institutionCodes, outputFormat, requestingInstitutionCode, transmissionType)) {
      this.spinner.show();
      this.dataExportService.startDataDump(collectionGroupIds, date, emailToAddress, fetchType, imsDepositoryCodes, institutionCodes, outputFormat, requestingInstitutionCode, transmissionType, localStorage.getItem("userName")).subscribe(
        (res) => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.resValExport = res;
          if (this.resValExport['message'] != null) {
            this.successMessageDiv = true;
            this.errorMessageDiv = false;
          } else {
            this.successMessageDiv = false;
            this.errorMessageDiv = true;
          }
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
    } else { }
  }
  validateMandatoryInputs(collectionGroupIds, date, emailToAddress, fetchType, imsDepositoryCodes, institutionCodes, outputFormat, requestingInstitutionCode, transmissionType) {
    this.status = true;
    if (fetchType == '' || fetchType == undefined || fetchType == null) {
      this.fetchTypeErrorMessageDiv = true;
      this.status = false;
    } else {
      this.fetchTypeErrorMessageDiv = false;
    }
    if (institutionCodes == '' || institutionCodes == undefined || institutionCodes == null) {
      this.institutionCodesErrorMessageDiv = true;
      this.status = false;
    } else {
      this.institutionCodesErrorMessageDiv = false;
    }
    if (outputFormat == '' || outputFormat == undefined || outputFormat == null) {
      this.outputFormatErrorMessageDiv = true;
      this.status = false;
    } else {
      this.outputFormatErrorMessageDiv = false;
    }
    if (requestingInstitutionCode == '' || requestingInstitutionCode == undefined || requestingInstitutionCode == null) {
      this.requestingInstitutionCodeErrorMessageDiv = true;
      this.status = false;
    } else {
      this.requestingInstitutionCodeErrorMessageDiv = false;
    }
    return this.status;
  }
  resetFields() {
    this.collectionGroupIds = '';
    this.date = '';
    this.emailToAddress = '';
    this.fetchType = '';
    this.imsDepositoryCodes = '';
    this.institutionCodes = '';
    this.outputFormat = '';
    this.requestingInstitutionCode = '';
    this.transmissionType = '';
  }
  hideErrorDivs() {
    this.dataDumpErrorMessageDiv = false;
    this.dataDumpResultsDiv = false;
    this.requestingInstitutionCodeErrorMessageDiv = false;
    this.outputFormatErrorMessageDiv = false;
    this.institutionCodesErrorMessageDiv = false;
    this.fetchTypeErrorMessageDiv = false;
  }
  clearDivs() {
    this.successMessageDiv = false;
    this.errorMessageDiv = false;
  }
  timezone(date) {
    return this.dashBoardService.setTimeZone(date);
  }
}
