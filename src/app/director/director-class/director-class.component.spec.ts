import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorClassComponent } from './director-class.component';

describe('DirectorClassComponent', () => {
  let component: DirectorClassComponent;
  let fixture: ComponentFixture<DirectorClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectorClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
