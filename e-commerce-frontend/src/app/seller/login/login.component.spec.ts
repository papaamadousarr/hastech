import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerLoginComponent } from './login.component';

describe('SellerLoginComponent', () => {
  let component: SellerLoginComponent;
  let fixture: ComponentFixture<SellerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SellerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SellerLoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
