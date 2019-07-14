import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaderResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Customer} from "./dto/customer";
import {environment} from "../environments/environment";
import {Page} from "./dto/page";
import {ItemDetail} from "./dto/itemDetail";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  readonly BASE_URL = environment.apiUrl + 'customers';
  constructor(private http: HttpClient) { }
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.BASE_URL);
  }

  deleteCustomer(customerId: string): Observable<null> {
    return this.http.delete<null>(this.BASE_URL + `/${customerId}`);
  }

  saveCustomer(customer: Customer): Observable<string> {
    return this.http.post<string>(this.BASE_URL, customer);
  }
  updateCustomer(customer: Customer): Observable<null> {
    return this.http.put<null>(this.BASE_URL + `/${customer.id}`, customer);
  }

  getCustomerCount(): Observable<HttpResponse<string>>{
    return this.http.head<string>(this.BASE_URL+'?count=true',{observe:"response"});
  }
  getCustomerPage(page: number,size: number): Observable<Page>{
    return this.http.get<Page>(this.BASE_URL,{
      params: new HttpParams().set('page',page + '').set('size',size+'')
    });
  }
}
