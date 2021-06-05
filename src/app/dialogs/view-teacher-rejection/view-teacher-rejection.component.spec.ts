import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeacherRejectionComponent } from './view-teacher-rejection.component';

describe('ViewTeacherRejectionComponent', () => {
  let component: ViewTeacherRejectionComponent;
  let fixture: ComponentFixture<ViewTeacherRejectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTeacherRejectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTeacherRejectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
