import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Manuscript} from '../../interfaces/common/manuscript.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from 'rxjs';

const API_NEW_EXPENSE = environment.apiBaseLink + '/api/manuscript/';

@Injectable({
  providedIn: 'root',
})
export class ManuscriptService {
  constructor(private httpClient: HttpClient) {
  }

  /**
   * addManuscript
   * insertManyManuscript
   * getAllManuscripts
   * getManuscriptById
   * updateManuscriptById
   * updateMultipleManuscriptById
   * deleteManuscriptById
   * deleteMultipleManuscriptById
   */

  addManuscript(data: Manuscript): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_NEW_EXPENSE + 'add', data);
  }

  getAllManuscript(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Manuscript[];
      count: number;
      success: boolean;
      calculation: any;
    }>(API_NEW_EXPENSE + 'get-all/', filterData, {params});
  }

  getManuscriptById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Manuscript;
      message: string;
      success: boolean;
    }>(API_NEW_EXPENSE + id, {params});
  }

  updateManuscriptById(id: string, data: Manuscript) {
    return this.httpClient.put<{ message: string; success: boolean }>(
      API_NEW_EXPENSE + 'update/' + id,
      data
    );
  }

  // deleteManuscriptById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_NEW_EXPENSE + 'delete/' + id);
  // }

  deleteManuscriptById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(
      API_NEW_EXPENSE + 'delete/' + id,
      {params}
    );
  }

  deleteMultipleManuscriptById(ids: string[], checkUsage?: boolean) {
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

  //  manuscriptGroupByField<T>(dataArray: T[], field: string): ManuscriptGroup[] {
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
  //   return final as ManuscriptGroup[];

  // }
}
