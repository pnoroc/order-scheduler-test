import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkOrderScheduleComponent } from './work-order-schedule.component';

describe('WorkOrderSchedule', () => {
  let component: WorkOrderScheduleComponent;
  let fixture: ComponentFixture<WorkOrderScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderScheduleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderScheduleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
