import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

// Import services
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { OrderService } from './services/order.service';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './client/login/login.component';
import { SignupComponent } from './client/signup/signup.component';
import { SellerLoginComponent } from './seller/login/login.component';
import { SellerSignupComponent } from './seller/signup/signup.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SellerDashboardComponent } from './components/seller-dashboard/seller-dashboard.component';
import { CartComponent } from './components/cart/cart.component';


 export const routes: Routes = [
    { path: '', component: NavbarComponent,pathMatch: 'full' },  // Route par défaut
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'client/dashboard', component: ClientDashboardComponent},
    { path: 'seller/dashboard', component: SellerDashboardComponent},
    { path: 'placeorder', component: PlaceOrderComponent },
    { path: 'productlist', component: ProductListComponent },
    { path: 'addproduct', component: AddProductComponent },
    { path: 'sellerlogin', component: SellerLoginComponent},
    { path: 'sellersignup', component: SellerSignupComponent },
    { path: 'cart', component: CartComponent },
    { path: '**', redirectTo: '/login',pathMatch: 'full' }  // Catch-all route pour les URLs non définies
  ];
  
@NgModule({
  declarations: [
    // Declare non-standalone components if any
  ],
  imports: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),  // Use the imported routes here
  ],
  providers: [
    ProductService,
    CartService,
    AuthService,
    OrderService,
    AuthInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

    // Other services if needed
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  static routes: Routes;
}
