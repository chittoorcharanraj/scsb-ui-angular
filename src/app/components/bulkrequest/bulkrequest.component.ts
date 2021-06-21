import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { TreeNode } from 'primeng/api';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BulkRequestService } from '@service/bulkRequest/bulk-request.service';
import { DashBoardService } from '@service/dashBoard/dash-board.service';

declare var $: any;

@Component({
  selector: 'app-bulkrequest',
  templateUrl: './bulkrequest.component.html',
  styleUrls: ['./bulkrequest.component.css']
})
export class BulkrequestComponent implements OnInit {
  statusRes: string;
  statusInputs: boolean;
  institutions: any = [];
  uploadFile: File = null;
  data: any;
  uploadedFile: any;
  BulkRequestForm: FormGroup;
  bulkrequestVal: TreeNode[];
  deliveryLocVal: any = [];
  createReqsection = true;
  searchReqsection = false;
  BulkRequestName: string;
  BulkRequestNameErrorMessage = false;
  BulkRequestNameLengthError = false;
  requestingInstitutionId: string;
  requestingInstitutionErrorMessage = false;
  choosenFile: string;
  formData = new FormData();
  invalidBulkRequestFile = false;
  bulkRequestFileRequired = false;
  deliveryLocation: string;
  deliveryLocationErrorMessage = false;
  patronBarcodeId: string;
  patronBarcodeErrorMessage = false;
  patronEmailId: string;
  patronEmailIdErrorMessage = false;
  EmailMandatoryErrorMessage = false;
  requestNotesId: string;
  notesLengthErrMsg = false;

  createResponse: TreeNode[];
  createRequestError: boolean;
  errorMessage: string;
  createsubmit = false;

  bulkRequestIdSearchError = false;
  bulkRequestNameSearchError = false;
  bulkPatronBarcodeSearchError = false;
  bulkRequestIdSearch: number;
  bulkRequestNameSearch: string;
  bulkPatronBarcodeSearch: string;
  institutionList: string;
  searchRequestVal: TreeNode[];
  bulkrequestNotesData: string;
  requestId: string;
  nextvalue = 0;
  previousValue = 0;
  lastValue = 0;
  showentries = 10;
  firstbutton = true;
  previousbutton = true;
  nextbutton = false;
  lastbutton = false;
  results_container = false;
  errorResponse = false;
  results_container_table = false;
  download_response: TreeNode[];
  fileName: string;
  dataDecode: string;
  file: File = null;
  storageLocation: string;
  interval: any;
  constructor(private bulkrequestService: BulkRequestService, private spinner: NgxSpinnerService, private dashBoardService: DashBoardService) { }

  ngOnInit(): void {
    this.dashBoardService.setApiPath('bulkRequest');
    this.initialload();
  }

  postData = {
    "requestId": null,
    "patronBarcode": null,
    "itemBarcode": null,
    "status": null,
    "deliveryLocation": null,
    "deliveryLocationInRequest": null,
    "itemTitle": null,
    "itemOwningInstitution": null,
    "storageLocation": null,
    "patronEmailAddress": null,
    "requestingInstitution": null,
    "requestType": null,
    "requestNotes": null,
    "message": null,
    "errorMessage": null,
    "totalRecordsCount": "0",
    "pageNumber": 0,
    "pageSize": 0,
    "totalPageCount": 0,
    "submitted": false,
    "showResults": false,
    "requestingInstitutions": [],
    "requestTypes": [],
    "deliveryLocations": [],
    "bulkSearchResultRows": [],
    "requestStatuses": [],
    "institutionList": [],
    "disableRequestingInstitution": false,
    "onChange": null,
    "showRequestErrorMsg": false,
    "requestingInstituionHidden": null,
    "disableSearchInstitution": false,
    "searchInstitutionHdn": null,
    "file": null,
    "requestIdSearch": null,
    "requestNameSearch": null,
    "patronBarcodeSearch": null,
    "institution": null,
    "bulkRequestName": null,
    "patronBarcodeInRequest": null,
    "fileName": null
  }

