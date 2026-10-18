import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Notification} from '../../interfaces/common/notification.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_BRAND = environment.apiBaseLink + '/api/notification/';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addNotification
   * insertManyNotification
   * getAllNotifications
   * getNotificationById
   * updateNotificationById
   * updateMultipleNotificationById
   * deleteNotificationById
   * deleteMultipleNotificationById
   */

  addNotification(data: Notification):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }

  getAllNotifications(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Notification[], count: number, success: boolean }>(API_BRAND + 'get-all/', filterData, {params});
  }

  getNotificationById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Notification, message: string, success: boolean }>(API_BRAND + id, {params});
  }

  updateNotificationById(id: string, data: Notification) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteNotificationById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleNotificationById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }

  // notificationGroupByField<T>(dataArray: T[], field: string): NotificationGroup[] {
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
  //   return final as NotificationGroup[];

  // }



}
