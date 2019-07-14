import {Component, OnInit, ViewChild} from '@angular/core';
import {Order} from "../dto/order";
import {CustomerService} from "../customer.service";
import {Customer} from "../dto/customer";
import {Item} from "../dto/item";
import {ItemService} from "../item.service";
import {ItemDetail} from "../dto/itemDetail";
import {NgForm} from "@angular/forms";
import {OrderService} from "../order.service";


@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

      customers: Array<Customer> = [];
      items: Array<Item> = [];
      showTableFoot = true;
      currentCustomer = new Customer('', '', '');
      currentItem = new Item('', '', '', '');
      // itemDetail=new ItemDetail('', '', '' ,'','');
  today: Date = new Date();
  itemDetails: Array<ItemDetail> = [];
      selectedItem=new Item('', '', '', '');
      buttonText ='Add';
      total: number=0.00;
      orderId= null;
      quantity = null;
      hoverItem = null;
      quntityobject = {
      quantityInvalid: false,
      quantityValid: true

    }
  @ViewChild('frmOrder', {static: false}) frmOrder: NgForm;

  constructor(private customerservice: CustomerService, private itemservice: ItemService, private orderservice: OrderService) {
  }

  ngOnInit() {
    this.customerservice.getAllCustomers().subscribe(customers => {
      this.customers = customers;
      this.showTableFoot = false;
    }, error1 => {
      this.showTableFoot = true;
      console.log(error1);
    });
    this.itemservice.getAllItems().subscribe(items => {
      this.items = items;
      this.showTableFoot = false;
    }, error1 => {
      this.showTableFoot = true;
      console.log(error1);
    });

    this.generateOrderId();
  }
