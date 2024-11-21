import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerSignupComponent } from './signup.component';

describe('SellerSignupComponent', () => {
  let component: SellerSignupComponent;
  let fixture: ComponentFixture<SellerSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerSignupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SellerSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SellerSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    const fixture = TestBed.createComponent(SellerSignupComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
