import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../customer.service";
import {ItemService} from "../item.service";
import {OrderService} from "../order.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
customerCount: string = "0";
itemCount: string ="0";
orderCount: string="0";
  constructor(private customerservice: CustomerService, private itemservice: ItemService,private orderservice: OrderService) { }

  ngOnInit() {
    this.customerservice.getCustomerCount().subscribe(resp =>{
      console.log(resp);
      this.customerCount=resp.headers.get('Customer-Count');
    });

    this.itemservice.getItemCount().subscribe(resp =>{
      this.itemCount=resp.headers.get('Item-Count');
    });

    this.orderservice.getOrderCount().subscribe(resp =>{
      this.orderCount=resp.headers.get('Order-Count');
    });
  }
}
