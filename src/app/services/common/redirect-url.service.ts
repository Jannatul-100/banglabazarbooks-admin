import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {RedirectUrl} from '../../interfaces/common/redirect-url.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_BRAND = environment.apiBaseLink + '/api/redirect-url/';


@Injectable({
  providedIn: 'root'
})
export class RedirectUrlService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addRedirectUrl
   * insertManyRedirectUrl
   * getAllRedirectUrls
   * getRedirectUrlById
   * updateRedirectUrlById
   * updateMultipleRedirectUrlById
   * deleteRedirectUrlById
   * deleteMultipleRedirectUrlById
   */

  addRedirectUrl(data: RedirectUrl):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }

  getAllRedirectUrls(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: RedirectUrl[], count: number, success: boolean }>(API_BRAND + 'get-all/', filterData, {params});
  }

  getRedirectUrlById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: RedirectUrl, message: string, success: boolean }>(API_BRAND + id, {params});
  }

  updateRedirectUrlById(id: string, data: RedirectUrl) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteRedirectUrlById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleRedirectUrlById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }



}
