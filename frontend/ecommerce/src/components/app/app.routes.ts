import { Routes } from '@angular/router';

import { Login } from '../login/login';
import { Register } from '../register/register';
import { CustomerCatalogue } from '../customer/customer-catalogue/customer-catalogue';
import { CustomerCart } from '../customer/customer-cart/customer-cart';
import { Checkout } from '../checkout/checkout';
import { OrderHistory } from '../order-history/order-history';
import { AdminProducts } from '../admin/admin-products/admin-products';
import { adminGuard, customerGuard, authGuard } from '../../guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'customer/catalogue',
    component: CustomerCatalogue,
    canActivate: [customerGuard]
  },

  {
    path: 'customer/cart',
    component: CustomerCart,
    canActivate: [customerGuard]
  },

  {
    path: 'customer/orders/place',
    component: Checkout,
    canActivate: [customerGuard]
  },

  {
    path: 'customer/orders',
    component: OrderHistory,
    canActivate: [customerGuard]
  },

  {
    path: 'admin/products',
    component: AdminProducts,
    canActivate: [adminGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
