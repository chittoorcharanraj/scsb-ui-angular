import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { url } from 'inspector';
import { Observable } from 'rxjs';
import { appHeaders } from 'src/config/headers';
import { urls } from 'src/config/urls';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient, private router: Router) { }
  homeUrl = environment.homeUrl;
  baseUrl = urls.baseUrl;
  casPrefix = urls.casPrefix;
  api = urls.api;

  getInstitutions(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + this.api + '/institutions',
      {
        headers: appHeaders.getHeaders()
      });
  }
  loginCheck(): Observable<any> {
    const httpOptions = {
      headers: appHeaders.getHeaders(),
      withCredentials: true,
      observe: 'response' as 'response'
    };
    return this.httpClient.get<any>(this.baseUrl + this.api + '/loginCheck', httpOptions);
  }
}
