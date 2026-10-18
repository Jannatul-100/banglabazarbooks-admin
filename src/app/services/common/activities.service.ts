import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Activities} from '../../interfaces/common/activities.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from 'rxjs';

const API_NEW_EXPENSE = environment.apiBaseLink + '/api/activities/';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  constructor(private httpClient: HttpClient) {
  }

  /**
   * addActivities
   * insertManyActivities
   * getAllActivitiess
   * getActivitiesById
   * updateActivitiesById
   * updateMultipleActivitiesById
   * deleteActivitiesById
   * deleteMultipleActivitiesById
   */

  addActivities(data: Activities): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_NEW_EXPENSE + 'add', data);
  }

  getAllActivities(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Activities[];
      count: number;
      success: boolean;
      calculation: any;
    }>(API_NEW_EXPENSE + 'get-all/', filterData, {params});
  }

  getActivitiesById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Activities;
      message: string;
      success: boolean;
    }>(API_NEW_EXPENSE + id, {params});
  }

  updateActivitiesById(id: string, data: Activities) {
    return this.httpClient.put<{ message: string; success: boolean }>(
      API_NEW_EXPENSE + 'update/' + id,
      data
    );
  }

  // deleteActivitiesById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_NEW_EXPENSE + 'delete/' + id);
  // }

  deleteActivitiesById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(
      API_NEW_EXPENSE + 'delete/' + id,
      {params}
    );
  }

  deleteMultipleActivitiesById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(
      API_NEW_EXPENSE + 'delete-multiple',
      {ids: ids},
      {params}
    );
  }

  //  activitiesGroupByField<T>(dataArray: T[], field: string): ActivitiesGroup[] {
  //   const data = dataArray.reduce((group, product) => {
  //     const uniqueField = product[field]
  //     group[uniqueField] = group[uniqueField] ?? [];
  //     group[uniqueField].push(product);
  //     return group;
  //   }, {});
  //
  //   const final = [];
  //
  //   for (const key in data) {
  //     final.push({
  //       _id: key,
  //       data: data[key]
  //     })
  //   }
  //
  //   return final as ActivitiesGroup[];

  // }
}
