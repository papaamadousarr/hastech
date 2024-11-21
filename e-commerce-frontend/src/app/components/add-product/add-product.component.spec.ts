import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { ProductService } from '../../services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Si vous avez des appels HTTP
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductComponent, HttpClientTestingModule],  // Ajoutez le composant et HttpClientTestingModule si nécessaire
      providers: [ProductService],  // Ajoutez le service ProductService ici
      schemas: [NO_ERRORS_SCHEMA]  // Ajoutez cette ligne pour ignorer les erreurs de validation des propriétés inconnues
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
