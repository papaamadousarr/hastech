 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="addresses-section">
      <h2>My Addresses</h2>
      <div *ngIf="successMessage" class="success-message">{{successMessage}}</div>
      <div *ngIf="errorMessage" class="error-message">{{errorMessage}}</div>

      <!-- Add New Address Form -->
      <form (ngSubmit)="addAddress()" #addressForm="ngForm" class="address-form">
        <div class="form-group">
          <label>New Address</label>
          <textarea [(ngModel)]="newAddress" name="address" required></textarea>
        </div>
        <button type="submit" [disabled]="!addressForm.valid">Add Address</button>
      </form>

      <!-- Address List -->
      <div class="address-list">
        <div *ngFor="let address of addresses" class="address-item">
          <p>{{address.fullAddress}}</p>
          <div class="address-actions">
            <button (click)="editAddress(address)">Edit</button>
            <button (click)="deleteAddress(address._id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];
  newAddress: string = '';
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.userService.getUserProfile().subscribe({
      next: (data: any) => {
        this.addresses = data.addresses || [];
      },
      error: (error) => {
        this.errorMessage = 'Failed to load addresses';
      }
    });
  }

  addAddress() {
    this.userService.addAddress(this.newAddress).subscribe({
      next: (response) => {
        this.successMessage = 'Address added successfully';
        this.newAddress = '';
        this.loadAddresses();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to add address';
      }
    });
  }

  deleteAddress(addressId: string) {
    this.userService.deleteAddress(addressId).subscribe({
      next: () => {
        this.successMessage = 'Address deleted successfully';
        this.loadAddresses();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete address';
      }
    });
  }

  editAddress(address: any) {
    // Implement edit functionality
    console.log('Editing address:', address);
  }
}