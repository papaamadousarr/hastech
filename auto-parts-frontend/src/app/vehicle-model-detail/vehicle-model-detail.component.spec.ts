import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelDetailComponent } from './vehicle-model-detail.component';

describe('VehicleModelDetailComponent', () => {
  let component: VehicleModelDetailComponent;
  let fixture: ComponentFixture<VehicleModelDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleModelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
