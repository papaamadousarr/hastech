import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service'; // Import UserService
import { MatIconModule } from '@angular/material/icon';



@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule,MatIconModule]
})
export class AccountComponent implements OnInit {
    user: any = {
        name: '',
        email: '',
        phone: '',
        addresses: []
    };
    isAdmin: boolean = false;
    orders: any[] = [];
    newAddress: string = ''; // Changed to string for simplicity

    constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

    ngOnInit() {
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin');
        this.isAdmin = isAdmin === 'true';
        
        console.log('Init - Token:', !!token, 'IsAdmin:', this.isAdmin);
    
        if (!token) {
            this.router.navigate(['/login-signup']);
            return;
        }
    
        // Load user profile first
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.userService.getUserProfile().subscribe({
            next: (response: any) => {
                this.user = response;
                console.log('User Profile:', response);
                
                // Set admin status
                this.isAdmin = response.email === 'lohassan123@gmail.com';
                localStorage.setItem('isAdmin', this.isAdmin.toString());
                
                // Load orders after profile is loaded
                this.loadUserOrders();
            },
            error: (error) => {
                console.error('Profile loading error:', error);
                if (error.status === 401 || error.status === 404) {
                    localStorage.clear(); // Clear stored data
                    this.router.navigate(['/login-signup']);
                }
            }
        });
    }
    
    updateProfile() {
        this.userService.updateUserProfile(this.user).subscribe({
            next: (response) => {
                console.log('Profile updated successfully', response);
            },
            error: (error) => {
                console.error('Error updating profile', error);
            }
        });
    }

    loadUserOrders() {
        const token = localStorage.getItem('token');
        this.http.get(`http://localhost:3000/user/orders`, {
            headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
            next: (response: any) => {
                this.orders = response.orders;
                console.log('Orders loaded:', this.orders);
            },
            error: (error) => {
                console.error('Error loading orders:', error);
            }
        });
    }

    addAddress() {
        const token = localStorage.getItem('token');
        this.http.post('http://localhost:3000/user/address', { fullAddress: this.newAddress }, {
            headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
            next: (response) => {
                console.log('Address added successfully', response);
                this.loadUserProfile();
                this.newAddress = '';
            },
            error: (error) => {
                console.error('Error adding address', error);
            }
        });
    }

    deleteAddress(addressId: string) {
        const token = localStorage.getItem('token');
        this.http.delete(`http://localhost:3000/user/address/${addressId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
            next: (response) => {
                console.log('Address deleted successfully', response);
                this.loadUserProfile();
            },
            error: (error) => {
                console.error('Error deleting address', error);
            }
        });
    }

    // Optional: Implement editAddress if needed
    editAddress(addressId: string) {
        console.log(`Editing address: ${addressId}`);
        // Implement address editing logic
    }
}