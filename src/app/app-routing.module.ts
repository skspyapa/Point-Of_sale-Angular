import {Component, NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManageCustomerComponent} from "./manage-customer/manage-customer.component";
import {ManageItemComponent} from "./manage-item/manage-item.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ManageOrderComponent} from "./manage-order/manage-order.component";
import {SearchOrderComponent} from "./search-order/search-order.component";

const routes: Routes = [
  {
    component: ManageCustomerComponent,
    path: 'customer'
  },
  {
    component: ManageItemComponent,
    path: 'item'
  },
  {
    component: DashboardComponent,
    path: 'dashboard'
  },
  {
    component: ManageOrderComponent,
    path: 'order'
  },
  {
    component:SearchOrderComponent,
    path:'search'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
