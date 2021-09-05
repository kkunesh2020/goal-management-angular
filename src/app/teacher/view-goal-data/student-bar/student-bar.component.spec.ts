import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBarComponent } from './student-bar.component';

describe('StudentBarComponent', () => {
  let component: StudentBarComponent;
  let fixture: ComponentFixture<StudentBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
