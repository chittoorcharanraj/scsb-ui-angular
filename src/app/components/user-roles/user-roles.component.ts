import { Component, OnInit,HostListener } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { TreeNode } from 'primeng/api';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { UserRolesService } from '@service/userRoles/user-roles.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {
  keypressed : string= 'Enter';
  constructor(private userRolesService: UserRolesService, private spinner: NgxSpinnerService, private dashBoardService: DashBoardService) { }
  ngOnInit(): void {
    this.dashBoardService.setApiPath('userRoles');
    this.spinner.hide();
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(this.keypressed == event.key)
      this.searchUserRoles();
  }

  networkLoginIdErrMsg: boolean;
  roleId: string;
  searchNetworkId: string;
  userEmailId: string;
  UserPanel = true;
  showSearchResultsDiv = false;
  errorMessageforSearchDiv = false;
  deletedSuccessMsgDiv = false;
  errorMessageDiv = false;
  createUserDiv = false;
  createErrorMessageDiv = false;
  createEmailMessageDiv = false;
  createSuccussMessageDiv = false;
  searchRowResultsDiv = false;
  editusersDiv = false;
  deleteUserDiv = false;
  searchShowResultsDiv = false;
  searchResultsDiv = false;
  totalRecordsCountDiv = false;
  userRolePaginationDiv = false;
  userRoleFormVal: TreeNode[];
  exportUsersRes: TreeNode[];
  userRolesVal: TreeNode[];
  userRoleListVal: TreeNode[];
  userResponse: TreeNode[];
  editnetworkLoginIdErrMsgDiv: boolean;
  lastbutton = true;
  firstbutton = true;
  previousbutton = true;
  nextbutton = true;
  searchResultContainerDiv = false;
  pageNumber: number;
  institutionId: number;
  institutionIdErrMsgDiv = false;
  roleIdErrMsgDiv = false;
  editEmailId: string;
  edituserDescription = "";
  editnetworkLoginId: string;
  editinstitutionId: string;
  editroleId: number[];
  editsuccessMsgDiv = false;
  editerrormsgDiv = false;
  editinstitutionIdErrMsgDiv = false;
  editroleIdErrMsgDiv = false;
  deleteNetworkLoginId: string;
  deleteInstitutionId: string;
  deletedRoleId: string[];
  deleteUserDescription: string;
  deleteEmailId: string;
  deleteErrorMsgDiv = false;
  numOfRecordsId = 10;
  emailId: string;
  userDescription = "";
  rolesOption: number[];
  networkLoginId: string;
  selectedForCreate: number[];
  editUserId: number;
  userId: number;
  searchBarDiv = true;
  userDescriptionErrMsgDiv = false;
  edituserDescriptionErrMsgDiv = false;
  editEmailIdErrMsgDiv = false;
  emailIdErrMsgDiv = false;
  showUserSearchView = true;
  usersList: any = [];
  clickable = false;
  exportResultsDiv = false;
  csvOptionsTransaction = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Export Users',
    useBom: true,
    noDownload: false,
    headers: ["Network Login Id", "User Name", "Institution", "Associated Roles"]
  };
  postData = {
    "userId": null,
    "institutionId": null,
    "editUserId": 0,
    "roleId": null,
    "editRoleId": null,
    "pageNumber": 0,
    "pageSize": 10,
    "totalPageCount": 0,
    "editInstitutionId": null,
    "afterDelPageNumber": 0,
    "afterDelPageSize": 10,
    "afterDelTotalPageCount": 0,
    "searchNetworkId": null,
    "networkLoginId": null,
    "roleName": null,
    "totalRecordsCount": "0",
    "institutionName": null,
    "message": null,
    "errorMessage": null,
    "errorMessageForEmail": null,
    "editErromessage": null,
    "sectionName": null,
    "buttonName": null,
    "editNetworkId": null,
    "userDescriptionErrMsg": null,
    "userDescription": null,
    "editNetworkLoginId": null,
    "editUserDescription": null,
    "userEmailId": null,
    "emailId": null,
    "editEmailId": null,
    "allowCreateEdit": null,
    "isCreatedRequest": null,
    "showPagination": false,
    "showSearch": false,
    "showErrorMessage": false,
    "showCreateSuccess": false,
    "showCreateError": false,
    "showEditSuccess": false,
    "showEditError": false,
    "showCreateEmailError": false,
    "deleteSuccessMsg": false,
    "selected": null,
    "submitted": null,
    "showResults": false,
    "deletedSuccessMsg": false,
    "deleteErrorMsg": false,
    "showUserSearchView": true,
    "roles": [],
    "institutions": [],
    "showSelectedForCreate": [],
    "selectedForCreate": [],
    "editSelectedForCreate": [],
    "userRoleFormList": [],
    "showEditDeleteIcon": true,
    "createdBy": null,
    "lastUpdatedBy": null
  }
  enableCreateUser() {
    this.userRoles();
  }
  editUser(userId, networkLoginId, roleName) {
    this.editusersDiv = true;
    this.createUserDiv = false;
    this.showSearchResultsDiv = false;
    this.errorMessageDiv = false;
    this.searchResultsDiv = false;
    this.deleteUserDiv = false;
    this.showUserSearchView = false;
    this.editsuccessMsgDiv = false;
    this.editerrormsgDiv = false;
    this.userId = userId;
    this.userRolesService.editUser(userId, networkLoginId).subscribe(
      (res) => {
        this.userResponse = res;
        this.userRoleListVal = this.userResponse['roles'].map(function (x) { return { id: x[0], name: x[1] }; });
        this.editroleId = this.userResponse['editSelectedForCreate'];
        this.editEmailId = this.userResponse['editEmailId'];
        this.edituserDescription = this.userResponse['editUserDescription'];
        this.editnetworkLoginId = this.userResponse['editNetworkLoginId'];
        this.editinstitutionId = this.userResponse['editInstitutionId'];
      },
      (erro) => {
        this.dashBoardService.errorNavigation();
      });
  }
  deleteUserRole(userId, networkLoginId, roleName) {
    this.spinner.show();
    this.editusersDiv = false;
    this.createUserDiv = false;
    this.showSearchResultsDiv = false;
    this.errorMessageDiv = false;
    this.searchResultsDiv = false;
    this.deleteUserDiv = true;
    this.showUserSearchView = false;
    this.editsuccessMsgDiv = false;
    this.editerrormsgDiv = false;
    this.userId = userId;
    this.userRolesService.editUser(userId, networkLoginId).subscribe(
      (res) => {
        this.userResponse = res;
        this.userRoleListVal = this.userResponse['roles'].map(function (x) { return { id: x[0], name: x[1] }; });
        this.deleteEmailId = this.userResponse['editEmailId'];
        this.deleteUserDescription = this.userResponse['editUserDescription'];
        this.deleteNetworkLoginId = this.userResponse['editNetworkLoginId'];
        this.deleteInstitutionId = this.userResponse['editInstitutionId'];
        this.deletedRoleId = this.userResponse['editSelectedForCreate'];
        this.spinner.hide();
      });
  }
  searchUserRoles() {
    this.deletedSuccessMsgDiv = false;
    this.deleteErrorMsgDiv = false;
    this.spinner.show();
    this.userRolesService.searchRoles(this.setPostData('searchUsers')).subscribe(
      (res) => {
        this.userRoleFormVal = res;
        if (this.userRoleFormVal['message'] != null || this.userRoleFormVal['errorMessage'] != null) {
          this.searchResultsDiv = true;
          this.searchResultContainerDiv = true;
          this.errorMessageforSearchDiv = true;
          this.showSearchResultsDiv = false;
          this.searchRowResultsDiv = false;
          this.totalRecordsCountDiv = false;
          this.userRolePaginationDiv = false;
          this.clickable = true;
          this.exportResultsDiv = false;
        } else {
          this.pagination();
          this.searchResultContainerDiv = true;
          this.searchResultsDiv = true;
          this.showSearchResultsDiv = true;
          this.errorMessageDiv = false;
          this.showUserSearchView = true;
          this.errorMessageforSearchDiv = false;
          this.deletedSuccessMsgDiv = false;
          this.searchShowResultsDiv = true;
          this.searchRowResultsDiv = true;
          this.totalRecordsCountDiv = true;
          this.userRolePaginationDiv = true;
          this.clickable = false;
          this.exportResultsDiv = true;
        }
        this.spinner.hide();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  showEntriesChange(pageSize) {
    this.numOfRecordsId = pageSize;
    this.userRolesService.pageSize(this.setPostData('pageSize')).subscribe(
      (res) => {
        this.userRoleFormVal = res;
        this.pagination();
      });
  }
  validateCreateUser() {
    this.emailIdErrMsgDiv = false;
    this.userDescriptionErrMsgDiv = false;
    this.roleIdErrMsgDiv = false;
    this.institutionIdErrMsgDiv = false;
    this.networkLoginIdErrMsg = false;
    var statusCreateRole = true;
    if (this.userDescription == null || this.userDescription == '' || this.userDescription == undefined) {
      this.userDescriptionErrMsgDiv = true
      statusCreateRole = false;
    }
    if (this.institutionId == null || this.institutionId == undefined) {
      this.institutionIdErrMsgDiv = true
      statusCreateRole = false;
    }
    if (this.networkLoginId == null || this.networkLoginId == '' || this.networkLoginId == undefined) {
      this.networkLoginIdErrMsg = true
      statusCreateRole = false;
    }
    if (this.rolesOption == null || this.rolesOption == undefined) {
      this.roleIdErrMsgDiv = true
      statusCreateRole = false;
    }
    return statusCreateRole;
  }
  createUser(emailId, userDescription, institutionId, networkLoginId) {
    if (this.validateCreateUser()) {
      this.spinner.show();
      this.emailId = emailId;
      this.userDescription = userDescription;
      this.selectedForCreate = this.rolesOption;
      this.institutionId = institutionId;
      this.networkLoginId = networkLoginId;
      this.userRolesService.createUser(this.setPostData('createUser')).subscribe(
        (res) => {
          this.userRoleFormVal = res;
          this.createUserDiv = true;
          this.showSearchResultsDiv = false;
          this.errorMessageDiv = false;
          this.searchResultsDiv = false;
          this.deleteUserDiv = false;
          this.showUserSearchView = false;
          this.editsuccessMsgDiv = false;
          this.editerrormsgDiv = false;
          if (this.userRoleFormVal['message'] != null) {
            this.createSuccussMessageDiv = true;
            this.createErrorMessageDiv = false;
          } else if (this.userRoleFormVal['errorMessage'] != null) {
            this.createSuccussMessageDiv = false;
            this.createErrorMessageDiv = true;
          }
          this.emailId = '';
          this.userDescription = '';
          this.rolesOption = null;
          this.institutionId = null;
          this.networkLoginId = '';
          this.spinner.hide();
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
    }
  }
  validateEmailAddress(val) {
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;

    if (pattern.test(val)) {
      return true
    } else {
      return false;
    }
  }
  validateUpdateUser() {
    this.edituserDescriptionErrMsgDiv = false;
    this.editEmailIdErrMsgDiv = false;
    this.editroleIdErrMsgDiv = false;
    this.editnetworkLoginIdErrMsgDiv = false;
    this.editnetworkLoginIdErrMsgDiv = false;
    var statusCreateRole = true;
    if (this.edituserDescription == null || this.edituserDescription == '' || this.edituserDescription == undefined) {
      this.edituserDescriptionErrMsgDiv = true
      statusCreateRole = false;
    }
    if (this.editinstitutionId == null || this.editinstitutionId == undefined) {
      this.editinstitutionIdErrMsgDiv = true
      statusCreateRole = false;
    }
    if (this.editnetworkLoginId == null || this.editnetworkLoginId == '' || this.editnetworkLoginId == undefined) {
      this.editnetworkLoginIdErrMsgDiv = true;
      statusCreateRole = false;
    }
    if (this.editroleId == null || this.editroleId == undefined || this.editroleId.length <= 0) {
      this.editroleIdErrMsgDiv = true;
      statusCreateRole = false;
    }
    return statusCreateRole;
  }
  saveEditUser(networkLoginId, userDescription, institutionId, userEmailId) {
    if (this.validateUpdateUser()) {
      this.spinner.show();
      this.userRolesService.saveEditUser(this.userId, this.editroleId, networkLoginId, userDescription, institutionId, userEmailId).subscribe(
        (res) => {
          this.spinner.hide();
          this.userRoleFormVal = res;
          this.editusersDiv = true;
          this.createUserDiv = false;
          this.showSearchResultsDiv = false;
          this.errorMessageDiv = false;
          this.searchResultsDiv = false;
          this.deleteUserDiv = false;
          this.showUserSearchView = false;
          this.editsuccessMsgDiv = false;
          this.editerrormsgDiv = false;
          if (this.userRoleFormVal['message'] != null) {
            this.editsuccessMsgDiv = true;
            this.editerrormsgDiv = false;
          } else if (this.userRoleFormVal['errorMessage'] != null) {
            this.editsuccessMsgDiv = false;
            this.editerrormsgDiv = true;
          }
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
    }
  }
  deleteUser(networkLoginId) {
    this.spinner.show();
    this.userRolesService.delete(this.userId, networkLoginId, this.userRoleFormVal['pageNumber'], this.userRoleFormVal['totalPageCount'], this.userRoleFormVal['pageSize']).subscribe(
      (res) => {
        this.userRoleFormVal = res;
        if (this.userRoleFormVal['message'] != null) {
          this.deletedSuccessMsgDiv = true;
          this.deleteUserDiv = false;
          this.deleteErrorMsgDiv = false;
          this.searchBarDiv = true;
          this.searchResultContainerDiv = true;
          this.searchResultsDiv = true;
          this.showSearchResultsDiv = true;
          this.searchShowResultsDiv = true;
          this.showUserSearchView = true;
          this.errorMessageDiv = false;
          this.errorMessageforSearchDiv = false;
          this.searchNetworkId = "";
        } else if (this.userRoleFormVal['errorMessage'] != null) {
          this.deletedSuccessMsgDiv = false;
          this.deleteErrorMsgDiv = true;
        }
        this.spinner.hide();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  userRoles() {
    this.userRolesService.userRoles().subscribe(
      (res) => {
        this.userRolesVal = res;
        this.userRoleListVal = this.userRolesVal['roles'].map(function (x) { return { id: x[0], name: x[1] }; });
        this.institutionId = null;
        this.editinstitutionId = null;
        this.editsuccessMsgDiv = false;
        this.createSuccussMessageDiv = false;
        this.createUserDiv = true;
        this.errorMessageDiv = false;
        this.showUserSearchView = false;
        this.deleteUserDiv = false;
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  lastCall() {
    this.userRolesService.lastCall(this.setPostData('lastCall')).subscribe(
      (res) => {
        this.userRoleFormVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  previousCall() {
    this.userRolesService.previousCall(this.setPostData('previousCall')).subscribe(
      (res) => {
        this.userRoleFormVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  nextCall() {
    this.userRolesService.nextCall(this.setPostData('nextCall')).subscribe(
      (res) => {
        this.userRoleFormVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  firstCall() {
    this.userRolesService.firstCall(this.setPostData('firstCall')).subscribe(
      (res) => {
        this.userRoleFormVal = res;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  toggleUserInstitutionValidation() {
    if (this.institutionId == null || this.institutionId == undefined) {
      this.institutionIdErrMsgDiv = true;
    }
  }
  pagination() {
    if (this.userRoleFormVal['pageNumber'] == 0 && (this.userRoleFormVal['totalPageCount'] - 1 > 0)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = false;
      this.lastbutton = false;
    } else if (this.userRoleFormVal['pageNumber'] == 0 && (this.userRoleFormVal['pageNumber'] == this.userRoleFormVal['totalPageCount'] - 1)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = true;
      this.lastbutton = true;
    }
    else if ((this.userRoleFormVal['pageNumber'] == this.userRoleFormVal['totalPageCount'] - 1) && this.userRoleFormVal['totalPageCount'] - 1 > 0) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = true;
      this.lastbutton = true;
    } else if ((this.userRoleFormVal['pageNumber'] < this.userRoleFormVal['totalPageCount'] - 1) && (this.userRoleFormVal['pageNumber'] != 0)) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = false;
      this.lastbutton = false;
    } else if (this.userRoleFormVal['pageNumber'] == 0 && this.userRoleFormVal['totalPageCount'] == 0) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = true;
      this.lastbutton = true;
    }
  }
  setPostData(actionName) {
    if (actionName == 'createUser') {
      this.resetFields();
    } else if (actionName == 'searchUsers') {
      this.numOfRecordsId = 10;
      this.pageNumber = 0;
      this.validateInput();
    } else if (actionName == 'firstCall') {
      this.validateInput();
      this.pageNumber = 0;
    } else if (actionName == 'lastCall') {
      this.validateInput();
      this.pageNumber = this.userRoleFormVal['totalPageCount'];
    } else if (actionName == 'previousCall') {
      this.validateInput();
      this.pageNumber = this.userRoleFormVal['pageNumber'];
    } else if (actionName == 'nextCall') {
      this.validateInput();
      this.pageNumber = this.userRoleFormVal['pageNumber'];
    } else if (actionName == 'pageSize') {
      this.validateInput();
    }

    this.postData = {
      "userId": null,
      "institutionId": this.institutionId,
      "editUserId": 0,
      "roleId": null,
      "editRoleId": null,

      "pageNumber": this.pageNumber,
      "pageSize": this.numOfRecordsId,
      "totalPageCount": 0,
      "editInstitutionId": null,
      "afterDelPageNumber": 0,
      "afterDelPageSize": 10,
      "afterDelTotalPageCount": 0,

      "searchNetworkId": this.searchNetworkId,
      "networkLoginId": this.networkLoginId,
      "roleName": null,
      "totalRecordsCount": "0",
      "institutionName": null,
      "message": null,
      "errorMessage": null,
      "errorMessageForEmail": null,
      "editErromessage": null,
      "sectionName": null,
      "buttonName": null,
      "editNetworkId": null,
      "userDescriptionErrMsg": null,
      "userDescription": this.userDescription,
      "editNetworkLoginId": null,
      "editUserDescription": null,
      "userEmailId": this.userEmailId,
      "emailId": this.emailId,
      "editEmailId": null,

      "allowCreateEdit": null,
      "isCreatedRequest": null,
      "showPagination": false,
      "showSearch": false,
      "showErrorMessage": false,
      "showCreateSuccess": false,
      "showCreateError": false,
      "showEditSuccess": false,
      "showEditError": false,
      "showCreateEmailError": false,
      "deleteSuccessMsg": false,
      "selected": null,
      "submitted": null,
      "showResults": false,
      "deletedSuccessMsg": false,
      "deleteErrorMsg": false,
      "showUserSearchView": true,

      "roles": [],
      "institutions": [],
      "showSelectedForCreate": [],
      "selectedForCreate": this.selectedForCreate,
      "editSelectedForCreate": [],
      "userRoleFormList": [],

      "showEditDeleteIcon": true,

      "createdBy": null,
      "lastUpdatedBy": null
    }
    return this.postData;
  }
  resetFields() {
    this.searchNetworkId = "";
    this.userEmailId = "";
  }
  validateInput() {
    if (this.userEmailId == null && this.searchNetworkId == null) {
      this.userEmailId = "";
      this.searchNetworkId = "";
    } else if (this.userEmailId == null) {
      this.userEmailId = "";
    } else if (this.searchNetworkId == null) {
      this.searchNetworkId = "";
    }
  }

  exportUsers() {
    this.deletedSuccessMsgDiv = false;
    this.deleteErrorMsgDiv = false;
    this.spinner.show();
    this.userRolesService.exportUsers(this.setPostData('searchUsers')).subscribe(
      (res) => {
        this.exportUsersRes = res;
        this.usersList = [];
          this.spinner.hide();
          var fileNmae = 'ExportUsersReport' + '_' +
            new DatePipe('en-US').transform(Date.now(), 'yyyyMMddhhmmss', 'America/New_York');
          new AngularCsv(this.removePropertiesUsers(this.exportUsersRes['userRoleFormList']), fileNmae, this.csvOptionsTransaction);
       
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
    }
    removePropertiesUsers(items) {
        this.usersList = [];
      for (var i = 0; i < items.length; i++) {
        var item = {};
        item['networkLoginId'] = items[i].networkLoginId;
        item['userDescription'] = items[i].userDescription;
        item['institutionName'] = items[i].institutionName;
        item['roleName'] = items[i].roleName;
        this.usersList.push(item);
      }
      return this.usersList;
    }
  goBack($event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.UserPanel = true;
    this.searchBarDiv = true;
    this.showUserSearchView = true;
    this.deleteUserDiv = false;
    this.editusersDiv = false;
    this.createUserDiv = false;
  }
  ngOnDestroy(): void {
    this.exportUsersRes = null;
    this.userRoleFormVal = null;
  }
}

