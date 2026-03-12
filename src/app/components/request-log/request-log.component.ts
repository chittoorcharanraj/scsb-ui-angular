import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {RequestService} from "@service/request/request.service";
import {ActivatedRoute} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DashBoardService} from "@service/dashBoard/dash-board.service";
import {TreeNode} from "primeng/api";
import {RequestLogService} from "@service/request-log/request-log.service";
import {from} from "rxjs";

declare var $: any;

@Component({
  standalone: false,
  selector: 'app-request-log',
  templateUrl: './request-log.component.html',
  styleUrls: ['./request-log.component.css']
})
export class RequestLogComponent implements OnInit {
  private pageNumber: number;
  private totalPageCount: any;
  private statusRequest: boolean;
  private dateFromException: any;
  private dateToException: any;
  private start: any;
  private end: any;
  requestExceptionFromToError: boolean;
  constructor(private requestLogService: RequestLogService, private formBuilder: UntypedFormBuilder, private requestService: RequestService, private router: ActivatedRoute, private spinner: NgxSpinnerService, private dashBoardService: DashBoardService) { }
  institutions: any = [];
  requestTypes: any = [];
  status_fields = true;
  requestForm: UntypedFormGroup;
  firstbutton = true;
  previousbutton = true;
  nextbutton = false;
  lastbutton = false;
  messageNoSearchRecords = false;
  searchReqresultFirst = false;
  searchBar = false;
  create_request = false;
  itemBarcodeId: string;
  requestingInstitutionId: string;
  disableRequestingInstitution: string;
  disableSearchInstitution: boolean = false;
  itemTitleId: string;
  itemOwningInstitutionId: string;
  patronBarcodeId: string;
  patronEmailId: string;
  requestTypeId: string;
  deliveryLocationId: string;
  requestNotesId: string;
  notesLengthErrMsg = false;
  requestVal: TreeNode[];
  requestTypeErrorMessage = false;
  requestingInstitutionErrorMessage = false;
  deliveryLocationErrorMessage = false;
  itemBarcodeErrorMessage = false;
  itemBarcodeNotFoundErrorMessage = false;
  itemBarcodeNotAvailableFrozenItemsErrorMessage = false;
  itemBarcodeNotAvailableErrorMessage = false;
  itemBarcodeNoPermissionErrorMessage = false;
  patronBarcodeErrorMessage = false
  itembarcodeVal: TreeNode[];
  deliveryLocVal: any[];
  eddshow = false;
  startPageErrorMessage = false;
  endPageErrorMessage = false;
  articleTitleErrorMessage = false;
  patronEmailIdErrorMessage = false;
  EmailMandatoryErrorMessage = false;
  StartPage: string;
  EndPage: string;
  VolumeNumber: string;
  Issue: string;
  ArticleAuthor: string;
  ChapterTitle: string;
  createsubmit = false;
  searchReqVal: TreeNode[];
  searchPatronBarcode: string;
  searchItemBarcode: string;
  requestStatus: string;
  validationStatus: string;
  searchInstitution: string;
  searchReqresult = false;
  patronBarcodeSearchError = false;
  itemBarcodeSearchError = false;
  noteAll = true;
  noteActive = false;
  searchreqResultVal: TreeNode[];
  searchRecCount: string;
  requestNotesData: string;
  resubmitReqConfirmItemBarcode: string;
  requestId: number;
  resubmitRequestConfirmBodyId = true;
  reqcancelmsg: string;
  nextvalue = 0;
  previousValue = 0;
  lastValue = 0;
  showentries = 10;
  barcode_id: string;
  resubmitResponse: TreeNode[];
  resubmitResponseMessage: string;
  requestLogResponse: TreeNode[];
  requestSubmitResponse: TreeNode[];
  rolesRes: Object;
  status: boolean;
  createRequestError: boolean;
  errorMessage: string;
  interval: any;
  storageLocationSearch: string;
  storageLocation: string;
  disableStorageLocation = false;
  refreshCount: number = 0;
  tempBarcode: string = '';
  requestDateRangeto: any;
  requestDateRangefrom: any;
  requestFromDateErrorText: any;
  requestToDateErrorText: any;
  requestFromToError: any;
  submitClick: boolean = false;

