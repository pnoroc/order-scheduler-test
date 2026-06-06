import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppContainerComponent } from './app-container.component';

describe('AppContainer', () => {
  let component: AppContainerComponent;
  let fixture: ComponentFixture<AppContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppContainerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
