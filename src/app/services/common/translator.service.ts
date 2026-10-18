import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Translator } from '../../interfaces/common/translator.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from 'rxjs';

const API_TRANSLATOR = environment.apiBaseLink + '/api/translator/';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  constructor(private httpClient: HttpClient) {}

  addTranslator(data: Translator): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_TRANSLATOR + 'add', data);
  }

  getAllTranslator(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Translator[];
      count: number;
      success: boolean;
      calculation: any;
    }>(API_TRANSLATOR + 'get-all/', filterData, { params });
  }

  getTranslatorById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Translator;
      message: string;
      success: boolean;
    }>(API_TRANSLATOR + id, { params });
  }

  updateTranslatorById(id: string, data: Translator) {
    return this.httpClient.put<{ message: string; success: boolean }>(
      API_TRANSLATOR + 'update/' + id,
      data,
    );
  }

  deleteTranslatorById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(
      API_TRANSLATOR + 'delete/' + id,
      { params },
    );
  }

  deleteMultipleTranslatorById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(
      API_TRANSLATOR + 'delete-multiple',
      { ids: ids },
      { params },
    );
  }
}
