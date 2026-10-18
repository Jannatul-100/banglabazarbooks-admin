import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {OrderDashboard, SaleDashboard} from '../../interfaces/common/dashboard.interface';
import {Observable} from "rxjs";

const API_DASHBOARD = environment.apiBaseLink + '/api/dashboard/';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getSalesDashboard(userId?: string) {
    return this.httpClient.get<{ data: SaleDashboard, message: string, success: boolean }>(API_DASHBOARD + 'admin-dashboard');
  }

  getOrderDashboard() {
    return this.httpClient.get<{ data: OrderDashboard, message: string, success: boolean }>(API_DASHBOARD + 'order-dashboard');
  }

  // Method to get sales data by period
  getSalesData(period: string): Observable<any> {
    return this.httpClient.get(API_DASHBOARD + `sales?period=${period}`);
  }
  // getSalesData(period: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}?period=${period}`);
  // }
}
