import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Order} from "./dto/order";
import {Page} from "./dto/page";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  readonly BASE_URL = environment.apiUrl + 'orders';
  constructor(private http: HttpClient) { }
  // getAllOrders(): Observable<Order[]> {
  //   return this.http.get<Order[]>(this.BASE_URL+'?q=a');
  // }
  // getOrder(string: string ): Observable<Order[]> {
  //   return this.http.get<Order[]>(this.BASE_URL+'?q='+`${string}`);
  // }
  getOrderPage(page: number,size: number,string: string): Observable<Page>{
    return this.http.get<Page>(this.BASE_URL,{
      params: new HttpParams().set('q',string).set('page',page + '').set('size',size+'')
    });
  }
}
