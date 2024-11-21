import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ClientModule } from '../client.module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';  // Importez HttpClientModule pour résoudre l'erreur

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientModule, HttpClientModule],  // Ajoutez HttpClientModule ici
      providers: [AuthService, Router],  // Fournissez les services nécessaires
    }).compileComponents();
  });

  it('should create the login component', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
