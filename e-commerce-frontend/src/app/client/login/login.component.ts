import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from '../signup/signup.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [RouterModule,HttpClientModule,NavbarComponent,CommonModule,FormsModule,SignupComponent],
  providers: [HttpClient]
})
export class LoginComponent {

  isRightPanelActive = false;

  toggleSignUp() {
    this.isRightPanelActive = true;
  }

  toggleSignIn() {
    this.isRightPanelActive = false;
  }

  credentials = { email: '', password: '' };
  errorMessage: string = '';
  isLoading: boolean = false;  // Indicateur pour savoir si la requête est en cours
  isLoggedIn: boolean = false; // Par défaut, l'utilisateur n'est pas connecté


  signupData = {first_name: '', last_name: '', phone: '', email: '', password: '', confirmPassword: ''};
  successMessage: string = '';
  returnUrl: string;

  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  signup() {
    this.authService.signup(this.signupData).subscribe({
      next: (response) => {
        this.successMessage = 'Signup successful! Please log in.';
        this.router.navigate(['/login']).then(() => {
          window.location.reload();
        }); 
        this.signupData={first_name: '', last_name: '', phone: '', email: '', password: '', confirmPassword: ''};
      },
      error: (error) => {
        this.errorMessage = 'Signup failed. Please try again.';
        console.error('Signup failed', error);
      }
    });
  }

  login() {
    console.log('Tentative de connexion...'); // Log de début
    this.errorMessage = '';
    this.isLoading = true;
  
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Réponse de l\'API:', response); // Vérifier la réponse
        const role = this.authService.getRole();
        console.log('Rôle utilisateur:', role); // Vérifier le rôle obtenu
        
        if (role === 'client') {
          this.router.navigate(['/client/dashboard']);
        } else if (role === 'seller') {
          this.router.navigate(['/seller/dashboard']);
          return
        }
  
        if (this.returnUrl) {
          console.log('Redirection vers:', this.returnUrl); // Vérifier l'URL de retour
          this.router.navigateByUrl(this.returnUrl);
        } else {
          console.log('Redirection vers le tableau de bord client par défaut.');
          this.router.navigate(['/client/dashboard']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error('Erreur de connexion:', error); // Log d'erreur
      },
      complete: () => {
        this.isLoading = false;
        console.log('Connexion terminée'); // Log de fin
      }
    });
  }  
}  
