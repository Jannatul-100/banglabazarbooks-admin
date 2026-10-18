import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/core/filter-data';
import { LandingPage } from '../../interfaces/common/landing-page.interface';

const API_LANDING_PAGE = environment.apiBaseLink + '/api/landing-page/';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  constructor(private httpClient: HttpClient) {}

  addLandingPage(data: LandingPage) {
    return this.httpClient.post<ResponsePayload>(API_LANDING_PAGE + 'add', data);
  }

  getAllLandingPages(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: LandingPage[];
      count: number;
      success: boolean;
    }>(API_LANDING_PAGE + 'get-all', filterData, { params });
  }

  getLandingPageById(id: string) {
    return this.httpClient.get<{ data: LandingPage; success: boolean }>(
      API_LANDING_PAGE + id,
    );
  }

  updateLandingPageById(id: string, data: LandingPage) {
    return this.httpClient.put<ResponsePayload>(
      API_LANDING_PAGE + 'update/' + id,
      data,
    );
  }

  deleteLandingPageById(id: string) {
    return this.httpClient.delete<ResponsePayload>(
      API_LANDING_PAGE + 'delete/' + id,
    );
  }

  deleteMultipleLandingPageById(ids: string[]) {
    return this.httpClient.post<ResponsePayload>(
      API_LANDING_PAGE + 'delete-multiple',
      { ids },
    );
  }
}
