import { Component, OnInit } from '@angular/core';
import {SearchService} from "../search.service";
import {Order} from "../dto/order";
import {Customer} from "../dto/customer";

@Component({
  selector: 'app-search-order',
  templateUrl: './search-order.component.html',
  styleUrls: ['./search-order.component.scss']
})
export class SearchOrderComponent implements OnInit {

  constructor(private searchorder: SearchService) { }
  showTableFoot = true;
  orders: Array<Order> =[];
  searchString='';
  loadingStatus = true;
  page = 0;
  readonly pageSize = 5;
  customersCount = 20;
  typing=false;
  ngOnInit() {
    // this.searchorder.getAllOrders().subscribe(orders =>{
    //   this.showTableFoot = false;
    //   this.orders=orders;
    // },error1 => {
    //   this.showTableFoot = true;
    //   console.log(error1);
    // });
  }
    // getOrder() {
    //  this.typing=true;
    //     this.searchorder.getOrder(this.searchString).subscribe(orders =>{
    //       if(orders.length==0){
    //         this.orders=null;
    //         this.showTableFoot=true;
    //       }else {
    //         this.showTableFoot = false;
    //         this.orders=orders;
    //       }
    //     },error1 => {
    //       this.showTableFoot = true;
    //       console.log(error1);
    //     });
    // }
  onPageChange($event: number) {
    this.orders = [];
    this.loadingStatus = true;
    this.searchorder.getOrderPage($event - 1, this.pageSize,this.searchString)
      .subscribe(page => {
        this.customersCount = page.page.totalElements;
        this.showTableFoot = false;
        setTimeout(() => {
          this.loadingStatus = false;
          this.orders = page.content as Array<Order>;
        }, 100);
      }, error1 => {
        this.loadingStatus = false;
        this.showTableFoot = true;
        console.log(error1);
      });
  }

}

