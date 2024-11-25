import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-user-account',
  standalone: true,
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss',
  imports: [
    AppComponent,
    CommonModule,
    NavbarComponent,
    FormsModule // Ensure FormsModule is imported here
  ]
})
export class UserAccountComponent {
  content: { icon: string; text: string } | null = null;

  changeContent(section: string): void {
    console.log('Section selected:', section);  // Cela vous permettra de vérifier si la méthode est bien appelée
    switch (section) {
      case 'orders':
        this.content = { icon: '🛒', text: 'Mes commandes' };
        break;
      case 'discounts':
        this.content = { icon: '🎁', text: 'Mes bons de réduction' };
        break;
      case 'update-info':
        this.content = { icon: '🔧', text: 'Mettre à jour mes informations' };
        break;
      case 'change-password':
        this.content = { icon: '🔒', text: 'Changer mon mot de passe' };
        break;
      case 'addresses':
        this.content = { icon: '📍', text: 'Mes adresses' };
        break;
      case 'iban-info':
        this.content = { icon: '💳', text: 'Mes informations IBAN' };
        break;
      case 'support':
        this.content = { icon: '📞', text: 'Centre d\'assistance' };
        break;
      case 'logout':
        this.content = { icon: '🔓', text: 'Vous êtes déconnecté.' };
        break;
      default:
        this.content = null;
    }
  }  
}
