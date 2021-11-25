import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { RequestService } from '@service/request/request.service';
import { RolesPermissionsService } from '@service/rolesPermissions/roles-permissions.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TreeNode } from 'primeng/api';

declare var $: any;

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit,OnDestroy {
  constructor(private rolesService: RolesPermissionsService, private formBuilder: FormBuilder, private requestService: RequestService, private router: ActivatedRoute, private spinner: NgxSpinnerService, private dashBoardService: DashBoardService) { }
  institutions: any = [];
  requestTypes: any = [];
  status_fields = true;
  requestForm: FormGroup;
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
  disableSearchInstitution: string;
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
  searchInstitutionList: string;
  searchReqresult = false;
  patronBarcodeSearchError = false;
  itemBarcodeSearchError = false;
  noteAll = true;
  noteActive = false;
  searchreqResultVal: TreeNode[];
  searchRecCount: string;
  requestNotesData: string;
  resubmitReqConfirmItemBarcode: string;
  requestId: string;
  resubmitRequestConfirmBodyId = true;
  reqcancelmsg: string;
  nextvalue = 0;
  previousValue = 0;
  lastValue = 0;
  showentries = 10;
  barcode_id: string;
  resubmitResponse: TreeNode[];
  resubmitResponseMessage: string;
  createResponse: TreeNode[];
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
  ngOnInit(): void {
    this.dashBoardService.setApiPath('request');
    this.rolesRes = this.rolesService.getRes();
    this.router.paramMap.subscribe(params => {
      this.barcode_id = params.get('barcode');
      if (this.barcode_id) {
        this.itemBarcodeId = this.barcode_id;
        this.initialloadroute();
      } else {
        this.initialload();
      }
    });

    this.requestForm = this.formBuilder.group({
      barcodeFieldName: ['']
    });
  }
  postData = {
    "requestId": null,
    "patronBarcode": null,
    "itemBarcode": null,
    "status": null,
    "deliveryLocation": null,
    "patronBarcodeInRequest": null,
    "itemBarcodeInRequest": null,
    "deliveryLocationInRequest": null,
    "itemTitle": null,
    "itemOwningInstitution": null,
    "storageLocation": null,
    "patronEmailAddress": null,
    "requestingInstitution": null,
    "requestType": null,
    "requestNotes": null,
    "startPage": null,
    "endPage": null,
    "volumeNumber": null,
    "issue": null,
    "articleAuthor": null,
    "articleTitle": null,
    "message": null,
    "errorMessage": null,
    "totalRecordsCount": "0",
    "pageNumber": 0,
    "pageSize": this.showentries,
    "totalPageCount": 0,
    "submitted": false,
    "showResults": false,
    "requestingInstitutions": [

    ],
    "requestTypes": [

    ],
    "deliveryLocations": [

    ],
    "searchResultRows": [

    ],
    "requestStatuses": [

    ],
    "institutionList": [

    ],
    "disableRequestingInstitution": false,
    "onChange": null,
    "institution": null,
    "showRequestErrorMsg": null,
    "requestingInstituionHidden": null,
    "itemBarcodeHidden": null,
    "disableSearchInstitution": false,
    "searchInstitutionHdn": null
  }
  initialload() {
    this.itemBarcodeErrorMessage = false;
    this.itemBarcodeNotFoundErrorMessage = false;
    this.itemBarcodeNotAvailableErrorMessage = false;
    this.itemBarcodeNoPermissionErrorMessage = false;
    this.itemBarcodeNotAvailableFrozenItemsErrorMessage = false;
    this.requestTypeId = 'RETRIEVAL';
    this.eddshow = false;
    this.requestTypes = [];
    this.institutions = [];
    this.deliveryLocVal = [];
    this.createRequestError = false;
    this.create_request = true;
    this.requestService.loadCreateRequest().subscribe(
      (res) => {
        this.requestVal = res;
        for (var i = 0; i < this.requestVal['requestingInstitutions'].length; i++) {
          this.institutions.push(this.requestVal['requestingInstitutions'][i]);
        }
        for (var j = 0; j < this.requestVal['requestTypes'].length; j++) {
          this.requestTypes.push(this.requestVal['requestTypes'][j]);
        }
        this.requestTypeId = this.requestVal['requestType'];
        this.itemBarcodeId = '';
        this.requestingInstitutionId = this.requestVal['requestingInstitution'];
        this.itemTitleId = '';
        this.itemOwningInstitutionId = '';
        this.patronBarcodeId = '';
        this.patronEmailId = '';
        this.deliveryLocationId = '';
        this.requestNotesId = '';
        this.StartPage = '';
        this.EndPage = '';
        this.VolumeNumber = '';
        this.Issue = '';
        this.ArticleAuthor = '';
        this.ChapterTitle = '';
        this.disableRequestingInstitution = this.requestVal['disableRequestingInstitution'];
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  initialloadroute() {
    this.create_request = true;
    this.requestService.loadCreateRequest().subscribe(
      (res) => {
        this.requestVal = res;
        for (var i = 0; i < this.requestVal['requestingInstitutions'].length; i++) {
          this.institutions.push(this.requestVal['requestingInstitutions'][i]);
        }
        this.requestingInstitutionId = this.requestVal['requestingInstitution'];
        this.patronBarcodeId = '';
        this.patronEmailId = '';
        this.deliveryLocationId = '';
        this.requestNotesId = '';
        this.StartPage = '';
        this.EndPage = '';
        this.VolumeNumber = '';
        this.Issue = '';
        this.ArticleAuthor = '';
        this.ChapterTitle = '';
        this.disableRequestingInstitution = this.requestVal['disableRequestingInstitution'];

        this.populateItemDetails(this.itemBarcodeId);
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      }
    );
  }

  loadSearchRequest() {
    this.spinner.show();
    this.searchInstitutionList = '';
    this.requestStatus = '';
    this.searchPatronBarcode = '';
    this.searchItemBarcode = '';
    this.searchReqresult = false;
    this.create_request = false;
    this.messageNoSearchRecords = false;
    this.requestService.loadSearchRequest().subscribe(
      (res) => {
        this.searchReqVal = res;
        this.searchInstitutionList = this.searchReqVal['institution'];
        this.disableSearchInstitution = this.searchReqVal['disableSearchInstitution'];
        this.searchBar = true;
        this.storageLocationSearch = '';
        this.spinner.hide();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  loadCreateRequestnew() {
    this.searchBar = false;
    this.create_request = true;
    this.createsubmit = false;
    this.itemBarcodeId = '';
    this.requestingInstitutionId = '';
    this.itemTitleId = '';
    this.itemOwningInstitutionId = '';
    this.patronBarcodeId = '';
    this.patronEmailId = '';
    this.deliveryLocationId = '';
    this.requestNotesId = '';
    this.StartPage = '';
    this.EndPage = '';
    this.VolumeNumber = '';
    this.Issue = '';
    this.ArticleAuthor = '';
    this.ChapterTitle = '';
    this.storageLocation = '';
    this.searchItemBarcode = '';
    this.initialload();
    if (this.interval) {
      clearInterval(this.interval);
    }
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

  populateItemDetails(itemBarcodeId) {
    var barcode = itemBarcodeId;
    if (!(itemBarcodeId == undefined || itemBarcodeId == null || itemBarcodeId == '')) {
      barcode = itemBarcodeId.trim();
    }
    if (this.tempBarcode == '' || (this.tempBarcode != barcode)) {
      this.tempBarcode = barcode;
      this.postData = {
        "requestId": null,
        "patronBarcode": null,
        "itemBarcode": null,
        "status": null,
        "deliveryLocation": null,
        "patronBarcodeInRequest": null,
        "itemBarcodeInRequest": itemBarcodeId,
        "deliveryLocationInRequest": null,
        "itemTitle": null,
        "itemOwningInstitution": this.itemOwningInstitutionId,
        "storageLocation": null,
        "patronEmailAddress": null,
        "requestingInstitution": this.requestingInstitutionId,
        "requestType": null,
        "requestNotes": null,
        "startPage": null,
        "endPage": null,
        "volumeNumber": null,
        "issue": null,
        "articleAuthor": null,
        "articleTitle": null,
        "message": null,
        "errorMessage": null,
        "totalRecordsCount": "0",
        "pageNumber": 0,
        "pageSize": this.showentries,
        "totalPageCount": 0,
        "submitted": false,
        "showResults": false,
        "requestingInstitutions": [

        ],
        "requestTypes": [
        ],
        "deliveryLocations": [

        ],
        "searchResultRows": [

        ],
        "requestStatuses": [

        ],
        "institutionList": [

        ],
        "disableRequestingInstitution": false,
        "onChange": true,
        "institution": null,
        "showRequestErrorMsg": null,
        "requestingInstituionHidden": null,
        "itemBarcodeHidden": null,
        "disableSearchInstitution": false,
        "searchInstitutionHdn": null
      }
      if (!(itemBarcodeId == undefined || itemBarcodeId == null || itemBarcodeId == '')) {
        this.requestService.populateItemtDetails(this.postData).subscribe(
          (res) => {
            this.itembarcodeVal = res;
            if (this.itembarcodeVal['errorMessage'] != null) {
              this.itemBarcodeNotFoundErrorMessage = true;
              this.itemBarcodeNotAvailableErrorMessage = false;
              this.itemBarcodeNoPermissionErrorMessage = false;
              this.itemBarcodeNotAvailableFrozenItemsErrorMessage = false;
              this.itemTitleId = '';
              this.itemOwningInstitutionId = '';
            } else if (this.itembarcodeVal['notAvailableFrozenItemsErrorMessage'] != null) {
              this.itemBarcodeNotAvailableFrozenItemsErrorMessage = true;
              this.itemBarcodeNotFoundErrorMessage = false;
              this.itemBarcodeNotAvailableErrorMessage = false;
              this.itemBarcodeNoPermissionErrorMessage = false;
              this.itemTitleId = this.itembarcodeVal['itemTitle'];
              this.itemOwningInstitutionId = this.itembarcodeVal['itemOwningInstitution'];
              this.storageLocation = this.itembarcodeVal['storageLocation'];
            } else if (this.itembarcodeVal['notAvailableErrorMessage'] != null) {
              this.itemBarcodeNotAvailableErrorMessage = true;
              this.itemBarcodeNotAvailableFrozenItemsErrorMessage = false;
              this.itemBarcodeNotFoundErrorMessage = false;
              this.itemBarcodeNoPermissionErrorMessage = false;
              this.itemTitleId = this.itembarcodeVal['itemTitle'];
              this.itemOwningInstitutionId = this.itembarcodeVal['itemOwningInstitution'];
              this.storageLocation = this.itembarcodeVal['storageLocation'];
            } else if (this.itembarcodeVal['noPermissionErrorMessage'] != null) {
              this.itemBarcodeNoPermissionErrorMessage = true;
              this.itemBarcodeNotFoundErrorMessage = false;
              this.itemBarcodeNotAvailableErrorMessage = false;
              this.itemBarcodeNotAvailableFrozenItemsErrorMessage = false;
              this.itemTitleId = this.itembarcodeVal['itemTitle'];
              this.itemOwningInstitutionId = this.itembarcodeVal['itemOwningInstitution'];
              this.storageLocation = this.itembarcodeVal['storageLocation'];
            } else {
              this.itemBarcodeNotFoundErrorMessage = false;
              this.itemBarcodeNotAvailableErrorMessage = false;
              this.itemBarcodeNoPermissionErrorMessage = false;
              this.itemBarcodeNotAvailableFrozenItemsErrorMessage = false;
              this.itemTitleId = this.itembarcodeVal['itemTitle'];
              this.itemOwningInstitutionId = this.itembarcodeVal['itemOwningInstitution'];
              this.storageLocation = this.itembarcodeVal['storageLocation'];
            }
            this.requestTypes = [];
            for (var j = 0; j < this.itembarcodeVal['requestTypes'].length; j++) {
              this.requestTypes.push(this.itembarcodeVal['requestTypes'][j]);
            }
            this.requestTypeId = this.itembarcodeVal['requestType'];
            if(this.requestTypeId == 'EDD'){
              this.eddshow = true;
            } else {
              this.eddshow = false;
            }
            var del = this.itembarcodeVal['deliveryLocation'];
            if (del != null) {
              this.deliveryLocVal = ['', ''];
              this.deliveryLocVal = Object.keys(del).map(function (data) {
                return [data, del[data]];
              });
            }
          },
          (error) => {
            this.dashBoardService.errorNavigation();
          });
      }
    }
  }

  populateDeliveryLocations(insituval) {
    this.postData = {
      "requestId": null,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "patronBarcodeInRequest": null,
      "itemBarcodeInRequest": this.itemBarcodeId,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": null,
      "patronEmailAddress": null,
      "requestingInstitution": insituval,
      "requestType": null,
      "requestNotes": null,
      "startPage": null,
      "endPage": null,
      "volumeNumber": null,
      "issue": null,
      "articleAuthor": null,
      "articleTitle": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": null,
      "pageNumber": 0,
      "pageSize": this.showentries,
      "totalPageCount": 0,
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [

      ],
      "requestTypes": [
      ],
      "deliveryLocations": [

      ],
      "searchResultRows": [

      ],
      "requestStatuses": [

      ],
      "institutionList": [

      ],
      "disableRequestingInstitution": false,
      "onChange": true,
      "institution": null,
      "showRequestErrorMsg": null,
      "requestingInstituionHidden": null,
      "itemBarcodeHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null
    }
    if(!(insituval == undefined || insituval == null || insituval == '') && !(this.itemBarcodeId == undefined || this.itemBarcodeId == null || this.itemBarcodeId == '')){
    this.requestService.populateItemtDetails(this.postData).subscribe(
      (res) => {
        var del = res['deliveryLocation'];
        this.deliveryLocVal = Object.keys(del).map(function (data) {
          return [data, del[data]];
        });
        this.requestTypes = [];
        for (var j = 0; j < res['requestTypes'].length; j++) {
          this.requestTypes.push(res['requestTypes'][j]);
        }
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
    }
  }

  reqTpeEDD(val) {
    this.deliveryLocationErrorMessage = false;
    if (val == 'EDD') {
      this.deliveryLocationId = '';
      this.eddshow = true;
      this.removeErrorMessagesofnEDD();
    } else {
      this.eddshow = false;
      this.removeErrorMessagesofEDD();
    }

  }

  removeErrorMessagesofEDD() {
    this.itemBarcodeErrorMessage = false;
    this.requestingInstitutionErrorMessage = false;
    this.patronBarcodeErrorMessage = false;
    this.EmailMandatoryErrorMessage = false;
    this.requestTypeErrorMessage = false;
    this.startPageErrorMessage = false;
    this.endPageErrorMessage = false;
    this.articleTitleErrorMessage = false;
  }
  removeErrorMessagesofnEDD() {
    this.itemBarcodeErrorMessage = false;
    this.requestingInstitutionErrorMessage = false;
    this.patronBarcodeErrorMessage = false;
    this.deliveryLocationErrorMessage = false;
    this.requestTypeErrorMessage = false;
  }
  validateEmailAddress(val) {
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i

    if (!pattern.test(val)) {
      if (!(val == '')) {
        this.patronEmailIdErrorMessage = true;
        this.EmailMandatoryErrorMessage = false;
      } else {
        this.patronEmailIdErrorMessage = false;
      }
    } else {
      this.patronEmailIdErrorMessage = false;
    }
  }
  createRequest() {
    if (this.eddshow) {
      if (this.validateInputs_edd()) {
        this.itemBarcodeErrorMessage = false;
        this.requestingInstitutionErrorMessage = false;
        this.patronBarcodeErrorMessage = false;
        this.EmailMandatoryErrorMessage = false;
        this.startPageErrorMessage = false;
        this.endPageErrorMessage = false;
        this.articleTitleErrorMessage = false;
        this.postData = {
          "requestId": null,
          "patronBarcode": this.patronBarcodeId,
          "itemBarcode": this.itemBarcodeId,
          "status": null,
          "deliveryLocation": this.deliveryLocationId,
          "patronBarcodeInRequest": this.patronBarcodeId,
          "itemBarcodeInRequest": this.itemBarcodeId,
          "deliveryLocationInRequest": this.deliveryLocationId,
          "itemTitle": this.itemTitleId,
          "itemOwningInstitution": this.itemOwningInstitutionId,
          "storageLocation": this.storageLocation,
          "patronEmailAddress": this.patronEmailId,
          "requestingInstitution": this.requestingInstitutionId,
          "requestType": this.requestTypeId,
          "requestNotes": this.requestNotesId,
          "startPage": this.StartPage,
          "endPage": this.EndPage,
          "volumeNumber": this.VolumeNumber,
          "issue": this.Issue,
          "articleAuthor": this.ArticleAuthor,
          "articleTitle": this.ChapterTitle,
          "message": null,
          "errorMessage": null,
          "totalRecordsCount": "0",
          "pageNumber": 0,
          "pageSize": this.showentries,
          "totalPageCount": 0,
          "submitted": false,
          "showResults": false,
          "requestingInstitutions": [

          ],
          "requestTypes": [
          ],
          "deliveryLocations": [

          ],
          "searchResultRows": [

          ],
          "requestStatuses": [

          ],
          "institutionList": [

          ],
          "disableRequestingInstitution": false,
          "onChange": false,
          "institution": null,
          "showRequestErrorMsg": null,
          "requestingInstituionHidden": null,
          "itemBarcodeHidden": null,
          "disableSearchInstitution": false,
          "searchInstitutionHdn": null
        }
        this.spinner.show();
        this.requestService.createRequest(this.postData).subscribe(
          (res) => {
            this.createResponse = res;
            if (this.createResponse['errorMessage'] != null) {
              this.errorMessage = this.createResponse['errorMessage'];
              this.createRequestError = true;
            } else {
              this.createsubmit = true;
              this.createRequestError = false;
            }
            this.spinner.hide();
          },
          (error) => {
            this.dashBoardService.errorNavigation();
          });
      }
      //with edd end
      this.spinner.hide();
    } else {
      //without edd strt
      this.spinner.hide();
      if (this.validateInputs()) {
        this.itemBarcodeErrorMessage = false;
        this.requestingInstitutionErrorMessage = false;
        this.patronBarcodeErrorMessage = false;
        this.deliveryLocationErrorMessage = false;
        this.postData = {
          "requestId": null,
          "patronBarcode": this.patronBarcodeId,
          "itemBarcode": this.itemBarcodeId,
          "status": null,
          "deliveryLocation": this.deliveryLocationId,
          "patronBarcodeInRequest": this.patronBarcodeId,
          "itemBarcodeInRequest": this.itemBarcodeId,
          "deliveryLocationInRequest": this.deliveryLocationId,
          "itemTitle": this.itemTitleId,
          "itemOwningInstitution": this.itemOwningInstitutionId,
          "storageLocation": this.storageLocation,
          "patronEmailAddress": this.patronEmailId,
          "requestingInstitution": this.requestingInstitutionId,
          "requestType": this.requestTypeId,
          "requestNotes": this.requestNotesId,
          "startPage": this.StartPage,
          "endPage": this.EndPage,
          "volumeNumber": this.VolumeNumber,
          "issue": this.Issue,
          "articleAuthor": this.ArticleAuthor,
          "articleTitle": this.ChapterTitle,
          "message": null,
          "errorMessage": null,
          "totalRecordsCount": "0",
          "pageNumber": 0,
          "pageSize": this.showentries,
          "totalPageCount": 0,
          "submitted": false,
          "showResults": false,
          "requestingInstitutions": [

          ],
          "requestTypes": [
          ],
          "deliveryLocations": [

          ],
          "searchResultRows": [

          ],
          "requestStatuses": [

          ],
          "institutionList": [

          ],
          "disableRequestingInstitution": false,
          "onChange": false,
          "institution": null,
          "showRequestErrorMsg": null,
          "requestingInstituionHidden": null,
          "itemBarcodeHidden": null,
          "disableSearchInstitution": false,
          "searchInstitutionHdn": null
        }
        this.spinner.show();
        this.requestService.createRequest(this.postData).subscribe(
          (res) => {
            this.createResponse = res;
            if (this.createResponse['errorMessage'] != null) {
              this.errorMessage = this.createResponse['errorMessage'];
              this.createRequestError = true;
            } else {
              this.createsubmit = true;
              this.createRequestError = false;
            }
            this.spinner.hide();
          },
          (error) => {
            this.dashBoardService.errorNavigation();
          });
      }
      //without edd end
      this.spinner.hide();
    }
  }
  validateInputs() {
    this.status_fields = true;
    if (this.itemBarcodeId == undefined || this.itemBarcodeId == '' || this.itemBarcodeNotFoundErrorMessage == true) {
      this.itemBarcodeErrorMessage = true;
      this.status_fields = false;
    } else {
      this.itemBarcodeErrorMessage = false;
    }
    if (this.requestingInstitutionId == undefined || this.requestingInstitutionId == '') {
      this.requestingInstitutionErrorMessage = true;
      this.status_fields = false;
    } else {
      this.requestingInstitutionErrorMessage = false;
    }
    if (this.patronBarcodeId == undefined || this.patronBarcodeId == '') {
      this.patronBarcodeErrorMessage = true;
      this.status_fields = false;
    } else {
      this.patronBarcodeErrorMessage = false;
    }
    if (this.patronEmailIdErrorMessage == true) {
      this.status_fields = false;
    }
    if (this.deliveryLocationId == undefined || this.deliveryLocationId == '') {
      this.deliveryLocationErrorMessage = true;
      this.status_fields = false;
    } else {
      this.deliveryLocationErrorMessage = false;
    }
    if (this.requestTypeId == undefined || this.requestTypeId == '') {
      this.requestTypeErrorMessage = true;
      this.status_fields = false;
    } else {
      this.requestTypeErrorMessage = false;
    }
    return this.status_fields;
  }
  validateInputs_edd() {
    this.status_fields = true;
    if (this.itemBarcodeId == undefined || this.itemBarcodeId == '' || this.itemBarcodeNotFoundErrorMessage == true) {
      this.itemBarcodeErrorMessage = true;
      this.status_fields = false;
    } else {
      this.itemBarcodeErrorMessage = false;
    }
    if (this.requestingInstitutionId == undefined || this.requestingInstitutionId == '') {
      this.requestingInstitutionErrorMessage = true;
      this.status_fields = false;
    } else {
      this.requestingInstitutionErrorMessage = false;
    }
    if (this.patronBarcodeId == undefined || this.patronBarcodeId == '') {
      this.patronBarcodeErrorMessage = true;
      this.status_fields = false;
    } else {
      this.patronBarcodeErrorMessage = false;
    }
    if (this.patronEmailId == undefined || this.patronEmailId == '' || this.patronEmailIdErrorMessage == true) {
      if (this.patronEmailIdErrorMessage == false) {
        this.EmailMandatoryErrorMessage = true;
      }
      this.status_fields = false;
    } else {
      this.EmailMandatoryErrorMessage = false;
    }
    if (this.requestTypeId == undefined || this.requestTypeId == '') {
      this.requestTypeErrorMessage = true;
      this.status_fields = false;
    } else {
      this.requestTypeErrorMessage = false;
    }
    if (this.StartPage == undefined || this.StartPage == '') {
      this.startPageErrorMessage = true;
      this.status_fields = false;
    } else {
      this.startPageErrorMessage = false;
    }
    if (this.EndPage == undefined || this.EndPage == '') {
      this.endPageErrorMessage = true;
      this.status_fields = false;
    } else {
      this.endPageErrorMessage = false;
    }
    if (this.ChapterTitle == undefined || this.ChapterTitle == '') {
      this.articleTitleErrorMessage = true;
      this.status_fields = false;
    } else {
      this.articleTitleErrorMessage = false;
    }
    return this.status_fields;
  }
  resetDefaults() {
    this.deliveryLocVal = [];
    this.eddshow = false;
    this.initialload();
  }
  differentpatron() {
    this.deliveryLocVal = [];
    this.eddshow = false;
    this.createsubmit = false;
    this.storageLocation = '';
    this.initialload();
  }
  loadCreateRequestForSamePatron(patronId, reqInstId) {
    this.eddshow = false;
    this.createsubmit = false;
    this.requestService.loadCreateRequest().subscribe(
      (res) => {
        this.requestVal = res;
        this.requestTypeId = this.requestVal['requestType'];
        this.storageLocation = '';
        this.itemBarcodeId = '';
        this.requestingInstitutionId = reqInstId;
        this.itemTitleId = '';
        this.itemOwningInstitutionId = '';
        this.patronBarcodeId = patronId;
        this.patronEmailId = '';
        this.deliveryLocationId = '';
        this.requestNotesId = '';
        this.StartPage = '';
        this.EndPage = '';
        this.VolumeNumber = '';
        this.Issue = '';
        this.ArticleAuthor = '';
        this.ChapterTitle = '';
        this.deliveryLocVal = [];
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  goToSearchRequest(patronBarcode) {
    this.spinner.show();
    this.searchPatronBarcode = patronBarcode;
    this.requestStatus = '';
    this.storageLocationSearch = '';
    this.searchItemBarcode = '';
    this.requestService.loadSearchRequest().subscribe(
      (res) => {
        this.searchReqVal = res;
        this.postData = {
          "requestId": null,
          "patronBarcode": this.searchPatronBarcode,
          "itemBarcode": this.searchItemBarcode,
          "status": this.requestStatus,
          "deliveryLocation": null,
          "patronBarcodeInRequest": null,
          "itemBarcodeInRequest": null,
          "deliveryLocationInRequest": null,
          "itemTitle": null,
          "itemOwningInstitution": null,
          "storageLocation": this.storageLocationSearch,
          "patronEmailAddress": null,
          "requestingInstitution": this.searchInstitutionList,
          "requestType": null,
          "requestNotes": null,
          "startPage": null,
          "endPage": null,
          "volumeNumber": null,
          "issue": null,
          "articleAuthor": null,
          "articleTitle": null,
          "message": null,
          "errorMessage": null,
          "totalRecordsCount": "0",
          "pageNumber": 0,
          "pageSize": this.showentries,
          "totalPageCount": 0,
          "submitted": false,
          "showResults": false,
          "requestingInstitutions": [

          ],
          "requestTypes": [
          ],
          "deliveryLocations": [

          ],
          "searchResultRows": [

          ],
          "requestStatuses": [

          ],
          "institutionList": [

          ],
          "disableRequestingInstitution": false,
          "onChange": false,
          "institution": null,
          "showRequestErrorMsg": null,
          "requestingInstituionHidden": null,
          "itemBarcodeHidden": null,
          "disableSearchInstitution": false,
          "searchInstitutionHdn": null
        }
        this.requestService.goToSearchRequest(this.postData).subscribe(
          (res) => {
            this.searchreqResultVal = res;
            if (this.searchreqResultVal['message'] != null) {
              this.searchReqresultFirst = true;
              this.messageNoSearchRecords = true;
              this.searchReqresult = false;
            } else {
            this.storageLocation = '';
            this.searchReqresultFirst = true;
            this.searchBar = true;
            this.create_request = false;
            this.searchReqresult = true;
            this.messageNoSearchRecords = false;
            this.searchRecCount = this.searchreqResultVal['totalRecordsCount'];
            var refreshStatus = this.refreshRequestStatus();
            if (refreshStatus) {
              this.interval = setInterval(this.refreshRequestStatus.bind(this), 5000);
            }
            this.searchInstitutionList = this.searchreqResultVal['institution'];
            this.disableSearchInstitution = this.searchReqVal['disableSearchInstitution'];
            this.pagination();
          }
            this.spinner.hide();
          },
          (error) => {
            this.dashBoardService.errorNavigation();
          });
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  searchRequests() {
    this.spinner.show();
    if (this.requestStatus == '' || this.requestStatus == undefined) {
      if (this.searchItemBarcode || this.searchPatronBarcode) {
        //search api call start
        this.patronBarcodeSearchError = false;
        this.itemBarcodeSearchError = false;
        this.postData = {
          "requestId": null,
          "patronBarcode": this.searchPatronBarcode,
          "itemBarcode": this.searchItemBarcode,
          "status": this.requestStatus,
          "deliveryLocation": null,
          "patronBarcodeInRequest": null,
          "itemBarcodeInRequest": null,
          "deliveryLocationInRequest": null,
          "itemTitle": null,
          "itemOwningInstitution": null,
          "storageLocation": this.storageLocationSearch,
          "patronEmailAddress": null,
          "requestingInstitution": null,
          "requestType": null,
          "requestNotes": null,
          "startPage": null,
          "endPage": null,
          "volumeNumber": null,
          "issue": null,
          "articleAuthor": null,
          "articleTitle": null,
          "message": null,
          "errorMessage": null,
          "totalRecordsCount": "0",
          "pageNumber": 0,
          "pageSize": 10,
          "totalPageCount": 0,
          "submitted": false,
          "showResults": false,
          "requestingInstitutions": [

          ],
          "requestTypes": [
          ],
          "deliveryLocations": [

          ],
          "searchResultRows": [

          ],
          "requestStatuses": [

          ],
          "institutionList": this.searchReqVal['institutionList'],
          "disableRequestingInstitution": false,
          "onChange": false,
          "institution": this.searchInstitutionList,
          "showRequestErrorMsg": null,
          "requestingInstituionHidden": null,
          "itemBarcodeHidden": null,
          "disableSearchInstitution": false,
          "searchInstitutionHdn": null
        }

        this.requestService.searchRequests(this.postData).subscribe(
          (res) => {
            this.searchReqresultFirst = true;
            this.searchreqResultVal = res;
            this.searchRecCount = this.searchreqResultVal['totalRecordsCount'];
            this.pagination();
            if (this.searchreqResultVal['message'] != null) {
              this.messageNoSearchRecords = true;
              this.searchReqresult = false;
            } else {
              this.messageNoSearchRecords = false;
              this.searchReqresult = true;
              var refreshStatus = this.refreshRequestStatus();
              if (refreshStatus) {
                this.interval = setInterval(this.refreshRequestStatus.bind(this), 3000);
              }
            }
            this.spinner.hide();
          },
          (error) => {
            this.dashBoardService.errorNavigation();
          });
      } else if ((this.searchItemBarcode == undefined || this.searchItemBarcode == '') && (this.searchItemBarcode == undefined || this.searchItemBarcode == '')) {
        this.patronBarcodeSearchError = true;
        this.itemBarcodeSearchError = true;
        this.spinner.hide();
      }
      else if (this.searchItemBarcode == undefined || this.searchItemBarcode == '') {
        this.patronBarcodeSearchError = true;
        this.spinner.hide();
      } else if (this.searchItemBarcode == undefined || this.searchItemBarcode == '') {
        this.itemBarcodeSearchError = true;
        this.spinner.hide();
      }
    } else {
      this.patronBarcodeSearchError = false;
      this.itemBarcodeSearchError = false;
      this.postData = {
        "requestId": null,
        "patronBarcode": this.searchPatronBarcode,
        "itemBarcode": this.searchItemBarcode,
        "status": this.requestStatus,
        "deliveryLocation": null,
        "patronBarcodeInRequest": null,
        "itemBarcodeInRequest": null,
        "deliveryLocationInRequest": null,
        "itemTitle": null,
        "itemOwningInstitution": null,
        "storageLocation": this.storageLocationSearch,
        "patronEmailAddress": null,
        "requestingInstitution": this.searchInstitutionList,
        "requestType": null,
        "requestNotes": null,
        "startPage": null,
        "endPage": null,
        "volumeNumber": null,
        "issue": null,
        "articleAuthor": null,
        "articleTitle": null,
        "message": null,
        "errorMessage": null,
        "totalRecordsCount": "0",
        "pageNumber": 0,
        "pageSize": this.showentries,
        "totalPageCount": 0,
        "submitted": false,
        "showResults": false,
        "requestingInstitutions": [

        ],
        "requestTypes": [
        ],
        "deliveryLocations": [

        ],
        "searchResultRows": [

        ],
        "requestStatuses": [

        ],
        "institutionList": this.searchReqVal['institutionList'],
        "disableRequestingInstitution": false,
        "onChange": false,
        "institution": this.searchInstitutionList,
        "showRequestErrorMsg": null,
        "requestingInstituionHidden": null,
        "itemBarcodeHidden": null,
        "disableSearchInstitution": false,
        "searchInstitutionHdn": null
      }
      this.requestService.searchRequests(this.postData).subscribe(
        (res) => {
          this.searchReqresultFirst = true;
          this.searchreqResultVal = res;
          this.searchRecCount = this.searchreqResultVal['totalRecordsCount'];
          this.pagination();
          if (this.searchreqResultVal['message'] != null) {
            this.messageNoSearchRecords = true;
            this.searchReqresult = false;
          } else {
            this.messageNoSearchRecords = false;
            this.searchReqresult = true;
            this.refreshRequestStatus();
          }
          this.spinner.hide();
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
    }
  }
  refreshRequestStatusRecursive() {
    if (this.refreshCount < 59) {
      this.interval = setTimeout(this.refreshRequestStatus.bind(this), 3000);
      this.refreshCount++;
    } else if(this.refreshCount < 89) {
      this.interval = setTimeout(this.refreshRequestStatus.bind(this), 10000);
      this.refreshCount++;
    } else {
      this.interval = setTimeout(this.refreshRequestStatus.bind(this), 180000);
    }
  }
  refreshRequestStatus(): boolean {
    var refreshStatus = false;
    let statusJson = {
      "status": []
    };
    if (this.searchreqResultVal != null && this.searchreqResultVal != undefined) {
      let searchResults = this.searchreqResultVal['searchResultRows'];
      searchResults.forEach((item, index) => {
        if (item.status == 'PROCESSING ...' || item.status == 'PENDING') {
          statusJson.status.push(item.requestId + '-' + index);
        }
      });
      if (statusJson.status.length > 0) {
        refreshStatus = true;
        this.requestService.refreshStatus(JSON.stringify(statusJson)).subscribe(
          (res) => {
            let changeStatus = res['Status'];
            let changeNotes = res['Notes'];
            if (changeStatus != null && changeStatus != '' && changeNotes != null && changeNotes != '') {
              Object.keys(changeStatus).forEach(statusKey => {
                let reqStatus = changeStatus[statusKey];
                this.searchreqResultVal['searchResultRows'][statusKey].status = reqStatus;
                if (reqStatus !== "PROCESSING ..." && reqStatus !== "PENDING") {
                  $('#refreshIcon-' + statusKey).hide();
                }

                Object.keys(changeNotes).forEach(notesKey => {
                  let reqNotes = changeNotes[notesKey];
                  this.searchreqResultVal['searchResultRows'][notesKey].requestNotes = reqNotes;
                });
              });
            }
          },
          (error) => {
            this.dashBoardService.errorNavigation();
          });
          this.refreshRequestStatusRecursive();
      } else {
        if (this.interval) {
          clearInterval(this.interval);
        }
      }
    }
    return refreshStatus;
  }

  onChangeRequestStatus(statusVal) {
    if (statusVal == '' || statusVal == undefined) {
      this.noteActive = false;
      this.noteAll = true;
    } else if (statusVal == 'Active') {
      this.noteActive = true;
      this.noteAll = false;
      this.patronBarcodeSearchError = false;
      this.itemBarcodeSearchError = false;
    } else {
      this.noteActive = false;
      this.noteAll = false;
      this.patronBarcodeSearchError = false;
      this.itemBarcodeSearchError = false;
    }
  }

  reqNotemodal(notes) {
    this.requestNotesData = notes;
    $('#requestNotesModal').modal({ show: true });
  }

  resubmitReq(itembarcode, reqId) {
    this.resubmitReqConfirmItemBarcode = itembarcode;
    this.requestId = reqId;
    this.resubmitRequestConfirmBodyId = true;
    $('#resubmitRequestModal').modal({ show: true });
  }
  cancelRequest(reqId) {
    this.requestId = reqId;
    this.reqcancelmsg = '';
    $('#cancelConfirmationModal').modal({ show: true });
  }

  closeResubmitRequestItem() {
    $('#resubmitRequestModal').modal({ show: false });
  }

  resubmitRequestItem() {
    this.spinner.show();
    this.postData = {
      "requestId": this.requestId,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "patronBarcodeInRequest": null,
      "itemBarcodeInRequest": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": null,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "startPage": null,
      "endPage": null,
      "volumeNumber": null,
      "issue": null,
      "articleAuthor": null,
      "articleTitle": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": "0",
      "pageNumber": 0,
      "pageSize": this.showentries,
      "totalPageCount": 0,
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [

      ],
      "requestTypes": [
      ],
      "deliveryLocations": [

      ],
      "searchResultRows": [

      ],
      "requestStatuses": [

      ],
      "institutionList": this.searchReqVal['institutionList'],
      "disableRequestingInstitution": false,
      "onChange": false,
      "institution": null,
      "showRequestErrorMsg": null,
      "requestingInstituionHidden": this.resubmitReqConfirmItemBarcode,
      "itemBarcodeHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null
    }


    this.requestService.resubmitRequest(this.postData).subscribe(
      (res) => {
        this.resubmitRequestConfirmBodyId = false;
        this.resubmitResponse = res;
        this.resubmitResponseMessage = this.resubmitResponse['Message'];
        this.status = this.resubmitResponse['Status'];
        this.spinner.hide();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }


  cancelRequestItem() {
    this.spinner.show();
    this.postData = {
      "requestId": this.requestId,
      "patronBarcode": null,
      "itemBarcode": null,
      "status": null,
      "deliveryLocation": null,
      "patronBarcodeInRequest": null,
      "itemBarcodeInRequest": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": null,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "startPage": null,
      "endPage": null,
      "volumeNumber": null,
      "issue": null,
      "articleAuthor": null,
      "articleTitle": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": "0",
      "pageNumber": 0,
      "pageSize": this.showentries,
      "totalPageCount": 0,
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [

      ],
      "requestTypes": [
      ],
      "deliveryLocations": [

      ],
      "searchResultRows": [

      ],
      "requestStatuses": [

      ],
      "institutionList": this.searchReqVal['institutionList'],
      "disableRequestingInstitution": false,
      "onChange": false,
      "institution": null,
      "showRequestErrorMsg": null,
      "requestingInstituionHidden": null,
      "itemBarcodeHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": null
    }


    this.requestService.cancelRequest(this.postData).subscribe(
      (res) => {
        var msg = res['Message'];
        this.reqcancelmsg = msg;
        $("#cancelBtn").trigger("click");
        $('#cancelRequestModal').modal({ show: true });
        this.searchRequests();
        this.spinner.hide();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });

  }
  firstCall() {
    this.spinner.show();
    this.showentries = this.searchreqResultVal['pageSize'];
    this.postData = {
      "requestId": null,
      "patronBarcode": this.searchPatronBarcode,
      "itemBarcode": this.searchItemBarcode,
      "status": this.requestStatus,
      "deliveryLocation": null,
      "patronBarcodeInRequest": null,
      "itemBarcodeInRequest": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocationSearch,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "startPage": null,
      "endPage": null,
      "volumeNumber": null,
      "issue": null,
      "articleAuthor": null,
      "articleTitle": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": "0",
      "pageNumber": this.searchreqResultVal['pageNumber'],
      "pageSize": this.showentries,
      "totalPageCount": 0,
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [

      ],
      "requestTypes": [
      ],
      "deliveryLocations": [

      ],
      "searchResultRows": [

      ],
      "requestStatuses": [

      ],
      "institutionList": this.searchReqVal['institutionList'],
      "disableRequestingInstitution": false,
      "onChange": false,
      "institution": this.searchInstitutionList,
      "showRequestErrorMsg": null,
      "requestingInstituionHidden": this.searchInstitutionList,
      "itemBarcodeHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": this.searchReqVal['institution']
    }
    this.requestService.firstCall(this.postData).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchreqResultVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });

  }
  previousCall() {
    this.spinner.show();
    this.showentries = this.searchreqResultVal['pageSize'];
    this.postData = {
      "requestId": null,
      "patronBarcode": this.searchPatronBarcode,
      "itemBarcode": this.searchItemBarcode,
      "status": this.requestStatus,
      "deliveryLocation": null,
      "patronBarcodeInRequest": null,
      "itemBarcodeInRequest": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocationSearch,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "startPage": null,
      "endPage": null,
      "volumeNumber": null,
      "issue": null,
      "articleAuthor": null,
      "articleTitle": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": "0",
      "pageNumber": this.searchreqResultVal['pageNumber'],
      "pageSize": this.showentries,
      "totalPageCount": 0,
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [

      ],
      "requestTypes": [
      ],
      "deliveryLocations": [

      ],
      "searchResultRows": [

      ],
      "requestStatuses": [

      ],
      "institutionList": this.searchReqVal['institutionList'],
      "disableRequestingInstitution": false,
      "onChange": false,
      "institution": this.searchInstitutionList,
      "showRequestErrorMsg": null,
      "requestingInstituionHidden": this.searchInstitutionList,
      "itemBarcodeHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": this.searchReqVal['institution']
    }
    this.requestService.previousCall(this.postData).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchreqResultVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  nextCall() {
    this.spinner.show();
    this.showentries = this.searchreqResultVal['pageSize'];
    this.postData = {
      "requestId": null,
      "patronBarcode": this.searchPatronBarcode,
      "itemBarcode": this.searchItemBarcode,
      "status": this.requestStatus,
      "deliveryLocation": null,
      "patronBarcodeInRequest": null,
      "itemBarcodeInRequest": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocationSearch,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "startPage": null,
      "endPage": null,
      "volumeNumber": null,
      "issue": null,
      "articleAuthor": null,
      "articleTitle": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": "0",
      "pageNumber": this.searchreqResultVal['pageNumber'],
      "pageSize": this.showentries,
      "totalPageCount": 0,
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [

      ],
      "requestTypes": [
      ],
      "deliveryLocations": [

      ],
      "searchResultRows": [

      ],
      "requestStatuses": [

      ],
      "institutionList": this.searchReqVal['institutionList'],
      "disableRequestingInstitution": false,
      "onChange": false,
      "institution": this.searchInstitutionList,
      "showRequestErrorMsg": null,
      "requestingInstituionHidden": this.searchInstitutionList,
      "itemBarcodeHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": this.searchReqVal['institution']
    }
    this.requestService.nextCall(this.postData).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchreqResultVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  lastCall() {
    this.spinner.show();
    this.showentries = this.searchreqResultVal['pageSize'];
    this.postData = {
      "requestId": null,
      "patronBarcode": this.searchPatronBarcode,
      "itemBarcode": this.searchItemBarcode,
      "status": this.requestStatus,
      "deliveryLocation": null,
      "patronBarcodeInRequest": null,
      "itemBarcodeInRequest": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocationSearch,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "startPage": null,
      "endPage": null,
      "volumeNumber": null,
      "issue": null,
      "articleAuthor": null,
      "articleTitle": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": "0",
      "pageNumber": this.searchreqResultVal['pageNumber'],
      "pageSize": this.showentries,
      "totalPageCount": this.searchreqResultVal['totalPageCount'],
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [

      ],
      "requestTypes": [
      ],
      "deliveryLocations": [

      ],
      "searchResultRows": [

      ],
      "requestStatuses": [

      ],
      "institutionList": this.searchReqVal['institutionList'],
      "disableRequestingInstitution": false,
      "onChange": false,
      "institution": this.searchInstitutionList,
      "showRequestErrorMsg": null,
      "requestingInstituionHidden": this.searchInstitutionList,
      "itemBarcodeHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": this.searchReqVal['institution']
    }
    this.requestService.lastCall(this.postData).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchreqResultVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  onPageSizeChange(value) {
    this.spinner.show();
    this.showentries = value;
    this.postData = {
      "requestId": null,
      "patronBarcode": this.searchPatronBarcode,
      "itemBarcode": this.searchItemBarcode,
      "status": this.requestStatus,
      "deliveryLocation": null,
      "patronBarcodeInRequest": null,
      "itemBarcodeInRequest": null,
      "deliveryLocationInRequest": null,
      "itemTitle": null,
      "itemOwningInstitution": null,
      "storageLocation": this.storageLocationSearch,
      "patronEmailAddress": null,
      "requestingInstitution": null,
      "requestType": null,
      "requestNotes": null,
      "startPage": null,
      "endPage": null,
      "volumeNumber": null,
      "issue": null,
      "articleAuthor": null,
      "articleTitle": null,
      "message": null,
      "errorMessage": null,
      "totalRecordsCount": this.searchreqResultVal['totalRecordsCount'],
      "pageNumber": this.searchreqResultVal['pageNumber'],
      "pageSize": this.showentries,
      "totalPageCount": 0,
      "submitted": false,
      "showResults": false,
      "requestingInstitutions": [

      ],
      "requestTypes": [
      ],
      "deliveryLocations": [

      ],
      "searchResultRows": [

      ],
      "requestStatuses": [

      ],
      "institutionList": this.searchReqVal['institutionList'],
      "disableRequestingInstitution": false,
      "onChange": false,
      "institution": this.searchInstitutionList,
      "showRequestErrorMsg": null,
      "requestingInstituionHidden": this.searchInstitutionList,
      "itemBarcodeHidden": null,
      "disableSearchInstitution": false,
      "searchInstitutionHdn": this.searchReqVal['institution']
    }
    this.requestService.onRequestPageSizeChange(this.postData).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchreqResultVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  pagination() {
    if (this.searchreqResultVal['pageNumber'] == 0 && (this.searchreqResultVal['totalPageCount'] - 1 > 0)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = false;
      this.lastbutton = false;
    } else if (this.searchreqResultVal['pageNumber'] == 0 && (this.searchreqResultVal['pageNumber'] == this.searchreqResultVal['totalPageCount'] - 1)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = true;
      this.lastbutton = true;
    }
    else if ((this.searchreqResultVal['pageNumber'] == this.searchreqResultVal['totalPageCount'] - 1) && this.searchreqResultVal['totalPageCount'] - 1 > 0) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = true;
      this.lastbutton = true;
    } else if ((this.searchreqResultVal['pageNumber'] < this.searchreqResultVal['totalPageCount'] - 1) && (this.searchreqResultVal['pageNumber'] != 0)) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = false;
      this.lastbutton = false;
    }
  }
  timezone(date) {
    return this.dashBoardService.setTimeZone(date);
  }
  ngOnDestroy(): void {
    this.searchreqResultVal = null;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
