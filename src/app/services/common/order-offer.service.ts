import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {OrderOffer} from "../../interfaces/common/order-offer.interface";


const API_SHOP_INFO = environment.apiBaseLink + '/api/order-offer/';


@Injectable({
  providedIn: 'root'
})
export class OrderOfferService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addOrderOffer
   * insertManyOrderOffer
   * getAllOrderOffers
   * getOrderOfferById
   * updateOrderOfferById
   * updateMultipleOrderOfferById
   * deleteOrderOfferById
   * deleteMultipleOrderOfferById
   */

  addOrderOffer(data: OrderOffer) {
    return this.httpClient.post<ResponsePayload>
    (API_SHOP_INFO + 'add', data);
  }


  getOrderOffer(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: OrderOffer, message: string, success: boolean }>(API_SHOP_INFO + 'get', {params});
  }

  insertManyOrderOffer(data: OrderOffer, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_SHOP_INFO + 'insert-many', mData);
  }

  getAllOrderOffers(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: OrderOffer[], count: number, success: boolean }>(API_SHOP_INFO + 'get-all', filterData, {params});
  }

  getOrderOfferById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: OrderOffer, message: string, success: boolean }>(API_SHOP_INFO + id, {params});
  }

  updateOrderOfferById(id: string, data: OrderOffer) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_SHOP_INFO + 'update/' + id, data);
  }

  updateMultipleOrderOfferById(ids: string[], data: OrderOffer) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_SHOP_INFO + 'update-multiple', mData);
  }

  deleteOrderOfferById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_SHOP_INFO + 'delete/' + id, {params});
  }

  deleteMultipleOrderOfferById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_SHOP_INFO + 'delete-multiple', {ids: ids}, {params});
  }


}
