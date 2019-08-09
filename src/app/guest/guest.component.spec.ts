import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestUtils } from 'src/app/shared/utils/test-utils';
import { GuestComponent } from './guest.component';
import { of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
describe('GuestComponent', () => {
  let component: GuestComponent;
  let fixture: ComponentFixture<GuestComponent>;


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
      declarations: [ GuestComponent ],
      providers: [{
        provide: AuthService,
        useValue: authServiceStub
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
