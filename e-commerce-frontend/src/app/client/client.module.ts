import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OrderService } from '../services/order.service';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../app.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AppComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    BrowserModule,

  ],
  providers: [
    OrderService,// Provide OrderService at the module level
    HttpClientModule,
    HttpClient,
  ],
  bootstrap: [AppComponent],

  exports: [
    LoginComponent,
    SignupComponent
  ]
})
export class ClientModule {}