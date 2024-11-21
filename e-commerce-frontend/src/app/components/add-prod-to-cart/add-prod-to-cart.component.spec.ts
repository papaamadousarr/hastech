import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProdToCartComponent } from './add-prod-to-cart.component';

describe('AddProdToCartComponent', () => {
  let component: AddProdToCartComponent;
  let fixture: ComponentFixture<AddProdToCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProdToCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProdToCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
