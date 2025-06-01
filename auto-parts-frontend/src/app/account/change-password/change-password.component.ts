 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="change-password-form">
      <h2>Change Password</h2>
      <div *ngIf="successMessage" class="success-message">{{successMessage}}</div>
      <div *ngIf="errorMessage" class="error-message">{{errorMessage}}</div>
      
      <form (ngSubmit)="onSubmit()" #passwordForm="ngForm">
        <div class="form-group">
          <label>Current Password</label>
          <input type="password" [(ngModel)]="passwordData.currentPassword" 
                 name="currentPassword" required>
        </div>

        <div class="form-group">
          <label>New Password</label>
          <input type="password" [(ngModel)]="passwordData.newPassword" 
                 name="newPassword" required minlength="6">
        </div>

        <div class="form-group">
          <label>Confirm New Password</label>
          <input type="password" [(ngModel)]="passwordData.confirmPassword" 
                 name="confirmPassword" required>
        </div>

        <button type="submit" [disabled]="!passwordForm.valid">Change Password</button>
      </form>
    </div>
  `,
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  onSubmit() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    this.userService.changePassword(this.passwordData).subscribe({
      next: (response) => {
        this.successMessage = 'Password changed successfully';
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to change password';
      }
    });
  }
}