  postData = {
  "institution": "",
  "status":"",
  "validationStatus":"",
  "pageNumber": 0,
  "pageSize": 10,
  "fromDate": "",
  "toDate": "",
  "gatewayRequestLogId":0
  }
  noRecordsMessage: string = "No records found";

  ngOnInit(): void {
    this.loadRequestLog();
  }
  timezone(date) {
    return this.dashBoardService.setTimeZone(date);
  }

  searchRequests() {
    this.pageNumber = 0;
    if(!this.validateExceptionDateRange()) {
      this.getRequestLogData();
    }
  }
  clear(){
    this.requestDateRangeto = '',
    this.requestDateRangefrom = '',
    this.requestStatus = '',
    this.validationStatus = '',
    this.searchInstitution = ''
  }
  loadRequestLog() {
    this.spinner.show();
    this.searchInstitution = '';
    this.requestStatus = '';
    this.validationStatus = '';
    this.searchItemBarcode = '';
    this.searchReqresult = false;
    this.create_request = false;
    this.messageNoSearchRecords = false;
    this.requestService.loadSearchRequest().subscribe(
        (res) => {
          this.searchReqVal = res;
          this.searchInstitution = this.searchReqVal['institution'];
          this.searchBar = true;
          this.searchReqresultFirst = false;
          this.spinner.hide();
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
  }
  getRequestLogData() {
    this.spinner.show();
    this.postData = {
      "institution": this.searchInstitution,
      "status":this.requestStatus,
      "validationStatus":this.validationStatus,
      "pageNumber": this.pageNumber,
      "pageSize": this.showentries,
      "fromDate":this.requestDateRangefrom ,
      "toDate": this.requestDateRangeto,
      "gatewayRequestLogId":0
    }
    this.requestLogService.getAllRequests(this.postData).subscribe(
        (res) => {
          this.spinner.hide();
          this.requestLogResponse = res;
          this.pageNumber = this.requestLogResponse['pageNumber'];
          this.searchRecCount = this.requestLogResponse['totalRecordsCount'];
          this.searchBar = true;
          this.searchReqresultFirst = true;
          if (this.requestLogResponse['totalRecordsCount'] == "0") {
            this.submitClick = true;
            this.searchReqresult = false;
            this.messageNoSearchRecords = true;
          } else {
            if(this.requestStatus == "SUCCESS"){
              this.submitClick = true;
            }
            this.searchReqresult = true;
            this.messageNoSearchRecords = false;
            this.paginationRequestLogReport();
          }
        },
        (error) => {
          this.spinner.hide();
          this.dashBoardService.errorNavigation();
        });
  }

  reSubmitRequest(itembarcode, requestId) {
    this.resubmitReqConfirmItemBarcode = itembarcode;
    this.requestId = requestId;
    this.resubmitRequestConfirmBodyId = true;
    $('#resubmitRequestModal').modal({ show: true });
  }

  closeResubmitRequestItem() {
    $('#resubmitRequestModal').modal({ show: false });
  }

  resubmitRequestItem() {
    this.postData = {
      "institution": this.searchInstitution,
      "status":this.requestStatus,
      "validationStatus":this.validationStatus,
      "pageNumber": this.pageNumber,
      "pageSize": this.showentries,
      "fromDate":this.requestDateRangefrom ,
      "toDate": this.requestDateRangeto,
      "gatewayRequestLogId":this.requestId
    }
    this.requestLogService.submitAllRequests(this.postData).subscribe(
        (res) => {
          this.spinner.hide();
          this.requestSubmitResponse = res;
          this.resubmitRequestConfirmBodyId = false;
          if(this.requestSubmitResponse['status'] != null && this.requestSubmitResponse['status'].includes('SUCCESS')){
            this.resubmitResponseMessage = 'Resubmit Successful';
            this.status = true;
          } else if(this.requestSubmitResponse['status'] != null && this.requestSubmitResponse['status'].includes('PARTIALLY')){
            this.resubmitResponseMessage = 'Resubmit Partially Successful';
            this.status = false;
          } else {
            this.resubmitResponseMessage = 'Resubmit Failed';
            this.status = false;
          }
        },
        (error) => {
          this.spinner.hide();
          this.dashBoardService.errorNavigation();
        });
  }

  submitRequests() {
    this.spinner.show();
    this.postData = {
      "institution": this.searchInstitution,
      "status":this.requestStatus,
      "validationStatus":this.validationStatus,
      "pageNumber": 0,
      "pageSize": 0,
      "fromDate":this.requestDateRangefrom ,
      "toDate": this.requestDateRangeto,
      "gatewayRequestLogId": 0
    }
    this.requestLogService.submitAllRequests(this.postData).subscribe(
        (res) => {
          this.spinner.hide();
          this.requestSubmitResponse = res;
        },
        (error) => {
          this.spinner.hide();
          this.dashBoardService.errorNavigation();
        });
  }

  paginationRequestLogReport() {
    if (this.requestLogResponse['pageNumber'] == 0 && (this.requestLogResponse['totalPageCount'] - 1 > 0)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = false;
      this.lastbutton = false;
    } else if (this.requestLogResponse['pageNumber'] == 0 && (this.requestLogResponse['pageNumber'] == this.requestLogResponse['totalPageCount'] - 1)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = true;
      this.lastbutton = true;
    }else if ((this.requestLogResponse['pageNumber'] == this.requestLogResponse['totalPageCount'] - 1) && this.requestLogResponse['totalPageCount'] - 1 > 0) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = true;
      this.lastbutton = true;
    } else if ((this.requestLogResponse['pageNumber'] < this.requestLogResponse['totalPageCount'] - 1) && (this.requestLogResponse['pageNumber'] != 0)) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = false;
      this.lastbutton = false;
    }
  }

