import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [RouterModule,HttpClientModule,NavbarComponent,CommonModule,FormsModule],
  providers: [HttpClient]
})
export class SignupComponent {
  signupData = {first_name: '', last_name: '', phone: '', email: '', password: '', confirmPassword: ''};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    this.authService.signup(this.signupData).subscribe({
      next: (response) => {
        this.successMessage = 'Signup successful! Please log in.';
        this.signupData={first_name: '', last_name: '', phone: '', email: '', password: '', confirmPassword: ''};
        window.location.reload();
        
      },
      error: (error) => {
        this.errorMessage = 'Signup failed. Please try again.';
        console.error('Signup failed', error);
      }
    });
  }
}
