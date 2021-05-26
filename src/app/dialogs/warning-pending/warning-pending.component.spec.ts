import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningPendingComponent } from './warning-pending.component';

describe('WarningPendingComponent', () => {
  let component: WarningPendingComponent;
  let fixture: ComponentFixture<WarningPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
