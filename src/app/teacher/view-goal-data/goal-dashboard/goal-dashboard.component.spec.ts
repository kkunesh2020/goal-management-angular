import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalDashboardComponent } from './goal-dashboard.component';

describe('GoalDashboardComponent', () => {
  let component: GoalDashboardComponent;
  let fixture: ComponentFixture<GoalDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
