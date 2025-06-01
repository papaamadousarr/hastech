import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCarBrandsComponent } from './all-car-brands.component';

describe('AllCarBrandsComponent', () => {
  let component: AllCarBrandsComponent;
  let fixture: ComponentFixture<AllCarBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCarBrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCarBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
