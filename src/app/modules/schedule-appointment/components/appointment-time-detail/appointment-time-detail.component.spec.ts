import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentTimeDetailComponent } from './appointment-time-detail.component';

describe('AppointmentTimeDetailComponent', () => {
  let component: AppointmentTimeDetailComponent;
  let fixture: ComponentFixture<AppointmentTimeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentTimeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentTimeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
