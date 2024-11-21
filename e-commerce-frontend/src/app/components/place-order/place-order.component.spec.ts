import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Si vous avez des appels HTTP
import { PlaceOrderComponent } from './place-order.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderService } from '../../services/order.service';

describe('PlaceOrderComponent', () => {
  let component: PlaceOrderComponent;
  let fixture: ComponentFixture<PlaceOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceOrderComponent,HttpClientTestingModule],
      providers: [OrderService], 
      schemas: [NO_ERRORS_SCHEMA]  // Ajoutez cette ligne pour ignorer les erreurs de validation des propriétés inconnues
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
