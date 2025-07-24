import { RouterModule, Routes } from '@angular/router';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { AccountComponent } from './account/account.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductUploadComponent } from './product-upload/product-upload.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { AddressesComponent } from './account/addresses/addresses.component'; 
import { NgModule } from '@angular/core';
import { VehicleSearchComponent } from './vehicle-search/vehicle-search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { GlobalSearchResultsComponent } from './global-search-results/global-search-results.component';
import { VehicleModelSelectionComponent } from './vehicle-model-selection/vehicle-model-selection.component';
import { VehicleBrandSelectionComponent } from './vehicle-brand-selection/vehicle-brand-selection.component';
import { AllCarBrandsComponent } from './all-car-brands/all-car-brands.component';
import { VehicleModelDetailComponent } from './vehicle-model-detail/vehicle-model-detail.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'login-signup',
    component: LoginSignupComponent
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  { path: 'account/profile', component: ProfileComponent },
  { path: 'account/change-password', component: ChangePasswordComponent },
  { path: 'account/addresses', component: AddressesComponent },
  {
    path: 'category/:id',
    component: ProductCategoryComponent,
    data: { renderMode: 'dynamic' }
  },
  {
    path: 'category/:id/:subcategoryId',
    component: ProductCategoryComponent,
    data: { renderMode: 'dynamic' }
  },
  {
    path: 'account/product-management',
    component: ProductUploadComponent,
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'account/product-upload',
    component: ProductUploadComponent,
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  { path: 'vehicle-search', component: VehicleSearchComponent },
  { path: 'search', component: GlobalSearchResultsComponent }, // Nouvelle recherche unifiée
  { path: 'parts', component: SearchResultsComponent },
  { path: 'search-results', component: SearchResultsComponent },
  {
    path: 'vehicle-models/:brandId',
    component: VehicleModelSelectionComponent
  },
  {
    path: 'vehicle-brands',
    component: VehicleBrandSelectionComponent
  },
  {
    path: 'all-car-brands',
    component: AllCarBrandsComponent
  },
  {
    path: 'product/:code',
    component: ProductDetailComponent,
    data: { renderMode: 'dynamic' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}