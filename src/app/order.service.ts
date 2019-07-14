import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {ItemDetail} from "./dto/itemDetail";
import {Order} from "./dto/order";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  readonly BASE_URL = environment.apiUrl + 'orders';
  constructor(private http: HttpClient) { }
  getMaxOrderId(): Observable<HttpResponse<string>> {
    return this.http.head<string>(this.BASE_URL+'?maxOrderId=true',{observe:"response"});
  }
  saveOrder(order: Order ): Observable<string> {
    return this.http.post<string>(this.BASE_URL,order);
  }
  getOrderCount(): Observable<HttpResponse<string>>{
    return this.http.head<string>(this.BASE_URL+'?count=true',{observe:"response"});
  }
}
