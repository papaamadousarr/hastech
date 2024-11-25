import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SellerDashboardComponent } from './components/seller-dashboard/seller-dashboard.component';
import { LoginComponent } from './client/login/login.component';
import { SignupComponent } from './client/signup/signup.component';
import { SellerLoginComponent } from './seller/login/login.component';
import { SellerSignupComponent } from './seller/signup/signup.component';
import { CartComponent } from './components/cart/cart.component';


export const routes: Routes = [
  { path: '', component: ClientDashboardComponent },  // Route par défaut
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'client/dashboard', component: ClientDashboardComponent},
  { path: 'seller/dashboard', component: SellerDashboardComponent},
  { path: 'placeorder', component: PlaceOrderComponent },
  { path: 'productlist', component: ProductListComponent },
  { path: 'account', component: UserAccountComponent },
  { path: 'addproduct', component: AddProductComponent },
  { path: 'sellerlogin', component: SellerLoginComponent},
  { path: 'sellersignup', component: SellerSignupComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '/login' }  // Catch-all route pour les URLs non définies
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }