import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { BulkRequestForm } from '@model/BulkRequestForm';
import { appHeaders } from '@config/headers';
import { urls } from '@config/urls';

@Injectable({
  providedIn: 'root'
})
export class BulkRequestService {
  PREFIX = urls.BULK_REQUEST;

  constructor(@Inject(HttpClient) private httpClient: HttpClient) { }

  loadCreateRequest(): Observable<TreeNode[]> {
    return this.httpClient.post<TreeNode[]>(this.PREFIX + "/loadCreateRequest",
      {
        headers: appHeaders.getHeaders()
      });
  }
  createBulkRequest(deliveryLocation: string, requestingInstitutionId: string,
    patronBarcodeId: string, BulkRequestName: string, choosenFile:
      string, patronEmailId: string, file: File, requestNotesId: string):
    Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', file, file.name);
    let headers = appHeaders.getHeaders_formData();
    let parames = new HttpParams()
      .set('deliveryLocation', deliveryLocation)
      .set('requestingInstitutionId', requestingInstitutionId)
      .set('patronBarcodeId', patronBarcodeId)
      .set('BulkRequestName', BulkRequestName)
      .set('choosenFile', choosenFile)
      .set('patronEmailId', patronEmailId)
      .set('notes', requestNotesId);
    const options = {
      params: parames, headers: headers,
      withCredentials: true
    };
    return this.httpClient.post<any>(this.PREFIX + "/createBulkRequest", formdata,
      options);
  }
  populateDeliveryLocations(postData: BulkRequestForm): Observable<TreeNode[]> {
    return this.httpClient.post<TreeNode[]>(this.PREFIX + "/populateDeliveryLocations", postData,
      {
        headers: appHeaders.getHeaders()
      });
  }
  searchRequest(postData: BulkRequestForm): Observable<TreeNode[]> {
    return this.httpClient.post<TreeNode[]>(this.PREFIX + "/searchRequest", postData,
      {
        headers: appHeaders.getHeaders()
      });
  }

  firstCall(postData: BulkRequestForm): Observable<TreeNode[]> {
    return this.httpClient.post<TreeNode[]>(this.PREFIX + "/first", postData,
      {
        headers: appHeaders.getHeaders()
      });
  }
  nextCall(postData: BulkRequestForm): Observable<TreeNode[]> {
    return this.httpClient.post<TreeNode[]>(this.PREFIX + "/next", postData,
      {
        headers: appHeaders.getHeaders()
      });
  }
  previousCall(postData: BulkRequestForm): Observable<TreeNode[]> {
    return this.httpClient.post<TreeNode[]>(this.PREFIX + "/previous", postData,
      {
        headers: appHeaders.getHeaders()
      });
  }
  lastCall(postData: BulkRequestForm): Observable<TreeNode[]> {
    return this.httpClient.post<TreeNode[]>(this.PREFIX + "/last", postData,
      {
        headers: appHeaders.getHeaders()
      });
  }
  onRequestPageSizeChange(postData: BulkRequestForm): Observable<TreeNode[]> {
    return this.httpClient.post<TreeNode[]>(this.PREFIX + "/requestPageSizeChange", postData,
      {
        headers: appHeaders.getHeaders()
      });
  }
  downloadReports(requestId: string): Observable<any> {
    return this.httpClient.get<any>(this.PREFIX + '/' + requestId,
      {
        headers: appHeaders.getHeaders()
      });
  }
  refreshStatus(postData: string): Observable<TreeNode[]> {
    return this.httpClient.post<TreeNode[]>(this.PREFIX + "/refreshStatus", postData,
      {
        headers: appHeaders.getHeaders()
      });
  }
}
