import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Comment} from '../../interfaces/common/comment.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';


const API_REVIEW_CONTROL = environment.apiBaseLink + '/api/activities-comment/';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesCommentService {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * Comment Control
   */

  addComment(data: Comment) {
    return this.httpClient.post<{ message: string }>(API_REVIEW_CONTROL + 'add', data);
  }

  addCommentByAdmin(data: Comment) {
    return this.httpClient.post<{ message: string }>(API_REVIEW_CONTROL + 'add-by-admin', data);
  }


  getAllComments() {
    return this.httpClient.get<{data: Comment[], message?: string}>(API_REVIEW_CONTROL + 'get-all-activitiesComment');
  }

  // getCommentByCommentId(id: string) {
  //   return this.httpClient.get<{data: Comment, message?: string}>(API_REVIEW_CONTROL + 'get-comment-by-comment-id/' + id);
  // }


  getCommentByCommentId(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Comment, message: string, success: boolean }>(API_REVIEW_CONTROL + id, {params});
  }

  editComment(data: Comment) {
    return this.httpClient.put<{ message: string }>(API_REVIEW_CONTROL + 'update', data);
  }

  updateCommentAndDelete(data: Comment) {
    return this.httpClient.put<{ message: string }>(API_REVIEW_CONTROL + 'update-and-activitiesComment-remove', data);
  }

  deleteCommentByCommentId(id: string) {
    return this.httpClient.delete<{message?: string}>(API_REVIEW_CONTROL + 'delete/' + id);
  }

  getAllCommentsByQuery(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Comment[], count: number, success: boolean }>(API_REVIEW_CONTROL + 'get-all-comment-by-query', filterData, {params});
  }

}