  firstCall(){
    this.pageNumber = 0;
    this.searchCall();
  }
  previousCall(){
    this.pageNumber = this.requestLogResponse['pageNumber'] - 1;
    this.searchCall();
  }
  nextCall(){
    this.pageNumber = this.requestLogResponse['pageNumber'] + 1;
    this.searchCall();
  }
  lastCall(){
    this.pageNumber = this.requestLogResponse['totalPageCount'] - 1;
    this.searchCall();
  }
  searchCall() {
    this.totalPageCount = this.requestLogResponse['totalPageCount'];
    this.getRequestLogData();
  }


  validateExceptionDateRange() {
    this.statusRequest = false;
    var fromDate = false;
    var toDate = false;
    if (!(this.requestDateRangefrom == '' || this.requestDateRangefrom == undefined)) {
      fromDate = true;
    }
    if (!(this.requestDateRangeto == '' || this.requestDateRangeto == undefined)) {
      toDate = true;
    }
    if(fromDate && toDate) {
      this.dateFromException = this.toDate(this.requestDateRangefrom);
      this.dateToException = this.toDate(this.requestDateRangeto);
      if (this.compareDate(this.dateFromException, this.dateToException)) {
        this.statusRequest = true;
        this.requestExceptionFromToError = true;
      } else {
        this.requestExceptionFromToError = false;
      }
    }
    return this.statusRequest;
  }
  compareDate(fromD, toD) {
    this.start = this.convertDate(fromD);
    this.end = this.convertDate(toD);
    return (parseFloat(this.start) > parseFloat(this.end));
  }
  toDate(param) {
    if (param) {
      var tempDate = param.split("-");
      var date = tempDate[1] + '/' + tempDate[2] + '/' + tempDate[0];
    }
    return date;
  }
  convertDate(date) {
    var a = new Date(date);
    var msDateA = Date.UTC(a.getFullYear(), a.getMonth() + 1, a.getDate());
    return msDateA;
  }
  onPageSizeChange(showentries){
    this.pageNumber = 0;
    this.showentries = showentries;
    this.getRequestLogData();
  }

  statusChange() {
    if(this.requestStatus == "SUCCESS"){
      this.submitClick = true;
    } else {
      this.submitClick = false;
    }
  }
  requestValidationNoteModal(notes) {
    this.requestNotesData = notes;
    $('#requestNotesModal').modal({ show: true });
  }
}
