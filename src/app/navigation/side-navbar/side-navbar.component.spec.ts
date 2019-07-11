import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavbarComponent } from './side-navbar.component';
import { MaterialModule } from '../../shared/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { TestUtils } from 'src/app/shared/utils/test-utils';
import { of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';


describe('SideNavbarComponent', () => {
  let component: SideNavbarComponent;
  let fixture: ComponentFixture<any>;

  const authServiceStub = {
      user$: of(null),

      async googleSignin() {
        this.user$ = of(TestUtils.getTestUser());
      },

      async googleSignInWithAdmin() {
        const user = TestUtils.getTestUser();
        user.isAdmin = true;
        return of(user);
      },
      async signOut() {
        this.user$ = of(null);
      }
    };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavbarComponent ],
      imports: [
        MaterialModule,
        NoopAnimationsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
      ],
      providers: [{
        provide: AuthService,
        useValue: authServiceStub
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login when logged out', () => {
    component.auth.signOut();
    const element = TestUtils.getElement(fixture);
    expect(element.innerText).not.toContain('Logout');
    expect(element.innerText).toContain('Login');
  });

  it('should display log out when logged in', () => {
    component.auth.googleSignin();
    fixture.detectChanges();
    const element = TestUtils.getElement(fixture);
    expect(element.innerText).not.toContain('Login');
    expect(element.innerText).toContain('Logout');
  });

  it('should display goal history when student is logged in', () => {
    component.auth.googleSignin();
    fixture.detectChanges();
    const element = TestUtils.getElement(fixture);
    expect(element.innerText).toContain('Goal History');
  });

  it('should display view students when teacher is logged in', () => {
    const user = TestUtils.getTestUser();
    user.isAdmin = true;
    component.auth.user$ = of(user);
    console.log('Set admin to true');
    fixture.detectChanges();
    const element = TestUtils.getElement(fixture);
    expect(element.innerText).toContain('View Students');
  });
});
