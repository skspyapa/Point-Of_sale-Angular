import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Item} from "../dto/item";
import {NgForm} from "@angular/forms";
import {ItemService} from "../item.service";
import {Customer} from "../dto/customer";

@Component({
  selector: 'app-manage-item',
  templateUrl: './manage-item.component.html',
  styleUrls: ['./manage-item.component.scss']
})
export class ManageItemComponent implements OnInit {
  items: Array<Item> = [];
  showTableFoot = true;
  currentItem = new Item('', '', '', '');
  selectedItem = null;
  hoverItem = null;
  buttonText = 'Save';
  @ViewChild('txtCode', {static: false}) txtCode: ElementRef;
  @ViewChild('frmItem', {static: false}) frmItem: NgForm;
  loadingStatus = true;
  page = 0;
  readonly pageSize = 5;
  customersCount = 20;
  constructor(private itemservice: ItemService) { }

  ngOnInit() {
    this.itemservice.getAllItems().subscribe(items => {
      console.log(items);
      this.items = items;
      this.showTableFoot = false;
    }, error1 => {
      this.showTableFoot = true;
      console.log(error1);
    });
  }
  onRowClick(item: Item): void {
    this.buttonText = 'Update';
    this.currentItem = Object.assign({}, item );
    this.selectedItem = item;
  }

  mouseEnter(item: Item): void {
    this.hoverItem = item;
  }

  mouseExit(item: Item): void {
    this.hoverItem = null;
  }

  getTrashClasses(item: Item) {
    return {
      fa: true,
      'fa-trash': this.hoverItem !== item,
      'fa-trash-o': this.hoverItem === item
    };
  }
  deleteItem(item: Item): void {
    if (confirm('Are you sure whether you want to delete this customer?')) {
      this.itemservice.deleteItem(item.code).subscribe(resp => {
          alert('Customer deleted successfully');
          const index = this.items.indexOf(item);
          this.items.splice(index, 1);
          this.currentItem = new Item('', '', '', '');
        },
        error1 => {
          alert('Failed to delete the Item for some reason, please check the console...!');
          console.log(error1);
        });
    }
  }

  clearForm(): void {
    this.currentItem = new Item('', '', '', '');
    this.txtCode.nativeElement.focus();
    this.buttonText = 'Save';
    this.frmItem.resetForm();
  }

  saveItem(): void {
    if (this.frmItem.valid) {
      if (this.buttonText === 'Save') {
        console.log(this.currentItem);
        this.itemservice.saveItem(this.currentItem).subscribe(resp => {
          alert('Customer has been saved successfully');
          this.items.push(this.currentItem);
          this.clearForm();
        }, error1 => {
          alert('Failed to save the customer');
          console.log(error1);
        });
      } else {
        this.itemservice.updateItem(this.currentItem).subscribe(resp => {
          Object.assign(this.selectedItem, this.currentItem);
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
    this.items = [];
    this.loadingStatus = true;
    this.itemservice.getItemPage($event - 1, this.pageSize)
      .subscribe(page => {
        this.customersCount = page.page.totalElements;
        this.showTableFoot = false;
        setTimeout(() => {
          this.loadingStatus = false;
          this.items = page.content as Array<Item>;
        }, 100);
      }, error1 => {
        this.loadingStatus = false;
        this.showTableFoot = true;
        console.log(error1);
      });
  }
}
