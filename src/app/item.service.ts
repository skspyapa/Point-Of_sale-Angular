import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {Item} from "./dto/item";
import {Customer} from "./dto/customer";
import {Page} from "./dto/page";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  readonly BASE_URL = environment.apiUrl + 'items';
  constructor(private http: HttpClient) { }
  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.BASE_URL);
  }

  deleteItem(itemCode: string): Observable<null> {
    return this.http.delete<null>(this.BASE_URL + `/${itemCode}`);
  }

  saveItem(item: Item): Observable<string> {
    return this.http.post<string>(this.BASE_URL, item);
  }
  updateItem(item: Item): Observable<null> {
    return this.http.put<null>(this.BASE_URL + `/${item.code}`, item);
  }

  getItemCount(): Observable<HttpResponse<string>>{
    return this.http.head<string>(this.BASE_URL+'?count=true',{observe:"response" });
  }
  getItemPage(page: number,size: number): Observable<Page>{
    return this.http.get<Page>(this.BASE_URL,{
      params: new HttpParams().set('page',page + '').set('size',size+'')
    });
  }
}