generateOrderId(){
  this.orderservice.getMaxOrderId().subscribe(resp =>{

    let ordId=resp.headers.get('maxOrderId');
console.log(ordId);
    if(ordId ==='null'){
      ordId="D000";
    }
    let idsubs = parseInt(ordId.substr(1,3));

    if (idsubs < 9) {
      this.orderId='D00' + ++idsubs;
    } else if (idsubs < 99) {
      this.orderId='D0' + ++idsubs;
    } else if (idsubs > 999) {
      this.orderId='D' + ++idsubs;
    }
  });
}
  totalCounter(){
    for (let detail of this.itemDetails) {
console.log(detail.qty);
      this.total+=parseInt(detail.unitPrice)*parseInt(detail.qty);

    }

  }
  addOrder(): void {
      if (this.currentCustomer.id.trim().length !== 0) {
        if (this.quntityobject.quantityValid && (this.quantity != null) && (this.currentItem.code.trim().length !== 0)) {
console.log(this.selectedItem.code.trim().length);
console.log(this.buttonText);


            if (this.itemDetails.find(x => x.itemCode === this.currentItem.code) == null && this.buttonText !== 'Update') {
              
              let itemDetail = new ItemDetail(this.orderId, this.currentItem.code, this.quantity, this.currentItem.unitPrice, this.currentItem.description);
              console.log(itemDetail);
              console.log(this.quantity);
              this.itemDetails.push(itemDetail);
              this.items.find(x => x.code === this.currentItem.code).qtyOnHand = (parseInt(this.items.find(x => x.code === this.currentItem.code).qtyOnHand) - parseInt(this.quantity)).toString();
            } else {

              if (this.itemDetails.find(x => x.itemCode === this.currentItem.code).qty.trim().length == 0) {
                this.itemDetails.find(x => x.itemCode === this.currentItem.code).qty = this.quantity;
                this.items.find(x => x.code === this.currentItem.code).qtyOnHand = (parseInt(this.items.find(x => x.code === this.currentItem.code).qtyOnHand) - parseInt(this.quantity)).toString();
                this.buttonText = 'Add';
                this.selectedItem.code='';
              } else if(this.buttonText !== 'update'){
                this.itemDetails.find(x => x.itemCode === this.currentItem.code).qty = (parseInt(this.itemDetails.find(x => x.itemCode === this.currentItem.code).qty) + parseInt(this.quantity)).toString();
                this.items.find(x => x.code === this.currentItem.code).qtyOnHand = (parseInt(this.items.find(x => x.code === this.currentItem.code).qtyOnHand) - parseInt(this.quantity)).toString();
              }else{
                alert("Please update item first");
                this.currentItem = new Item('', '', '', '');
                this.quantity = null;

              }
            }

          this.total = 0.00;
          this.totalCounter();

          this.currentItem = new Item('', '', '', '');
          this.quantity = null;
          // }else{
          //   alert("Please update item first");
          //   this.quantity = null;
          // }
        } else {
          if(this.currentItem.code.trim().length == 0){
            alert("please select a item");
          }
          alert("please enter a valid quantity");
        }
      } else {
        alert("please add customer...!");
      }

  }
  itemSelect() {
    this.quantity=null;
  }
      quantityCheck() {

        if (parseInt(this.items.find(x => x.code === this.currentItem.code).qtyOnHand) < (parseInt(this.quantity))) {
          this.quntityobject.quantityValid = false;
          this.quntityobject.quantityInvalid = true;

        } else {
          this.quntityobject.quantityValid = true;
          this.quntityobject.quantityInvalid = false;

        }
      }

  mouseEnter(itemDatail: ItemDetail): void {
    this.hoverItem = itemDatail;
  }

  mouseExit(itemDatail: ItemDetail): void {
    this.hoverItem = null;
  }
  getTrashClasses(itemDatail: ItemDetail) {
    return {
      fa: true,
      'fa-trash': this.hoverItem !== itemDatail,
      'fa-trash-o': this.hoverItem === itemDatail
    };
  }
  deleteItem(index: number ,itemDetail: ItemDetail): void{
    this.itemDetails.splice(index,1);
    this.items.find(x => x.code === itemDetail.itemCode).qtyOnHand=(parseInt(this.items.find(x => x.code === itemDetail.itemCode).qtyOnHand)+(parseInt(itemDetail.qty))).toString();
    this.total=0.00;
    this.totalCounter();
    if(this.buttonText==='Update'){
      this.buttonText='Add';
    }
  }

  onRowClick(i: number ,itemDetail: ItemDetail): void{
    this.currentItem.code=itemDetail.itemCode;
    this.currentItem.description=itemDetail.description;
    this.items.find(x => x.code === itemDetail.itemCode).qtyOnHand=(parseInt(itemDetail.qty)+parseInt(this.items.find(x => x.code === itemDetail.itemCode).qtyOnHand)).toString()
    this.currentItem.qtyOnHand=this.items.find(x => x.code === itemDetail.itemCode).qtyOnHand;
    this.currentItem.unitPrice=itemDetail.unitPrice;
    this.total-=parseInt(itemDetail.unitPrice)*parseInt(itemDetail.qty);
    this.itemDetails.find(x => x.itemCode === itemDetail.itemCode).qty='';
    this.selectedItem.code=itemDetail.itemCode;


    this.buttonText='Update';
  }
  saveOrder(): void {

    let date=this.today.getFullYear()+'-'+this.today.getMonth()+'-'+this.today.getDate();
    let orders = new Order('', '', '', ItemDetail[0],0);
    orders.id=this.orderId;
    orders.customer_id=this.currentCustomer.id;
    orders.date=date;
    orders.itemDetailDTOS=this.itemDetails;
    this.orderservice.saveOrder(orders).subscribe(resp =>{
           alert("Order successfully installed");
      this.currentItem = new Item('', '', '', '');
      this.selectedItem.code='';
      this.currentCustomer = new Customer('', '', '')
      this.itemDetails.splice(0,this.itemDetails.length);
      this.quantity = null;
      this.total=0.00;
      this.generateOrderId();
         }, error1 => {
           alert("Order not successfully installed");
         });
  }
}

