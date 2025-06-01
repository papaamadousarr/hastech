import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent {
  isLogin = true;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false; // Add this flag to prevent double submission

  loginData: LoginData = {
    email: '',
    password: ''
  };

  signupData: SignupData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onLogin(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Attempting login with:', this.loginData);

    this.authService.login(this.loginData).subscribe({
        next: (response: any) => {
            console.log('Login successful:', response);
            
            if (!response || !response.token) {
                this.errorMessage = 'Invalid login response';
                this.isSubmitting = false;
                return;
            }

            // Store the token and user data
            localStorage.setItem('token', response.token);
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                const isAdmin = response.user.isAdmin || response.user.email === 'lohassan123@gmail.com';
                localStorage.setItem('isAdmin', isAdmin.toString());
            }

            this.successMessage = 'Login successful!';
            
            // Navigate directly without checking profile
            setTimeout(() => {
                window.location.href = '/account';
            }, 1000);
        },
        error: (error: any) => {
            console.error('Login error:', error);
            this.errorMessage = typeof error === 'string' ? error : 'Login failed';
            this.isSubmitting = false;
        }
    });
}
  onSignup(): void {
    // Validate form data
    if (!this.validateSignupData()) {
      return;
    }

    // Prevent double submission
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Attempting signup with:', this.signupData);

    this.authService.signup(this.signupData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.isLogin = true;
        this.successMessage = 'Registration successful! Please check your email for confirmation.';
        
        // Clear the form
        this.signupData = {
          name: '',
          email: '',
          password: ''
        };
        
        // Add a delay before redirecting to login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: string) => {
        console.error('Signup error:', error);
        this.errorMessage = error;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  // Add form validation
  private validateSignupData(): boolean {
    this.errorMessage = '';

    if (!this.signupData.name.trim()) {
      this.errorMessage = 'Name is required';
      return false;
    }

    if (!this.signupData.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signupData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (!this.signupData.password) {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    return true;
  }

  // Helper method to clear messages
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Method to switch between login and signup
  toggleForm(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginData = {
      email: '',
      password: ''
    };
    this.signupData = {
      name: '',
      email: '',
      password: ''
    };
    this.clearMessages();
    this.isSubmitting = false;
  }
}