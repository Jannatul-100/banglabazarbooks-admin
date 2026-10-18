import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Order} from '../../interfaces/common/order.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_ORDER = environment.apiBaseLink + '/api/order/';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addOrder
   * insertManyOrder
   * getAllOrders
   * getOrderById
   * updateOrderById
   * updateMultipleOrderById
   * deleteOrderById
   * deleteMultipleOrderById
   */

  addOrder(data: Order) {
    return this.httpClient.post<ResponsePayload>
    (API_ORDER + 'add', data);
  }

  insertManyOrder(data: Order, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_ORDER + 'insert-many', mData);
  }

  parseRawText(rawText: string) {
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'parse-raw-text', { rawText });
  }

  getAllOrders(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Order[], calculation: any, count: number, success: boolean }>(API_ORDER + 'get-all', filterData, {params});
  }

  getOrderById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Order, message: string, success: boolean }>(API_ORDER + id, {params});
  }

  updateOrderById(id: string, data: Order) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_ORDER + 'update-admin/' + id, data);
  }

  changeOrderStatus(id: string, data: any) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_ORDER + 'change-status/' + id, data);
  }

  updateMultipleOrderById(ids: string[], data: Order) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_ORDER + 'update-multiple', mData);
  }

  deleteOrderById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_ORDER + 'delete/' + id, {params});
  }

  deleteMultipleOrderById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'delete-multiple', {ids: ids}, {params});
  }

  sendToCourier(id: string, data?: any) {
    return this.httpClient.put<{ success: boolean; message: string; data: any }>(
      API_ORDER + 'send-to-courier/' + id,
      data
    );
  }

  bulkSendToCourier(data: any) {
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'bulk-send-to-courier', data);
  }

  generateInvoices(ids: string[]) {
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'generate-invoices', { ids });
  }

  checkFraudOrder(phoneNo: string) {
    return this.httpClient.get<{ success: boolean; message: string; data: any }>(
      API_ORDER + 'check-fraud-order/' + phoneNo
    );
  }

  getTabCounts(filter: any, search?: string) {
    let params = new HttpParams();
    if (search) {
      params = params.append('q', search);
    }
    return this.httpClient.post<{ success: boolean; message: string; data: any }>(
      API_ORDER + 'get-tab-counts',
      filter,
      { params }
    );
  }

  getModeratorActivityReport(filterData: any) {
    return this.httpClient.post<ResponsePayload>(
      API_ORDER + 'moderator-activity-report',
      filterData
    );
  }

}
