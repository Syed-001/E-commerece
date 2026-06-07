import { Routes } from '@angular/router';

import { Login } from '../login/login';
import { Register } from '../register/register';
import { CustomerCatalogue } from '../customer/customer-catalogue/customer-catalogue';
import { CustomerCart } from '../customer/customer-cart/customer-cart';
import { Checkout } from '../checkout/checkout';
import { OrderHistory } from '../order-history/order-history';

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

    { path: 'register', 
      component: Register 
    },

    { path: 'customer/catalogue', 
      component: CustomerCatalogue,
    },

    { path: 'customer/cart',
      component: CustomerCart,
    },

    { path: 'customer/orders/place',
      component: Checkout,
    },

    { path: 'customer/orders',
      component: OrderHistory,
    }

];