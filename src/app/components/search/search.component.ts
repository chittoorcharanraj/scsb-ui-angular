import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { ReportsService } from '@service/reports/reports.service';
import { RolesPermissionsService } from '@service/rolesPermissions/roles-permissions.service';
import { SearchService } from '@service/search/search.service';
import { OpenMarcService } from '@service/openMarc/open-marc.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService, TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { environment } from 'src/environments/environment';
declare var $: any;

enum CONSTANTS {
  ENTER = 'Enter'
}

@Component({
  standalone: false,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [MessageService],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class SearchComponent implements OnInit {
  constructor(private rolesService: RolesPermissionsService, private reportsService: ReportsService, private searchService: SearchService,
    private messageService: MessageService, private formBuilder: UntypedFormBuilder, private router: Router,
    private spinner: NgxSpinnerService, private dashBoardService: DashBoardService, private openMarcService: OpenMarcService) {     }
  @ViewChild('dt') dt: Table;
  @ViewChild('dt1') dt1: Table;
  public data: Object[];
  public environment = environment;
  facetsChecked = true;
  clearSearchTextCross = false;
  fieldValuseStatus = false;
  toggleCheck = true;
  count: number;
  institutionsCount: number;
  storageLocationsCount: number;
  cgdCount: number;
  countST: number;
  countCGD : number;
  instList: any[];
  owningInstitutionInst: any[];
  storageLocationsList: any[];
  cgdTypeList: any[];
  instVal: string[];
  storageLocationVal: string[];
  cgdVal: string[];
  storageLocations: any = [];
  cgdCodes: any[];
  fieldValue: string;
  searchVal: TreeNode[];
  selectedNodes1: any[];
  selectedNodes2: any[];
  cols: any[];
  cols1: any[];
  exportColumns: any[];
  showresultdiv = false;
  clicked = true;
  checked = true;
  firstbutton = true;
  previousbutton = true;
  nextbutton = false;
  lastbutton = false;
  showentries = 10;
  pageNumber = 0;
  rolesRes: Object;
  totalPageCount: number = 0;
  owningInstitutions: any = [];
  collectionGroupDesignations: any = [];
  availability: any = [];
  materialTypes: any = [];
  titleMatch: any = []; 
  useRestrictions: any = [];
  searchForm: UntypedFormGroup;
  errorMessage_Div = false;
  searchResultsDiv = false;
  paginationBtmDiv = false;
  showMarcModal = false;
  marcModalErrorDiv = false;
  selectedMarcRecord: any = {};
  selectedRowData: any = {};
  postData = {
    "fieldValue": "",
    "fieldName": "",
    "owningInstitutions": [
      "CUL",
      "PUL",
      "NYPL"
    ],
    "collectionGroupDesignations": [
      "Shared",
      "Private",
      "Open",
      "Committed",
      "Uncommittable"
    ],
    "availability": [
      "Available",
      "NotAvailable"
    ],
    "materialTypes": [
      "Serial",
      "Monograph",
      "Other"
    ],
    "titleMatch":[
      "Matched",
      "Not Matched"
    ],
    "useRestrictions": [
      "NoRestrictions",
      "InLibraryUse",
      "SupervisedUse"
    ],
    "imsDepositoryCodes": [],
    "searchResultRows": [],
    "catalogingStatus": "Complete",
    "pageNumber": 0,
    "pageSize": 10,
    "isDeleted": false,
    "totalPageCount": 0,
    "totalBibRecordsCount": "0",
    "totalItemRecordsCount": "0",
    "totalRecordsCount": "0",
    "showResults": false,
    "selectAll": false,
    "selectAllFacets": true,
    "showTotalCount": false,
    "index": null,
    "errorMessage": null
  }
  searchfieldval = [
    { id: 'Author_search', name: "Author" },
    { id: 'Title_search', name: "Title" },
    { id: 'TitleStartsWith', name: "Title Browse" },
    { id: 'Publisher', name: "Publisher" },
    { id: 'PublicationPlace', name: "Publication Place" },
    { id: 'PublicationDate', name: "Publication Date" },
    { id: 'Subject', name: "Subject" },
    { id: 'ISBN', name: "ISBN" },
    { id: 'ISSN', name: "ISSN" },
    { id: 'OCLCNumber', name: "OCLC Number" },
    { id: 'Notes', name: "Notes" },
    { id: 'CustomerCode', name: "Customer Code" },
    { id: 'CallNumber_search', name: "Call Number" },
    { id: 'Barcode', name: "Barcode" }
  ];
  validateCols = [
    { field: 'title', header: 'Title' },
    { field: 'author', header: 'Author' },
    { field: 'publisher', header: 'Publisher' },
    { field: 'publisherDate', header: 'Publisher Date' },
    { field: 'owningInstitution', header: 'OI' },
    { field: 'imsLocation', header: 'SL' },
    { field: 'customerCode', header: 'CC' },
    { field: 'collectionGroupDesignation', header: 'CGD' },
    { field: 'useRestriction', header: 'Use Restriction' },
    { field: 'barcode', header: 'Barcode' },
    { field: 'summaryHoldings', header: 'SH' },
    { field: 'matchingIdentifier', header: 'Matching Identifier' },
  ];
  validateCols1 = [
    { field: 'callNumber', header: 'Call Number' },
    { field: 'chronologyAndEnum', header: 'Chronology & Enum' },
    { field: 'imsLocation', header: 'SL' },
    { field: 'customerCode', header: 'CC' },
    { field: 'collectionGroupDesignation', header: 'CGD' },
    { field: 'useRestriction', header: 'Use Restriction' },
    { field: 'barcode', header: 'Barcode' },
  ];
  itemListTransaction: any = [];
  csvOptionsSearchReport = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Search Export Report',
    useBom: true,
    noDownload: false,
    headers: []
  };
  ngOnInit(): void {
    const searchInput = document.getElementById("fieldValue");
    if (searchInput) {
      searchInput.focus();
    }
    if (typeof $ !== 'undefined') {
      $("#clearSearchText").hide();
    }
    this.dashBoardService.setApiPath('search');
    this.rolesRes = this.rolesService.getRes();
    if (this.rolesRes['isBarcodeRestricted'] == true) {
      this.validateColumns();
    }
    this.resetDynamicFields();
    this.selectedNodes1 = [];
    this.selectedNodes2 = [];
    this.searchForm = this.formBuilder.group({
      fieldValue: [''],
      fieldName: [''],
      owningInstitutionNYPL: [true],
      owningInstitutionCUL: [true],
      owningInstitutionPUL: [true],
      Monograph: [true],
      Serial: [true],
      others: [true],
      matched: [true],
      notMatched: [true],
      Available: [true],
      notAvailable: [true],
      NoRestrictions: [true],
      InLibraryUse: [true],
      SupervisedUse: [true]
    });
  }
  getSelectedFiltersCount(): number {
    let count = 0;
    if (this.owningInstitutionInst) {
      count += this.owningInstitutionInst.length;
    }
    if (this.cgdTypeList) {
      count += this.cgdTypeList.length;
    }
    if (this.storageLocationsList) {
      count += this.storageLocationsList.length;
    }
    const filterKeys = [
      'Monograph', 'Serial', 'others',
      'matched', 'notMatched',
      'Available', 'notAvailable',
      'NoRestrictions', 'InLibraryUse', 'SupervisedUse'
    ];
    if (this.searchForm) {
      for (const key of filterKeys) {
        if (this.searchForm.get(key)?.value === true) {
          count++;
        }
      }
    }
    return count;
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(CONSTANTS.ENTER == event.key)
    this.searchRecord();
  }
  checkedItem(item) {
    if (this.owningInstitutionInst) {
      if (this.owningInstitutionInst.indexOf(item) != -1) {
        return true;
      }
    }
  }
  checkedItemCGD(item){
    if (this.cgdTypeList) {
      if (this.cgdTypeList.indexOf(item) != -1) {
        return true;
      }
    }
  }
  onChangeCGD(test,item){
    if (test) {
      this.cgdTypeList.push(item);
    } else {
      this.cgdTypeList.splice(this.cgdTypeList.indexOf(item), 1);
    }
  }
  onChange(test, item) {
    if (test) {
      this.owningInstitutionInst.push(item);
    } else {
      this.owningInstitutionInst.splice(this.owningInstitutionInst.indexOf(item), 1);
    }
  }
  checkedItemStorageLocation(item) {
    if (this.storageLocationsList) {
      if (this.storageLocationsList.indexOf(item) != -1) {
        return true;
      }
    }
  }
  onChangeStorageLocation(test, item) {
    if (test) {
      this.storageLocationsList.push(item);
    } else {
      this.storageLocationsList.splice(this.storageLocationsList.indexOf(item), 1);
    }
  }
  onPageSizeChange(value) {
    this.spinner.show();
    this.showentries = value;
    this.owningInstitutions = [];
    this.collectionGroupDesignations = [];
    this.availability = [];
    this.materialTypes = [];
    this.titleMatch = [];
    this.useRestrictions = [];
    var searchfullrec = this.searchForm.value;
    this.validateInputs(searchfullrec);
    this.searchService.onPageSizeChange(this.setPostData(searchfullrec, 'pageSize')).subscribe((res) => {
      this.searchVal = res;
      this.searchVal['searchResultRows'].forEach((items, i) => {
        items.id = i + 1;
      });
      this.spinner.hide();
      this.showresultdiv = true;
      this.mappingResults();
      this.pagination();
    },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  searchRecord() {
    this.clicked = true;
    this.selectedNodes1 = [];
    this.selectedNodes2 = [];
    this.spinner.show();
    this.toggleSlide('search-filter', 'up');
    this.showentries = 10;
    this.owningInstitutions = [];
    this.collectionGroupDesignations = [];
    this.availability = [];
    this.materialTypes = [];
    this.titleMatch = [];
    this.useRestrictions = [];
    var searchfullrec = this.searchForm.value;
    this.validateInputs(searchfullrec);
    this.searchService.getSearch(this.setPostData(searchfullrec, 'search')).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchVal = res;
        if (this.searchVal['errorMessage'] != null) {
          this.showresultdiv = true;
          this.errorMessage_Div = true;
          this.searchResultsDiv = false;
          this.paginationBtmDiv = false;
          this.searchVal['pageNumber'] = 0;
        } else {
          this.searchVal['searchResultRows'].forEach((items, i) => {
            items.id = i + 1;
          });
          this.showresultdiv = true;
          this.errorMessage_Div = false;
          this.searchResultsDiv = true;
          this.paginationBtmDiv = true;
          this.mappingResults();
          this.searchVal['pageNumber'] = 0;
          this.pagination();
        }
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }

  nextClick() {
    this.spinner.show();
    this.owningInstitutions = [];
    this.collectionGroupDesignations = [];
    this.availability = [];
    this.materialTypes = [];
    this.titleMatch = [];
    this.useRestrictions = [];
    var searchfullrec = this.searchForm.value;
    this.validateInputs(searchfullrec);
    this.showresultdiv = true;
    this.searchService.searchNext(this.setPostData(searchfullrec, 'nextCall')).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchVal = res;
        this.searchVal['searchResultRows'].forEach((items, i) => {
          items.id = i + 1;
        });
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
    this.mappingResults();
  }
  previousClick() {
    this.spinner.show();
    this.owningInstitutions = [];
    this.collectionGroupDesignations = [];
    this.availability = [];
    this.materialTypes = [];
    this.titleMatch = [];
    this.useRestrictions = [];
    var searchfullrec = this.searchForm.value;
    this.validateInputs(searchfullrec);
    this.showresultdiv = true;
    this.searchService.searchPrevious(this.setPostData(searchfullrec, 'previousCall')).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchVal = res
        this.searchVal['searchResultRows'].forEach((items, i) => {
          items.id = i + 1;
        });
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
    this.mappingResults();
  }
  firstClick() {
    this.spinner.show();
    this.owningInstitutions = [];
    this.collectionGroupDesignations = [];
    this.availability = [];
    this.materialTypes = [];
    this.titleMatch = [];
    this.useRestrictions = [];

    var searchfullrec = this.searchForm.value;
    this.validateInputs(searchfullrec);
    this.searchService.searchFirst(this.setPostData(searchfullrec, 'firstCall')).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchVal = res;
        this.searchVal['searchResultRows'].forEach((items, i) => {
          items.id = i + 1;
        });
        this.searchVal['pageNumber'] = 0;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
    this.mappingResults();
  }

  lastClick() {
    this.spinner.show();
    this.owningInstitutions = [];
    this.collectionGroupDesignations = [];
    this.availability = [];
    this.materialTypes = [];
    this.titleMatch = [];
    this.useRestrictions = [];
    var searchfullrec = this.searchForm.value;
    this.validateInputs(searchfullrec);
    this.showresultdiv = true;
    this.searchService.searchLast(this.setPostData(searchfullrec, 'lastCall')).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchVal = res;
        if (this.searchVal['errorMessage'] != null) {
          this.showresultdiv = true;
          this.errorMessage_Div = true;
          this.searchResultsDiv = false;
          this.paginationBtmDiv = false;
          this.searchVal['pageNumber'] = 0;
        } else {
          this.searchVal['searchResultRows'].forEach((items, i) => {
            items.id = i + 1;
          });
          this.pagination();
        }
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
    this.mappingResults();
  }

  onRowSelect(event) {
    this.clicked = false;
    this.messageService.add({ severity: 'info', summary: 'Car Selected', detail: 'title: ' + event.data.title });
  }

  onRowUnselect(event) {
    if (this.selectedNodes1.length == 0 && this.selectedNodes2.length == 0) {
      this.clicked = true;
      this.messageService.add({ severity: 'info', summary: 'Car Selected', detail: 'title: ' + event.data.title });
    }
  }
  checkUncheckAll() {
    var searchallvalue = this.searchForm.value;
    if (this.checked === true) {
      this.owningInstitutionInst = [];
      this.storageLocationsList = [];
      this.cgdTypeList = [];
      this.checked = false;
      this.searchForm = this.formBuilder.group({
        fieldValue: [searchallvalue.fieldValue],
        fieldName: [searchallvalue.fieldName],
        Monograph: [false],
        Serial: [false],
        others: [false],
        matched: [false],
        notMatched: [false],
        Available: [false],
        notAvailable: [false],
        NoRestrictions: [false],
        InLibraryUse: [false],
        SupervisedUse: [false]
      });
      this.searchForm.markAsDirty();
    } else {
      this.checked = true;
      this.reportsService.getInstitutions().subscribe(
        (res) => {
          this.owningInstitutionInst = res['institutionList'];
          this.storageLocationsList = res['storageLocationsList'];
          this.cgdTypeList = res['cgdCodesList'];
        });
      this.searchForm = this.formBuilder.group({
        fieldValue: [searchallvalue.fieldValue],
        fieldName: [searchallvalue.fieldName],
        Monograph: [true],
        Serial: [true],
        others: [true],
        matched: [true],
        notMatched: [true],
        Available: [true],
        notAvailable: [true],
        NoRestrictions: [true],
        InLibraryUse: [true],
        SupervisedUse: [true]
      });

    }
  }
  resetDynamicFields(){
    this.reportsService.getInstitutions().subscribe(
      (res) => {
        this.owningInstitutionInst = res['institutionList'];
        this.storageLocationsList = res['storageLocationsList'];
        this.cgdTypeList = res['cgdCodesList'];
      });
  }
  onReset() {
    this.showresultdiv = false;
    this.checked = true;
    $("#clearSearchText").hide();
    this.clearSearchTextCross = false;
    this.resetDynamicFields();
    this.searchForm = this.formBuilder.group({
      fieldValue: [''],
      fieldName: [''],
      Monograph: [true],
      Serial: [true],
      others: [true],
      matched: [true],
      notMatched: [true],
      Available: [true],
      notAvailable: [true],
      NoRestrictions: [true],
      InLibraryUse: [true],
      SupervisedUse: [true]
    });
  }
  searchExport() {
    this.dt.exportFilename = 'ExportRecords' + '_' +
      new DatePipe('en-US').transform(Date.now(), 'yyyyMMddhhmmss', 'UTC');
      new AngularCsv(this.dataSetforExport(), this.dt.exportFilename, this.csvOptionsSearchReport);
  }
  
  dataSetforExport(){
    this.itemListTransaction = [];
    if(this.dt.selection.length > 0){
      this.setHeadersForTable(this.itemListTransaction);
    for (var i = 0; i < this.dt.selection.length; i++) {
      var item = {};
      item['title'] = (this.dt.selection[i].title) ? this.dt.selection[i].title : "";
      item['author'] = (this.dt.selection[i].author) ? this.dt.selection[i].author : "";
      item['publisher'] = (this.dt.selection[i].publisher) ? this.dt.selection[i].publisher: "";
      item['publisherDate'] = (this.dt.selection[i].publisherDate) ? this.dt.selection[i].publisherDate : "";
      item['owningInstitution'] = (this.dt.selection[i].owningInstitution) ? this.dt.selection[i].owningInstitution: "";
      item['imsLocation'] = (this.dt.selection[i].imsLocation) ? this.dt.selection[i].imsLocation : "";
      item['customerCode'] = (this.dt.selection[i].customerCode) ? this.dt.selection[i].customerCode : "";
      item['collectionGroupDesignation'] = (this.dt.selection[i].collectionGroupDesignation) ? this.dt.selection[i].collectionGroupDesignation : "";
      item['useRestriction'] = (this.dt.selection[i].useRestriction) ? this.dt.selection[i].useRestriction : "";
      item['barcode'] = (this.dt.selection[i].barcode) ? this.dt.selection[i].barcode : "";
      item['summaryHoldings'] = (this.dt.selection[i].summaryHoldings) ? this.dt.selection[i].summaryHoldings : "";
      item['matchingIdentifier'] = (this.dt.selection[i].matchingIdentifier) ? this.dt.selection[i].matchingIdentifier : "";
      this.itemListTransaction.push(item);
    }
  }
    if (this.dt1 != undefined) {
      if ((this.dt1.selection != undefined || this.dt1.selection == '' || this.dt1.selection == null) && this.dt1.selection.length > 0) {
        this.setInnerTableHeaders(this.itemListTransaction);
      }
    }
    return this.itemListTransaction;
  }
  setHeadersForTable(items){
    var item_newLine = {};
    items.push(item_newLine);
    var item = {};
    item['title'] = "Title";
    item['author'] = "Author";
    item['publisher'] = "Publisher";
    item['publisherDate'] = "Publisher Date";
    item['owningInstitution'] = "OI";
    item['imsLocation'] = "SL";
    item['customerCode'] =  "CC";
    item['collectionGroupDesignation'] = "CGD";
    item['useRestriction'] = "Use Restriction";
    item['barcode'] = "Barcode";
    item['summaryHoldings'] = "SH";
    item['matchingIdentifier'] = "Matching Identifier";
    items.push(item);
  }
  setInnerTableHeaders(items): void{
    var item_newLine = {};
    items.push(item_newLine);
    var item = {}
    item['publisher'] = "Call Number";
    item['publisherDate'] = "Chronology & Enum";
    item['owningInstitution'] = "SL";
    item['imsLocation'] = "CC";
    item['customerCode'] = "CGD";
    item['collectionGroupDesignation'] = "Use Restriction";
    item['useRestriction'] = "Barcode";
    items.push(item);
    this.setDataForInnerTable(items);
  }
  setDataForInnerTable(items){
    for (let i = 0; i < this.dt1.selection.length; i++) {
      var item = {}
    item['publisher'] = this.dt1.selection[i].callNumber;
    item['publisherDate'] = this.dt1.selection[i].chronologyAndEnum;
    item['owningInstitution'] = this.dt1.selection[i].imsLocation;
    item['cc'] = this.dt1.selection[i].customerCode;
    item['imsLocation'] = this.dt1.selection[i].collectionGroupDesignation;
    item['customerCode'] = this.dt1.selection[i].useRestriction;
    item['useRestriction'] = this.dt1.selection[i].barcode;
    items.push(item);
    }
    console.log(this.dt1.selection);
  }
  routeToRequest() {
    var barcode1 = [];
    var i;
    if (this.selectedNodes1 != undefined) {
      for (i = 0; i < this.selectedNodes1.length; i++) {
        barcode1.push(this.selectedNodes1[i].barcode);
      }
    }
    if (this.selectedNodes2 != undefined) {
      for (i = 0; i < this.selectedNodes2.length; i++) {
        barcode1.push(this.selectedNodes2[i].barcode);
      }
    }
    var barcode = barcode1.join();
    this.router.navigate(['/request', barcode]);
  }

  toggleSlide(elementId: string, action: 'toggle' | 'up' | 'down' = 'toggle') {
    if (typeof $ !== 'undefined' && typeof $(`#${elementId}`).slideToggle === 'function') {
      if (action === 'toggle') {
        $(`#${elementId}`).slideToggle();
        return;
      } else if (action === 'up') {
        $(`#${elementId}`).slideUp();
        return;
      } else if (action === 'down') {
        $(`#${elementId}`).slideDown();
        return;
      }
    }
    const el = document.getElementById(elementId);
    if (el) {
      if (action === 'up') {
        el.style.display = 'none';
      } else if (action === 'down') {
        el.style.display = 'block';
      } else {
        const isHidden = el.style.display === 'none' || getComputedStyle(el).display === 'none';
        el.style.display = isHidden ? 'block' : 'none';
      }
    }
  }

  facetsshowhide() {
    this.toggleSlide('search-filter', 'toggle');
    if (this.toggleCheck) {
      this.toggleCheck = !this.toggleCheck;
      this.reportsService.getInstitutions().subscribe(
        (res) => {
          this.storageLocationVal = res['storageLocationsList'];
          this.instVal = res['institutionList'];
          this.cgdVal = res['cgdCodesList'];
          this.count = this.instVal.length;
          this.countST = this.storageLocationVal.length;
          this.countCGD = this.cgdVal.length;
          this.institutionsCount = this.count;
          this.storageLocationsCount = this.countST;
          this.cgdCount = this.countCGD;
          this.reportsService.getInstitutions().subscribe(
            (res) => {
              this.owningInstitutionInst = res['institutionList'];
              this.storageLocationsList = res['storageLocationsList'];
              this.cgdTypeList = res['cgdCodesList'];
            },
            (error) => {
              this.dashBoardService.errorNavigation();
            });
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
    }
  }

  validateInputs(searchfullrec) {
    this.owningInstitutions = this.owningInstitutionInst;
    this.storageLocations = this.storageLocationsList;
    this.cgdCodes = this.cgdTypeList;
    
    if (searchfullrec.Available == true) {
      this.availability.push('Available')
    }
    if (searchfullrec.notAvailable == true) {
      this.availability.push('NotAvailable')
    }

    if (searchfullrec.Monograph == true) {
      this.materialTypes.push('Monograph')
    }
    if (searchfullrec.Serial == true) {
      this.materialTypes.push('Serial')
    }
    if (searchfullrec.matched == true) {
      this.titleMatch.push('Matched')
    }
    if (searchfullrec.notMatched == true) {
      this.titleMatch.push('Not Matched')
    }
    if (searchfullrec.others == true) {
      this.materialTypes.push('Other')
    }

    if (searchfullrec.NoRestrictions == true) {
      this.useRestrictions.push('NoRestrictions')
    }

    if (searchfullrec.InLibraryUse == true) {
      this.useRestrictions.push('InLibraryUse')
    }

    if (searchfullrec.SupervisedUse == true) {
      this.useRestrictions.push('SupervisedUse')
    }
  }
  pagination() {
    if (this.searchVal['pageNumber'] == 0 && (this.searchVal['totalPageCount'] - 1 > 0)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = false;
      this.lastbutton = false;
    } else if (this.searchVal['pageNumber'] == 0 && (this.searchVal['pageNumber'] == this.searchVal['totalPageCount'] - 1)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = true;
      this.lastbutton = true;
    }
    else if ((this.searchVal['pageNumber'] == this.searchVal['totalPageCount'] - 1) && this.searchVal['totalPageCount'] - 1 > 0) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = true;
      this.lastbutton = true;
    } else if ((this.searchVal['pageNumber'] < this.searchVal['totalPageCount'] - 1) && (this.searchVal['pageNumber'] != 0)) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = false;
      this.lastbutton = false;
    } else if (this.searchVal['pageNumber'] == 0 && this.searchVal['totalPageCount'] == 0) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = true;
      this.lastbutton = true;
    }
  }
  mappingResults() {
    this.cols = this.validateCols;
    this.cols1 = this.validateCols1;
  }
  setPostData(searchfullrec, actionName) {
    if (actionName == 'search') {
      this.showentries = 10;
      this.pageNumber = 0;
    } else if (actionName == 'firstCall') {
      this.pageNumber = 0;
    } else if (actionName == 'lastCall') {
      this.pageNumber = this.searchVal['totalPageCount'] - 1;
      this.totalPageCount = this.searchVal['totalPageCount'];
    } else if (actionName == 'previousCall') {
      this.pageNumber = this.searchVal['pageNumber'] - 1;
    } else if (actionName == 'nextCall') {
      this.pageNumber = this.searchVal['pageNumber'] + 1;
    } else if (actionName == 'pageSize') {
      this.pageNumber = this.searchVal['pageNumber'];
    } else if (typeof actionName === 'number') {
      this.pageNumber = actionName;
    }
    this.postData = {
      "fieldValue": searchfullrec.fieldValue,
      "fieldName": searchfullrec.fieldName,
      "owningInstitutions": this.owningInstitutions,
      "collectionGroupDesignations": this.cgdCodes,
      "availability": this.availability,
      "materialTypes": this.materialTypes,
      "titleMatch": this.titleMatch,
      "useRestrictions": this.useRestrictions,
      "imsDepositoryCodes": this.storageLocations,
      "searchResultRows": [],
      "catalogingStatus": "Complete",
      "pageNumber": this.pageNumber,
      "pageSize": this.showentries,
      "isDeleted": false,
      "totalPageCount": this.totalPageCount,
      "totalBibRecordsCount": "0",
      "totalItemRecordsCount": "0",
      "totalRecordsCount": "0",
      "showResults": false,
      "selectAll": false,
      "selectAllFacets": true,
      "showTotalCount": false,
      "index": null,
      "errorMessage": null
    }
    return this.postData;
  }
  onPasteHandler(val){
    this.clearSearchTextCross = true;
    $("#clearSearchText").show();
    this.fieldValuseStatus = false;
    $("#resetSearch").prop('disabled', false);
  }
  clearFieldvalue() {
    if ($("#fieldValue").val().length > 0) {
      this.fieldValuseStatus = false;
      $("#clearSearchText").show();
      this.clearSearchTextCross = true;
      $("#resetSearch").prop('disabled', false);
    } else {
      $("#clearSearchText").hide();
      this.clearSearchTextCross = false;
      $("#resetSearch").prop('disabled', true);
    }
  }
  clearSearchText() {
    this.fieldValuseStatus = true;
    $("#fieldValue").val('');
    this.searchForm.value.fieldValue = '';
    $("#clearSearchText").hide();
    this.clearSearchTextCross = false;
    $("#resetSearch").prop('disabled', true);
  }
  checkFieldValue() {
    if (this.fieldValuseStatus) {
      this.searchForm.value.fieldValue = '';
    }
  }
  onTableHeaderCheckboxToggle1(event: any) {
    if (event.checked === true) {
      this.clicked = false;
    } else { this.clicked = true; }
  }
  enableResetSearch(val) {
    if (!val) {
      this.count = this.count - 1;
      this.searchForm.markAsDirty();
    } else {
      this.count = this.count + 1;
      if (this.count == this.institutionsCount) {
        this.searchForm.markAsPristine();
      }
    }
  }
  enableResetSearchStorageLocation(val) {
    if (!val) {
      this.countST = this.countST - 1;
      this.searchForm.markAsDirty();
    } else {
      this.countST = this.countST + 1;
      if (this.countST == this.storageLocationsCount) {
        this.searchForm.markAsPristine();
      }
    }
  }
  validateColumns() {
    if (this.rolesRes['isBarcodeRestricted'] == true) {
      for (let order of this.validateCols) {
        if (order.field == 'barcode') {
          this.validateCols.splice(this.validateCols.indexOf(order), 1);
          break;
        }
      }
    }
    if (this.rolesRes['isBarcodeRestricted'] == true) {
      for (let order of this.validateCols1) {
        if (order.field == 'barcode') {
          this.validateCols1.splice(this.validateCols1.indexOf(order), 1);
          break;
        }
      }
    }
  }

  toggleAllFacets(checked: boolean) {
    this.facetsChecked = checked;
    const filterKeys = [
      'Monograph', 'Serial', 'others',
      'matched', 'notMatched',
      'Available', 'notAvailable',
      'NoRestrictions', 'InLibraryUse', 'SupervisedUse'
    ];
    filterKeys.forEach(key => {
      this.searchForm.get(key)?.setValue(checked);
    });
    if (checked) {
      this.owningInstitutionInst = [...(this.instVal || [])];
      this.cgdTypeList = [...(this.cgdVal || [])];
      this.storageLocationsList = [...(this.storageLocationVal || [])];
    } else {
      this.owningInstitutionInst = [];
      this.cgdTypeList = [];
      this.storageLocationsList = [];
    }
  }

  getShowingStart(): number {
    if (!this.searchVal) return 0;
    return (this.searchVal['pageNumber'] * this.showentries) + 1;
  }

  getShowingEnd(): number {
    if (!this.searchVal) return 0;
    return Math.min(this.getShowingStart() + this.showentries - 1, parseInt(this.searchVal['totalRecordsCount']));
  }

  hasSelection(): boolean {
    return (this.selectedNodes1 && this.selectedNodes1.length > 0) || (this.selectedNodes2 && this.selectedNodes2.length > 0);
  }

  openMarcModal(rowData: any) {
    this.selectedRowData = rowData;
    this.selectedMarcRecord = {};
    this.marcModalErrorDiv = false;
    this.showMarcModal = true;
    this.spinner.show();
    this.openMarcService.openMarc(rowData['bibId']).subscribe(
      (res) => {
        this.selectedMarcRecord = res;
        this.marcModalErrorDiv = this.selectedMarcRecord['errorMessage'] != null;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.showMarcModal = false;
        this.dashBoardService.errorNavigation();
      });
  }

  closeMarcModal() {
    this.showMarcModal = false;
    this.selectedMarcRecord = {};
    this.selectedRowData = {};
  }

  getPageNumbers(): number[] {
    if (!this.searchVal || !this.searchVal['totalPageCount']) {
      return [];
    }
    const totalPages = this.searchVal['totalPageCount'];
    const current = this.searchVal['pageNumber'] || 0;
    const maxButtons = 4;
    let start = Math.max(0, current - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages - 1, start + maxButtons - 1);
    start = Math.max(0, end - maxButtons + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(pageNum: number) {
    this.spinner.show();
    this.owningInstitutions = [];
    this.collectionGroupDesignations = [];
    this.availability = [];
    this.materialTypes = [];
    this.titleMatch = [];
    this.useRestrictions = [];
    var searchfullrec = this.searchForm.value;
    this.validateInputs(searchfullrec);
    this.showresultdiv = true;
    this.searchService.onPageSizeChange(this.setPostData(searchfullrec, pageNum)).subscribe(
      (res) => {
        this.spinner.hide();
        this.searchVal = res;
        this.searchVal['searchResultRows'].forEach((items, i) => {
          items.id = i + 1;
        });
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      }
    );
    this.mappingResults();
  }
}
