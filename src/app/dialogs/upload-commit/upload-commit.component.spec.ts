import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCommitComponent } from './upload-commit.component';

describe('UploadCommitComponent', () => {
  let component: UploadCommitComponent;
  let fixture: ComponentFixture<UploadCommitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCommitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCommitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
