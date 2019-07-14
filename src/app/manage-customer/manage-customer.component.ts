import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Customer} from "../dto/customer";
import {NgForm} from "@angular/forms";
import {CustomerService} from "../customer.service";
import {ItemDetail} from "../dto/itemDetail";

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss']
})
export class ManageCustomerComponent implements OnInit {
  customers: Array<Customer> = [];
  showTableFoot = true;
  currentCustomer = new Customer('', '', '');
  selectedCustomer = null;
  hoverCustomer = null;
  buttonText = 'Save';
  @ViewChild('txtId', {static: false}) txtId: ElementRef;
  @ViewChild('frmCustomer', {static: false}) frmCustomer: NgForm;
  loadingStatus = true;
  page = 0;
  readonly pageSize = 5;
  customersCount = 20;
  constructor(private customerservice: CustomerService) { }

  ngOnInit() {

  }

  onRowClick(customer: Customer): void {
    this.buttonText = 'Update';
    this.currentCustomer = Object.assign({}, customer );
    this.selectedCustomer = customer;
  }

  mouseEnter(customer: Customer): void {
    this.hoverCustomer = customer;
  }

  mouseExit(customer: Customer): void {
    this.hoverCustomer = null;
  }

  getTrashClasses(customer: Customer) {
    return {
      fa: true,
      'fa-trash': this.hoverCustomer !== customer,
      'fa-trash-o': this.hoverCustomer === customer
    };
  }

  deleteCustomer(customer: Customer): void {
    this.clearForm();
    if (confirm('Are you sure whether you want to delete this customer?')) {
      this.customerservice.deleteCustomer(customer.id).subscribe(resp => {
          alert('Customer deleted successfully');
          const index = this.customers.indexOf(customer);
          this.customers.splice(index, 1);
          this.currentCustomer = new Customer('', '', '');
        },
        error1 => {
          alert('Failed to delete the customer for some reason, please check the console...!');
          console.log(error1);
        });
    }
  }

  clearForm(): void {
    this.currentCustomer = new Customer('', '', '');
    this.txtId.nativeElement.focus();
    this.buttonText = 'Save';
    this.frmCustomer.resetForm();
  }

  saveCustomer(): void {
    if (this.frmCustomer.valid) {
      if (this.buttonText === 'Save') {
        console.log(this.currentCustomer);
        this.customerservice.saveCustomer(this.currentCustomer).subscribe(resp => {
          alert('Customer has been saved successfully');
          this.customers.push(this.currentCustomer);
          this.clearForm();
        }, error1 => {
          alert('Failed to save the customer');
          console.log(error1);
        });
      } else {
        this.customerservice.updateCustomer(this.currentCustomer).subscribe(resp => {
          Object.assign(this.selectedCustomer, this.currentCustomer);
          alert('Customer Updated Successfully');
          this.clearForm();
        }, error1 => {
          alert('Failed to Update Customer');
          console.log(error1);
        });
      }
    } else {
      alert('Please enter correct date before submitting');
    }
  }
  onPageChange($event: number) {
    this.customers = [];
    this.loadingStatus = true;
    this.customerservice.getCustomerPage($event - 1, this.pageSize)
      .subscribe(page => {
        this.customersCount = page.page.totalElements;
        this.showTableFoot = false;
        setTimeout(() => {
          this.loadingStatus = false;
          this.customers = page.content as Array<Customer>;
        }, 100);
      }, error1 => {
        this.loadingStatus = false;
        this.showTableFoot = true;
        console.log(error1);
      });
  }
}
