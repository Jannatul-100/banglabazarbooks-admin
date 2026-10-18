import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {ManuscriptSubject} from '../../interfaces/common/manuscript-subject.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_POPUP = environment.apiBaseLink + '/api/manuscriptSubject/';


@Injectable({
  providedIn: 'root'
})
export class ManuscriptSubjectService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addManuscriptSubject
   * insertManyManuscriptSubject
   * getAllManuscriptSubjects
   * getManuscriptSubjectById
   * updateManuscriptSubjectById
   * updateMultipleManuscriptSubjectById
   * deleteManuscriptSubjectById
   * deleteMultipleManuscriptSubjectById
   */

  addManuscriptSubject(data: ManuscriptSubject):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_POPUP + 'add', data);
  }

  getAllManuscriptSubjects(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ManuscriptSubject[], count: number, success: boolean }>(API_POPUP + 'get-all/', filterData, {params});
  }

  getManuscriptSubjectById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ManuscriptSubject, message: string, success: boolean }>(API_POPUP + id, {params});
  }

  updateManuscriptSubjectById(id: string, data: ManuscriptSubject) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_POPUP + 'update/' + id, data);
  }

  deleteManuscriptSubjectById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_POPUP + 'delete/' + id, {params});
  }

  deleteMultipleManuscriptSubjectById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_POPUP + 'delete-multiple', {ids: ids}, {params});
  }

  // manuscriptSubjectGroupByField<T>(dataArray: T[], field: string): ManuscriptSubjectGroup[] {
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
  //   return final as ManuscriptSubjectGroup[];

  // }



}
