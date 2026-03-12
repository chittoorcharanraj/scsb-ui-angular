import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { TreeNode } from 'primeng/api';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
import { JobsService } from '@service/jobs/jobs.service';
import { urls } from '@config/urls';
import { LoginService } from '@service/login/login.service';
@Component({
  standalone: false,
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  constructor(private jobsService: JobsService,
    private spinner: NgxSpinnerService,
    private dashBoardService: DashBoardService) { }
  jobsResVal: TreeNode[];
  scheduleJobDetailsSectionDiv = false;
  scheduleJobSectionDiv = false;
  schedule_show = false;
  reschedule_show = false;
  unschedule_show = false;
  errorMessageIdDiv = false;
  messageIdDiv = false;
  status_readOnly = false;
  cronExpressionId: string;
  jobDescriptionId: string;
  jobNameId: string;
  jobId: number;
  jobInstanceId: number;
  jobParameter: string;
  res: Object;
  isAuthenticated = false;
  institutions: string[];
  BATCH_SCHEDULE = urls.BATCH_SCHEDULE;
  url: string = this.BATCH_SCHEDULE + '/jobs/';
  ngOnInit(): void {
    this.dashBoardService.setApiPath('search');
    this.jobsService.getInstitutions().subscribe(
      (res) => {
        this.institutions = res;
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
    this.spinner.show();
    this.jobsService.displayJobs().subscribe(
      (res) => {
        this.jobsResVal = res;
        this.scheduleJobDetailsSectionDiv = true;
        this.spinner.hide();
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  postData = {
    "jobId": null,
    "jobName": null,
    "jobDescription": null,
    "cronExpression": null,
    "jobParameter": null,
    "scheduleType": null,
    "message": null,
    "errorMessage": null,
    "jobEntities": null
  }
  schedule(id, name, cronExpression, jobDescription) {
    this.scheduleJobDetailsSectionDiv = false;
    this.scheduleJobSectionDiv = true;
    this.schedule_show = true;
    this.reschedule_show = false;
    this.unschedule_show = false;
    this.status_readOnly = false;
    this.cronExpressionId = cronExpression;
    this.jobDescriptionId = jobDescription;
    this.jobNameId = name;
    this.jobId = id;
    this.jobParameter = null;
    this.getJobParameters(name);
  }
  Reschedule(id, name, cronExpression, jobDescription) {
    this.scheduleJobDetailsSectionDiv = false;
    this.scheduleJobSectionDiv = true;
    this.schedule_show = false;
    this.reschedule_show = true;
    this.unschedule_show = false;
    this.status_readOnly = false;
    this.cronExpressionId = cronExpression;
    this.jobDescriptionId = jobDescription;
    this.jobNameId = name;
    this.jobId = id;
    this.jobParameter = null;
    this.getJobParameters(name);
  }
  Unschedule(id, name, cronExpression, jobDescription) {
    this.scheduleJobDetailsSectionDiv = false;
    this.scheduleJobSectionDiv = true;
    this.schedule_show = false;
    this.reschedule_show = false;
    this.unschedule_show = true;
    this.status_readOnly = true;
    this.cronExpressionId = cronExpression;
    this.jobDescriptionId = jobDescription;
    this.jobNameId = name;
    this.jobId = id;
    this.jobParameter = null;
    this.getJobParameters(name);
  }

  invokeScheduleJob(scheduleType) {
    this.spinner.show();
    this.postData = {
      "jobId": this.jobId,
      "jobName": this.jobNameId,
      "jobDescription": this.jobDescriptionId,
      "cronExpression": this.cronExpressionId,
      "jobParameter": this.jobParameter,
      "scheduleType": scheduleType,
      "message": null,
      "errorMessage": null,
      "jobEntities": null
    }

    this.jobsService.scheduleJobs(this.postData).subscribe(
      (res) => {
        this.jobsResVal = res;
        this.spinner.hide();
        if (this.jobsResVal['message'] != null) {
          this.messageIdDiv = true;
          this.status_readOnly = true;
          this.errorMessageIdDiv = false;
          this.schedule_show = false;
          this.reschedule_show = false;
          this.unschedule_show = false;
        } else if (this.jobsResVal['errorMessage'] != null) {
          this.errorMessageIdDiv = true;
          this.messageIdDiv = false;
          this.status_readOnly = false;
        }
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  closeScheduleJob() {    
    this.spinner.show();
    this.jobsService.displayJobs().subscribe(
      (res) => {
        this.jobParameter = null;
        this.jobsResVal = res;
        this.spinner.hide();
        this.scheduleJobDetailsSectionDiv = true;
        this.scheduleJobSectionDiv = false;
        this.schedule_show = false;
        this.reschedule_show = false;
        this.unschedule_show = false;
        this.errorMessageIdDiv = false;
        this.messageIdDiv = false;
      },
      (error) => {
        this.jobParameter = null;
        this.dashBoardService.errorNavigation();
      });
  }
  getJobParameters(jobName) {
    this.spinner.show();
    this.postData = {
      "jobId": null,
      "jobName": jobName,
      "jobDescription": null,
      "cronExpression": null,
      "jobParameter": null,
      "scheduleType": null,
      "message": null,
      "errorMessage": null,
      "jobEntities": null
    }

    this.jobsService.getJobParameters(this.postData).subscribe(
      (res) => {        
        this.spinner.hide();
        if (res['message'] != null) {
          this.jobParameter = res['jobParameter'];          
        } else if (res['errorMessage'] != null) {
          this.jobParameter = null;         
        } else {
          this.jobParameter = null;
        }
      },
      (error) => {
        this.jobParameter = null; 
        this.dashBoardService.errorNavigation();
      });
  }
  timezone(date) {
    return this.dashBoardService.setTimeZone(date);
  }
}
