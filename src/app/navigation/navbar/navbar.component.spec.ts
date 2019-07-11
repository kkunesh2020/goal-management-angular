// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { NavbarComponent } from './navbar.component';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { TestUtils } from '../shared/models/test-utils';
// import { useAnimation } from '@angular/animations';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { environment } from 'src/environments/environment';
// import { of } from 'rxjs';
// import { AuthService } from '../shared/services/auth.service';
// import { map, tap } from 'rxjs/operators';
// import { MaterialModule } from '../shared/material.module';
// import { MatSidenavModule } from '@angular/material';

// describe('NavbarComponent', () => {
//   let component: NavbarComponent;
//   let fixture: ComponentFixture<any>;

//   const authServiceStub = {
//     user$: of(null),

//     async googleSignin() {
//       this.user$ = of(TestUtils.getTestUser());
//     },

//     async googleSignInWithAdmin() {
//       const user = TestUtils.getTestUser();
//       user.isAdmin = true;
//       return of(user);
//     },
//     async signOut() {
//       this.user$ = of(null);
//     }
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [NavbarComponent],
//       imports: [
//         MaterialModule,
//         NoopAnimationsModule,
//         AngularFireModule.initializeApp(environment.firebaseConfig),
//         AngularFirestoreModule,
//         AngularFireAuthModule
//       ],
      // providers: [{
      //   provide: AuthService,
      //   useValue: authServiceStub
      // }]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(NavbarComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  //
  // it('should display login when logged out', () => {
  //   component.auth.signOut();
  //   const element = TestUtils.getElement(fixture);
  //   expect(element.innerText).not.toContain('Log Out');
  //   expect(element.innerText).toContain('Log In');
  // });
  //
  // it('should display log out when logged in', () => {
  //   component.auth.googleSignin();
  //   fixture.detectChanges();
  //   const element = TestUtils.getElement(fixture);
  //   expect(element.innerText).not.toContain('Log In');
  //   expect(element.innerText).toContain('Log Out');
  // });
  //
  // it('should display goal history when student is logged in', () => {
  //   component.auth.googleSignin();
  //   fixture.detectChanges();
  //   const element = TestUtils.getElement(fixture);
  //   expect(element.innerText).toContain('Goal History');
  // });
  //
  // it('should display view students when teacher is logged in', () => {
  //   const user = TestUtils.getTestUser();
  //   user.isAdmin = true;
  //   component.auth.user$ = of(user);
  //   console.log('Set admin to true');
  //   fixture.detectChanges();
  //   const element = TestUtils.getElement(fixture);
  //   expect(element.innerText).toContain('View Students');
  // });
// });
