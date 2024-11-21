import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Pour tester les requêtes HTTP
import { SellerDashboardComponent } from './seller-dashboard.component'; // Importez votre composant
import { ProductService } from '../../services/product.service'; // Importez le service utilisé

describe('SellerDashboardComponent', () => {
  let component: SellerDashboardComponent;
  let fixture: ComponentFixture<SellerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // Importez le module pour les tests HTTP
        SellerDashboardComponent  // Ajoutez le composant standalone dans les imports
      ],
      providers: [ProductService]  // Ajoutez le service dans les providers
    }).compileComponents();

    fixture = TestBed.createComponent(SellerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    spyOn(component, 'loadProducts').and.callThrough();
    component.ngOnInit();
    expect(component.loadProducts).toHaveBeenCalled();
  });
});
