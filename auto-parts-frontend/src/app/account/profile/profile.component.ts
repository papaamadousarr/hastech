 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-form">
      <h2>Update Profile</h2>
      <div *ngIf="successMessage" class="success-message">{{successMessage}}</div>
      <div *ngIf="errorMessage" class="error-message">{{errorMessage}}</div>
      
      <form (ngSubmit)="onSubmit()" #profileForm="ngForm">
        <div class="form-group">
          <label>Name</label>
          <input type="text" [(ngModel)]="user.name" name="name" required>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="user.email" name="email" required>
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input type="tel" [(ngModel)]="user.phone" name="phone">
        </div>

        <button type="submit" [disabled]="!profileForm.valid">Update Profile</button>
      </form>
    </div>
  `,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {
    name: '',
    email: '',
    phone: ''
  };
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getUserProfile().subscribe({
      next: (data: any) => {
        this.user = data;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile';
      }
    });
  }

  onSubmit() {
    this.userService.updateUserProfile(this.user).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile';
      }
    });
  }
}