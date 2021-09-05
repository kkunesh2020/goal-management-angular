import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGoalComponent } from './update-goal.component';

describe('UpdateGoalComponent', () => {
  let component: UpdateGoalComponent;
  let fixture: ComponentFixture<UpdateGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
