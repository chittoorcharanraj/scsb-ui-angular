import { Component, HostListener, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { TreeNode } from 'primeng/api';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { RolesService } from '@service/roles/roles.service';

enum CONSTANTS {
  ENTER = 'Enter'
}
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  constructor(private rolesService: RolesService, private spinner: NgxSpinnerService, private dashBoardService: DashBoardService) { }
  ngOnInit(): void {
    this.dashBoardService.setApiPath('roles');
    this.spinner.hide();
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(CONSTANTS.ENTER == event.key)
      this.searchRoles();
  }
  rolesVal: TreeNode[];
  permissionNames: TreeNode[];
  deleteResponse: TreeNode[];
  rolesPanel = true;
  showResults = false;
  createRoleSectionDiv = false;
  successDiv = false;
  errorMessageDiv = false;
  rolesSearchResultsDiv = false;
  editRoleSectionDiv = false;
  deleteRoleSectionDiv = false;
  permissionNamesErrorMessageDiv = false;
  roleDescriptionErrorMessageDiv = false;
  roleNameErrorMessageDiv = false;
  successMessageRoleCreateionDiv = false;
  errorMessageRoleCreateionDiv = false;
  successMessageEditRoleDiv = false;
  errorMessageEditRoleDiv = false;
  editRoleNameErrorMessageDiv = false;
  editRoleDescriptionErrorMessageDiv = false;
  editPermissionNamesErrorMessageDiv = false;
  successMessageDeleteRoleDiv = false;
  errorMessageDeleteRoleDiv = false;
  lastbutton = true;
  firstbutton = true;
  previousbutton = true;
  nextbutton = true;
  showentries = 10;
  pageNumber = 0;
  roleName: string;
  permissionName: string;
  permissionNameValue: string;
  permissionNamesList: string[];
  editPermissionNameId: string[];
  editpermissionNameId: string[];
  editRoleDescription: string;
  editRoleName: string;
  deleteRoleNameId: string;
  deleteRoleDescriptionId: string;
  deletePermissionNameId: string[];
  roleNameForDelete: string;
  roleDescriptionForDelete: string;
  permissionNamesForDelete: string;
  roleId: number;
  roleNameId: string;
  roleDescriptionId: string;
  permissionNameId: string;
  newRoleName: string;
  newRoleDescription: string;
  newRolePermissionNames: string;
  numOfRecordsId: 10;

  postData = {
    "roleName": null,
    "roleDescription": null,
    "permissionNames": null,
    "showResults": false,
    "newRole": false,
    "totalRecordCount": "0",
    "errorMessage": null,
    "pageNumber": 0,
    "pageSize": 10,
    "totalPageCount": 0,
    "afterDelPageNumber": 0,
    "afterDelPageSize": 10,
    "afterDelTotalPageCount": 0,
    "message": null,
    "newRoleName": null,
    "newRoleDescription": null,
    "newPermissionNames": null,
    "editRoleName": null,
    "editRoleDescription": null,
    "editPermissionNames": null,
    "editPermissionName": [],
    "roleNameForDelete": null,
    "roleDescriptionForDelete": null,
    "permissionNamesForDelete": null,
    "permissionNameList": [],
    "selectedPermissionNames": [],
    "roleId": null,
    "rolesSearchResults": [],
    "showIntial": true
  }
  searchRoles() {
    this.spinner.show();
    this.rolesService.searchRoles(this.setPostData('searchRole')).subscribe(
      (res) => {
        this.spinner.hide();
        this.rolesVal = res;
        if (this.rolesVal['errorMessage'] != null) {
          this.errorMessageDiv = true;
          this.rolesSearchResultsDiv = false;
          this.showResults = true;
          this.successDiv = false;
        } else {
          this.rolesSearchResultsDiv = true;
          this.errorMessageDiv = false;
          this.showResults = true;
          this.successDiv = false;
          this.numOfRecordsId = this.rolesVal['pageSize'];
        }
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  resetFields() {
    this.roleName = "";
    this.permissionName = "";
  }
  validateEditRole() {
    this.editRoleNameErrorMessageDiv = false;
    this.editRoleDescriptionErrorMessageDiv = false;
    this.editPermissionNamesErrorMessageDiv = false;
    var statusCreateRole = true;
    if (this.editRoleName == '' || this.editRoleName == null || this.editRoleName == undefined) {
      this.editRoleNameErrorMessageDiv = true;
      statusCreateRole = false;
    }
    if (this.editRoleDescription == null || this.editRoleDescription == '' || this.editRoleDescription == undefined) {
      this.editRoleDescriptionErrorMessageDiv = true
      statusCreateRole = false;
    }
    if (this.editPermissionNameId == null || this.editPermissionNameId == undefined || this.editPermissionNameId.length <= 0) {
      this.editPermissionNamesErrorMessageDiv = true
      statusCreateRole = false;
    }
    return statusCreateRole;
  }
  saveEditedRole(roleId, roleName, roleDescription, permissionNames) {
    if (this.validateEditRole()) {
      this.spinner.show();
      this.rolesService.saveEditedRole(roleId, roleName, roleDescription, permissionNames).subscribe(
        (res) => {
          this.spinner.hide();
          this.rolesVal = res;
          if (this.rolesVal['message'] != null) {
            this.successMessageEditRoleDiv = true;
            this.successMessageDeleteRoleDiv = false;
            this.successMessageRoleCreateionDiv = false;
          } else if (this.rolesVal['errorMessage'] != null) {
            this.errorMessageEditRoleDiv = true;
            this.errorMessageDeleteRoleDiv = false;
            this.errorMessageRoleCreateionDiv = false;
          }
        });
    }
  }
  editRole(roleId, roleName, roleDescription, permissionNames) {
    this.populatePermissionNames();
    this.errorMessageRoleCreateionDiv = false;
    this.successMessageDeleteRoleDiv = false;
    this.successMessageRoleCreateionDiv = false;
    this.errorMessageDeleteRoleDiv = false;
    this.successMessageEditRoleDiv = false;
    this.errorMessageEditRoleDiv = false;
    this.showResults = false;
    this.rolesPanel = false;
    this.rolesSearchResultsDiv = false;
    this.editRoleSectionDiv = true;
    this.deleteRoleSectionDiv = false;
    this.createRoleSectionDiv = false;
    this.editPermissionNameId = this.convertToarray(permissionNames).map(function (el) { return el.trim(); });
    this.editRoleDescription = roleDescription;
    this.editRoleName = roleName;
    this.roleId = roleId;
  }
  convertToarray(permissinNameValue) {
    return String(permissinNameValue).split(',');
  }
  deleteRole(roleId, roleName, roleDescription, permissionNames) {
    this.populatePermissionNames();
    this.showResults = false;
    this.rolesPanel = false;
    this.rolesSearchResultsDiv = false;
    this.editRoleSectionDiv = false;
    this.deleteRoleSectionDiv = false;
    this.createRoleSectionDiv = false;
    this.deleteRoleSectionDiv = true;
    this.deletePermissionNameId = this.convertToarray(permissionNames).map(function (el) { return el.trim(); });
    this.deleteRoleDescriptionId = roleDescription;
    this.deleteRoleNameId = roleName;
    this.roleId = roleId;
  }
  deleteFromDb() {
    this.spinner.show();
    this.rolesService.delete(this.setPostData('deleteRole')).subscribe(
      (res) => {
        this.spinner.hide();
        this.deleteResponse = res;
        this.rolesVal = this.deleteResponse;
        if (this.deleteResponse['message'] != null) {
          this.deleteRoleSectionDiv = false;
          this.rolesSearchResultsDiv = true;
          this.errorMessageDiv = false;
          this.successDiv = true;
          this.rolesPanel = true;
          this.showResults = true;
          this.roleName = "";
        }
      });
  }
  createRole() {
    this.successMessageRoleCreateionDiv = false;
    this.showResults = false;
    this.rolesPanel = false;
    this.rolesSearchResultsDiv = false;
    this.editRoleSectionDiv = false;
    this.deleteRoleSectionDiv = false;
    this.createRoleSectionDiv = true;
    this.populatePermissionNames();
  }
  validateCreateRole() {
    this.roleNameErrorMessageDiv = false;
    this.roleDescriptionErrorMessageDiv = false;
    this.permissionNamesErrorMessageDiv = false;
    var statusCreateRole = true;
    if (this.roleNameId == '' || this.roleNameId == null || this.roleNameId == undefined) {
      this.roleNameErrorMessageDiv = true;
      statusCreateRole = false;
    }
    if (this.roleDescriptionId == null || this.roleDescriptionId == '' || this.roleDescriptionId == undefined) {
      this.roleDescriptionErrorMessageDiv = true
      statusCreateRole = false;
    }
    if (this.permissionNameId == null || this.permissionNameId == '' || this.permissionNameId == undefined) {
      this.permissionNamesErrorMessageDiv = true
      statusCreateRole = false;
    }
    return statusCreateRole;
  }
  saveCreateRole() {
    if (this.validateCreateRole()) {
      this.spinner.show();
      this.rolesService.createRole(this.setPostData('createRole')).subscribe(
        (res) => {
          this.rolesVal = res;
          if (this.rolesVal['message'] != null) {
            this.successMessageEditRoleDiv = false;
            this.successMessageDeleteRoleDiv = false;
            this.successMessageRoleCreateionDiv = true;
            this.errorMessageRoleCreateionDiv = false;
            this.spinner.hide();
          } else if (this.rolesVal['errorMessage'] != null) {
            this.errorMessageEditRoleDiv = false;
            this.errorMessageDeleteRoleDiv = false;
            this.errorMessageRoleCreateionDiv = true;
            this.successMessageRoleCreateionDiv = false;
            this.spinner.hide();
          }
          this.roleNameId = '';
          this.roleDescriptionId = '';
          this.permissionNameId = '';
          this.spinner.hide();
        },
        (error) => {
          this.dashBoardService.errorNavigation();
        });
    }
  }
  populatePermissionNames() {
    this.rolesService.populatePermissionName().subscribe(
      (res) => {
        this.permissionNames = res;
        this.permissionNamesList = this.permissionNames['permissionNameList'];
      });
  }
  togglePermissionValidation() {

  }
  firstCall() {
    this.spinner.show();
    this.rolesService.firstCall(this.setPostData('firstCall')).subscribe(
      (res) => {
        this.spinner.hide();
        this.rolesVal = res;
        this.successDiv = false;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  lastCall() {
    this.spinner.show();
    this.rolesService.lastCall(this.setPostData('lastCall')).subscribe(
      (res) => {
        this.spinner.hide();
        this.rolesVal = res;
        this.successDiv = false;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  previousCall() {
    this.spinner.show();
    this.rolesService.previousCall(this.setPostData('previousCall')).subscribe(
      (res) => {
        this.spinner.hide();
        this.rolesVal = res;
        this.successDiv = false;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  nextCall() {
    this.spinner.show();
    this.rolesService.nextCall(this.setPostData('nextCall')).subscribe(
      (res) => {
        this.spinner.hide();
        this.rolesVal = res;
        this.successDiv = false;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  pageSizeChange(size) {
    this.showentries = size
    this.rolesService.pageSizeChange(this.setPostData('pageSize')).subscribe(
      (res) => {
        this.rolesVal = res;
        this.successDiv = false;
        this.pagination();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  pagination() {
    if (this.rolesVal['pageNumber'] == 0 && (this.rolesVal['totalPageCount'] - 1 > 0)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = false;
      this.lastbutton = false;
    } else if (this.rolesVal['pageNumber'] == 0 && (this.rolesVal['pageNumber'] == this.rolesVal['totalPageCount'] - 1)) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = true;
      this.lastbutton = true;
    }
    else if ((this.rolesVal['pageNumber'] == this.rolesVal['totalPageCount'] - 1) && this.rolesVal['totalPageCount'] - 1 > 0) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = true;
      this.lastbutton = true;
    } else if ((this.rolesVal['pageNumber'] < this.rolesVal['totalPageCount'] - 1) && (this.rolesVal['pageNumber'] != 0)) {
      this.firstbutton = false;
      this.previousbutton = false;
      this.nextbutton = false;
      this.lastbutton = false;
    } else if (this.rolesVal['pageNumber'] == 0 && this.rolesVal['totalPageCount'] == 0) {
      this.firstbutton = true;
      this.previousbutton = true;
      this.nextbutton = true;
      this.lastbutton = true;
    }
  }
  setPostData(actionName) {
    if (actionName == 'createRole') {
      this.newRoleName = this.roleNameId;
      this.newRoleDescription = this.roleDescriptionId;
      this.newRolePermissionNames = this.permissionNameId.toString();
      this.roleName = null;
      this.permissionName = null;
    } else if (actionName == 'searchRole') {
      this.validateInput();
      this.showentries = 10;
      this.pageNumber = 0;
    } else if (actionName == 'firstCall') {
      this.validateInput();
      this.pageNumber = 0;
      this.showentries = this.numOfRecordsId;
    } else if (actionName == 'lastCall') {
      this.validateInput();
      this.pageNumber = this.rolesVal['totalPageCount'];
      this.showentries = this.numOfRecordsId;
    } else if (actionName == 'previousCall') {
      this.validateInput();
      this.pageNumber = this.rolesVal['pageNumber'];
      this.showentries = this.numOfRecordsId;
    } else if (actionName == 'nextCall') {
      this.validateInput();
      this.pageNumber = this.rolesVal['pageNumber'];
      this.showentries = this.numOfRecordsId;
    } else if (actionName == 'deleteRole') {
      this.validateInput();
      this.roleNameForDelete = this.deleteRoleNameId;
      this.roleDescriptionForDelete = this.deleteRoleDescriptionId;
      this.permissionNamesForDelete = this.deletePermissionNameId.toString();
    } else if (actionName == 'pageSize') {
      this.validateInput();
    }

    this.postData = {
      "roleName": this.roleName,
      "roleDescription": null,
      "permissionNames": this.permissionName,
      "showResults": false,
      "newRole": false,
      "totalRecordCount": "0",
      "errorMessage": null,
      "pageNumber": this.pageNumber,
      "pageSize": this.showentries,
      "totalPageCount": 0,
      "afterDelPageNumber": 0,
      "afterDelPageSize": 10,
      "afterDelTotalPageCount": 0,
      "message": null,
      "newRoleName": this.newRoleName,
      "newRoleDescription": this.newRoleDescription,
      "newPermissionNames": this.newRolePermissionNames,
      "editRoleName": null,
      "editRoleDescription": null,
      "editPermissionNames": null,
      "editPermissionName": [],
      "roleNameForDelete": this.roleNameForDelete,
      "roleDescriptionForDelete": this.roleDescriptionForDelete,
      "permissionNamesForDelete": this.permissionNamesForDelete,
      "permissionNameList": [],
      "selectedPermissionNames": [],
      "roleId": this.roleId,
      "rolesSearchResults": [],
      "showIntial": true
    }
    return this.postData;
  }
  validateInput() {
    if (this.roleName == null && this.permissionName == null) {
      this.roleName = "";
      this.permissionName = "";
    } else if (this.roleName == null) {
      this.roleName = "";
    } else if (this.permissionName == null) {
      this.permissionName = "";
    }
    this.newRoleName = null;
    this.newRoleDescription = null;
    this.newRolePermissionNames = null;
  }
  goBack($event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.rolesPanel = true;
    this.showResults = false;
    this.createRoleSectionDiv = false;
    this.editRoleSectionDiv = false;
    this.deleteRoleSectionDiv = false;
    this.successMessageRoleCreateionDiv = false;
  }
  ngOnDestroy(): void {
    this.rolesVal = null;
  }
}