  initialload() {
    this.institutions = [];
    this.bulkrequestService.loadCreateRequest().subscribe(
      (res) => {
        this.bulkrequestVal = res;
        for (var i = 0; i < this.bulkrequestVal['requestingInstitutions'].length; i++) {
          this.institutions.push(this.bulkrequestVal['requestingInstitutions'][i]);
        }
        this.searchReqsection = false;
        this.BulkRequestName = '';
        this.requestingInstitutionId = '';
        this.choosenFile = '';
        this.deliveryLocation = '';
        this.patronBarcodeId = '';
        this.patronEmailId = '';
        this.requestNotesId = '';
      }),
      catchError(error => of(error.toString()));
  }

  initialloadnew() {
    this.bulkrequestService.loadCreateRequest().subscribe(
      (res) => {
        this.bulkrequestVal = res;
        this.BulkRequestName = '';
        this.requestingInstitutionId = '';
        this.choosenFile = '';
        this.deliveryLocation = '';
        this.patronEmailId = '';
        this.requestNotesId = '';
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  loadSearchRequest() {
    this.createReqsection = false;
    this.searchReqsection = true;
    this.storageLocation = '';
  }
  loadCreateRequest() {
    this.institutions = [];
    this.results_container = false;
    this.createReqsection = true;
    this.searchReqsection = false;
    this.deliveryLocVal = [];
    this.initialload();
    this.createsubmit = false;
    this.results_container_table = false;
    this.results_container = false;
    this.bulkRequestIdSearch = null;
    this.bulkRequestNameSearch = '';
    this.bulkPatronBarcodeSearch = '';
    this.institutionList = '';
    this.errorResponse = false;
    this.createRequestError = false;
  }

  loadCreateRequestForSamePatron() {
    this.createReqsection = true;
    this.searchReqsection = false;
    this.deliveryLocVal = [];
    this.initialloadnew();
    this.createsubmit = false;
  }

  NotesLengthValidation(val) {
    var requestNotesId = $('#requestNotesId').val();
    var NoteLength = requestNotesId.length;
    var len = val.length;
    if (len > 2000) {
      val = val.substring(0, 2000);
    } else {
      $('#remainingCharacters').text(1000 - len);
    }

  }

  validateEmailAddress(val) {
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i

    if (!pattern.test(val)) {
      if (!(val == '')) {
        this.patronEmailIdErrorMessage = true;
      } else {
        this.patronEmailIdErrorMessage = false;
      }
    } else {
      this.patronEmailIdErrorMessage = false;
    }
  }

  onChange(files: FileList) {
    this.uploadFile = files.item(0);
    this.choosenFile = this.uploadFile.name;
  }
  populateDeliveryLocations(institution) {
    this.postData = {
      "requestId": null,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": null,
      "patronEmailAddress": null,
      "requestingInstitution": institution,
      "requestType": null,
      "requestNotes": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": "0",
      "pageNumber": 0,
      "pageSize": 10,
      "totalPageCount": 0,
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [],
      "requestTypes": [],
      "deliveryLocations": [],
      "bulkSearchResultRows": [],
      "requestStatuses": [],
      "institutionList": [],
      "disableRequestingInstitution": false,
      "onChange": null,
      "showRequestErrorMsg": false,
      "requestingInstituionHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null,
      "file": null,
      "requestIdSearch": null,
      "requestNameSearch": null,
      "patronBarcodeSearch": null,
      "institution": null,
      "bulkRequestName": null,
      "patronBarcodeInRequest": null,
      "fileName": null
    }

    this.bulkrequestService.populateDeliveryLocations(this.postData).subscribe(
      (res) => {
        var del = res['deliveryLocations'];
        this.deliveryLocVal = Object.keys(del).map(function (data) {
          return [data, del[data]];
        });

      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  createBulkRequest() {
    if (this.validateInputs()) {
      this.BulkRequestNameErrorMessage = false;
      this.requestingInstitutionErrorMessage = false;
      this.bulkRequestFileRequired = false;
      this.deliveryLocationErrorMessage = false;
      this.patronBarcodeErrorMessage = false;
      this.EmailMandatoryErrorMessage = false;
      this.spinner.show();
      this.bulkrequestService.createBulkRequest(this.deliveryLocation, this.requestingInstitutionId, this.patronBarcodeId, this.BulkRequestName, this.choosenFile, this.patronEmailId, this.uploadFile, this.requestNotesId).subscribe(
        (res) => {
          this.spinner.hide();
          this.createResponse = res;
          this.statusRes = this.createResponse['status'];
          if (this.statusRes != "CREATED") {
            this.errorMessage = this.statusRes;
            this.createRequestError = true;
          } else {
            this.createsubmit = true;
            this.createRequestError = false;
          }
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
    }
  }
  goToSearchRequest() {
    this.loadSearchRequest();
    this.createReqsection = false;
    this.searchReqsection = true;
    this.bulkPatronBarcodeSearch = this.patronBarcodeId;
    this.searchRequests()
  }
  validateInputs() {
    this.statusInputs = true;
    if ((this.BulkRequestName == undefined || this.BulkRequestName == '')) {
      this.BulkRequestNameErrorMessage = true;
      this.statusInputs = false;
    } else {
      this.BulkRequestNameErrorMessage = false;
    }
    if (this.BulkRequestName == undefined || this.BulkRequestName == '') {
      this.BulkRequestNameErrorMessage = true;
      this.statusInputs = false;
    } else { this.BulkRequestNameErrorMessage = false; }
    if (this.requestingInstitutionId == undefined || this.requestingInstitutionId == '') {
      this.requestingInstitutionErrorMessage = true;
      this.statusInputs = false;
    } else { this.requestingInstitutionErrorMessage = false; }
    if (this.choosenFile == undefined || this.choosenFile == '') {
      this.bulkRequestFileRequired = true;
      this.statusInputs = false;
    } else { this.bulkRequestFileRequired = false; }
    if (this.patronEmailIdErrorMessage == true) {
      this.statusInputs = false;
    }
    if (this.deliveryLocation == undefined || this.deliveryLocation == '') {
      this.deliveryLocationErrorMessage = true;
      this.statusInputs = false;
    } else { this.deliveryLocationErrorMessage = false; }
    if (this.patronBarcodeId == undefined || this.patronBarcodeId == '') {
      this.patronBarcodeErrorMessage = true;
      this.statusInputs = false;
    } else { this.patronBarcodeErrorMessage = false; }
    return this.statusInputs;
  }

  resetDefaults() {
    this.deliveryLocVal = [];
    this.initialload();
    this.createsubmit = false;
    this.BulkRequestNameErrorMessage = false;
    this.requestingInstitutionErrorMessage = false;
    this.bulkRequestFileRequired = false;
    this.deliveryLocationErrorMessage = false;
    this.patronBarcodeErrorMessage = false;
    this.EmailMandatoryErrorMessage = false;
  }
  refreshRequestStatus(): boolean {
    let refreshStatus = false;
    let statusJson = {
      "status": []
    };
    if (this.searchRequestVal != null && this.searchRequestVal != undefined) {
      let searchResults = this.searchRequestVal['bulkSearchResultRows'];
      searchResults.forEach((item, index) => {
        if (item.status == 'IN_PROCESS') {
          statusJson.status.push(item.requestId + '-' + index);
        }
      });

      if (statusJson.status.length > 0) {
        refreshStatus = true;
        this.searchRequests();
      }
    }
    return refreshStatus;
  }
  searchRequests() {
    this.postData = {
      "requestId": null,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocation,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": "0",
      "pageNumber": 0,
      "pageSize": this.showentries,
      "totalPageCount": 0,
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [],
      "requestTypes": [],
      "deliveryLocations": [],
      "bulkSearchResultRows": [],
      "requestStatuses": [],
      "institutionList": [],
      "disableRequestingInstitution": false,
      "onChange": null,
      "showRequestErrorMsg": false,
      "requestingInstituionHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null,
      "file": null,
      "requestIdSearch": this.bulkRequestIdSearch,
      "requestNameSearch": this.bulkRequestNameSearch,
      "patronBarcodeSearch": this.bulkPatronBarcodeSearch,
      "institution": this.institutionList,
      "bulkRequestName": null,
      "patronBarcodeInRequest": null,
      "fileName": null
    }
    this.bulkrequestService.searchRequest(this.postData).subscribe(
      (res) => {
        this.searchRequestVal = res;
        if (this.searchRequestVal['message'] != null || this.searchRequestVal['totalRecordsCount'] == 0) {
          this.errorResponse = true;
          this.results_container = false;
          this.results_container_table = false;
        } else {
          this.results_container = true;
          this.results_container_table = true;
          this.errorResponse = false;
          this.pagination();
          var refreshStatus = this.refreshRequestStatus();
          if (refreshStatus) {
            this.interval = setInterval(this.refreshRequestStatus.bind(this), 50000);
          }
        }
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  reqNotemodal(notes) {
    this.bulkrequestNotesData = notes;
    $('#requestNotesModal').modal({ show: true });
  }

  firstCall() {
    this.postData = {
      "requestId": null,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocation,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": "0",
      "pageNumber": 0,
      "pageSize": this.searchRequestVal['pageSize'],
      "totalPageCount": this.searchRequestVal['totalPageCount'],
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [],
      "requestTypes": [],
      "deliveryLocations": [],
      "bulkSearchResultRows": [],
      "requestStatuses": [],
      "institutionList": [],
      "disableRequestingInstitution": false,
      "onChange": null,
      "showRequestErrorMsg": false,
      "requestingInstituionHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null,
      "file": null,
      "requestIdSearch": this.bulkRequestIdSearch,
      "requestNameSearch": this.bulkRequestNameSearch,
      "patronBarcodeSearch": this.bulkPatronBarcodeSearch,
      "institution": this.institutionList,
      "bulkRequestName": null,
      "patronBarcodeInRequest": null,
      "fileName": null
    }
    this.bulkrequestService.firstCall(this.postData).subscribe(
      (res) => {
        this.searchRequestVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  previousCall() {
    this.showentries = this.searchRequestVal['pageSize'];
    this.postData = {
      "requestId": null,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocation,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": this.searchRequestVal['totalRecordsCount'],
      "pageNumber": this.searchRequestVal['pageNumber'],
      "pageSize": this.showentries,
      "totalPageCount": this.searchRequestVal['totalPageCount'],
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [],
      "requestTypes": [],
      "deliveryLocations": [],
      "bulkSearchResultRows": [],
      "requestStatuses": [],
      "institutionList": [],
      "disableRequestingInstitution": false,
      "onChange": null,
      "showRequestErrorMsg": false,
      "requestingInstituionHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null,
      "file": null,
      "requestIdSearch": this.bulkRequestIdSearch,
      "requestNameSearch": this.bulkRequestNameSearch,
      "patronBarcodeSearch": this.bulkPatronBarcodeSearch,
      "institution": this.institutionList,
      "bulkRequestName": null,
      "patronBarcodeInRequest": null,
      "fileName": null
    }
    this.bulkrequestService.previousCall(this.postData).subscribe(
      (res) => {
        this.searchRequestVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  nextCall() {
    this.showentries = this.searchRequestVal['pageSize'];
    this.postData = {
      "requestId": null,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocation,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": this.searchRequestVal['totalRecordsCount'],
      "pageNumber": this.searchRequestVal['pageNumber'],
      "pageSize": this.showentries,
      "totalPageCount": this.searchRequestVal['totalPageCount'],
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [],
      "requestTypes": [],
      "deliveryLocations": [],
      "bulkSearchResultRows": [],
      "requestStatuses": [],
      "institutionList": [],
      "disableRequestingInstitution": false,
      "onChange": null,
      "showRequestErrorMsg": false,
      "requestingInstituionHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null,
      "file": null,
      "requestIdSearch": this.bulkRequestIdSearch,
      "requestNameSearch": this.bulkRequestNameSearch,
      "patronBarcodeSearch": this.bulkPatronBarcodeSearch,
      "institution": this.institutionList,
      "bulkRequestName": null,
      "patronBarcodeInRequest": null,
      "fileName": null
    }
    this.bulkrequestService.nextCall(this.postData).subscribe(
      (res) => {
        this.searchRequestVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  lastCall() {
    this.showentries = this.searchRequestVal['pageSize'];
    this.postData = {
      "requestId": null,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocation,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": this.searchRequestVal['totalRecordsCount'],
      "pageNumber": this.searchRequestVal['pageNumber'],
      "pageSize": this.showentries,
      "totalPageCount": this.searchRequestVal['totalPageCount'],
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [],
      "requestTypes": [],
      "deliveryLocations": [],
      "bulkSearchResultRows": [],
      "requestStatuses": [],
      "institutionList": [],
      "disableRequestingInstitution": false,
      "onChange": null,
      "showRequestErrorMsg": false,
      "requestingInstituionHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null,
      "file": null,
      "requestIdSearch": this.bulkRequestIdSearch,
      "requestNameSearch": this.bulkRequestNameSearch,
      "patronBarcodeSearch": this.bulkPatronBarcodeSearch,
      "institution": this.institutionList,
      "bulkRequestName": null,
      "patronBarcodeInRequest": null,
      "fileName": null
    }
    this.bulkrequestService.lastCall(this.postData).subscribe(
      (res) => {
        this.searchRequestVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }


  onPageSizeChange(value) {
    this.showentries = value;
    this.postData = {
      "requestId": null,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocation,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": this.searchRequestVal['totalRecordsCount'],
      "pageNumber": this.searchRequestVal['pageNumber'],
      "pageSize": this.showentries,
      "totalPageCount": this.searchRequestVal['totalPageCount'],
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [],
      "requestTypes": [],
      "deliveryLocations": [],
      "bulkSearchResultRows": [],
      "requestStatuses": [],
      "institutionList": [],
      "disableRequestingInstitution": false,
      "onChange": null,
      "showRequestErrorMsg": false,
      "requestingInstituionHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null,
      "file": null,
      "requestIdSearch": this.bulkRequestIdSearch,
      "requestNameSearch": this.bulkRequestNameSearch,
      "patronBarcodeSearch": this.bulkPatronBarcodeSearch,
      "institution": this.institutionList,
      "bulkRequestName": null,
      "patronBarcodeInRequest": null,
      "fileName": null
    }
    this.bulkrequestService.onRequestPageSizeChange(this.postData).subscribe(
      (res) => {
        this.searchRequestVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  pagination() {
    if (this.searchRequestVal['pageNumber'] == 0 && (this.searchRequestVal['totalPageCount'] - 1 > 0)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = false;
      this.lastbutton = false;
    } else if (this.searchRequestVal['pageNumber'] == 0 && (this.searchRequestVal['pageNumber'] == this.searchRequestVal['totalPageCount'] - 1)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = true;
      this.lastbutton = true;
    }
    else if ((this.searchRequestVal['pageNumber'] == this.searchRequestVal['totalPageCount'] - 1) && this.searchRequestVal['totalPageCount'] - 1 > 0) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = true;
      this.lastbutton = true;
    } else if ((this.searchRequestVal['pageNumber'] < this.searchRequestVal['totalPageCount'] - 1) && (this.searchRequestVal['pageNumber'] != 0)) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = false;
      this.lastbutton = false;
    }
  }
  downloadReports(requestId) {
    this.bulkrequestService.downloadReports(requestId).subscribe(
      (res) => {
        this.download_response = res;
        this.fileName = this.download_response['fileName'];
        var contentType = "application/vnd.ms-excel";
        this.dataDecode = atob(this.download_response['content']);
        var file = new Blob([this.dataDecode], { type: contentType });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.setAttribute('download', this.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  toggleBulkRequestIdSearch() {
    if (isNaN(this.bulkRequestIdSearch)) {
      this.bulkRequestIdSearchError = true;
    } else {
      this.bulkRequestIdSearchError = false;
    }
  }
  timezone(date) {
    return this.dashBoardService.setTimeZone(date);
  }
}
