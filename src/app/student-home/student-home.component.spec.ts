import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHomeComponent } from './student-home.component';
import { of, Observable } from 'rxjs';
import { TestUtils } from '../shared/utils/test-utils';
import { AuthService } from '../shared/services/auth.service';
import { MaterialModule } from '../shared/material.module';
import { TodaysGoalComponent } from '../todays-goal/todays-goal.component';
import { User } from '../shared/models/user.model';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

describe('StudentHomeComponent', () => {
  let component: StudentHomeComponent;
  let fixture: ComponentFixture<StudentHomeComponent>;

  const authServiceStub = {
    user$: of(null),
    getCurrentUser(): Observable<User> {
      const user = TestUtils.getTestUser();
      return of(user);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule
      ],
      declarations: [StudentHomeComponent, TodaysGoalComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
