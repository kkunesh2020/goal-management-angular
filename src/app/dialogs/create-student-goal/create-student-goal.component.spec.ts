import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentGoalComponent } from './create-student-goal.component';

describe('CreateStudentGoalComponent', () => {
  let component: CreateStudentGoalComponent;
  let fixture: ComponentFixture<CreateStudentGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStudentGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStudentGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
