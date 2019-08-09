import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysGoalComponent } from './todays-goal.component';
import { Component, ViewChild } from '@angular/core';
import { TestUtils } from '../shared/utils/test-utils';
import { GoalService } from '../shared/services/goal.service';
import UserClass from '../shared/models/user';
import { of } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

fdescribe('TodaysGoalComponent', () => {

  let component: TodaysGoalComponent;
  let fixture: ComponentFixture<any>;
  let goalServiceSpy: jasmine.SpyObj<GoalService>;
  let authService: AuthService;

  const authServiceStub = {
    user$: of(null),
    currentUserId: TestUtils.getTestUser().uid,

    async googleSignin() {
      this.user$ = of(TestUtils.getTestUser());
    },

    async signOut() {
      this.user$ = of(null);
    }
  };

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('GoalService', ['getTodaysGoal']);
    TestBed.configureTestingModule({
      declarations: [ TodaysGoalComponent],
      providers: [
        {
          provide : GoalService,
          useValue : spy
        },
        {
          provide: AuthService,
          useValue: authServiceStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    goalServiceSpy = TestBed.get(GoalService);
    authService = TestBed.get(AuthService);
  });

  it('should create todays goal component', () => {
    expect(component).toBeTruthy();
  });

  it('should set student attribute correctly', () => {
    expect(component.currentStudentId).toEqual(TestUtils.getTestUser().uid);
  });

  it('should correctly set today\'s goal', async () => {
    const todaysGoal = of(TestUtils.getTestGoal()).toPromise();
    goalServiceSpy.getTodaysGoal.withArgs(authService.currentUserId).and.returnValue(todaysGoal);
    await component.ngOnInit();
    const goal = await todaysGoal;
    expect(component.goal).toEqual(goal);
  });

  it('should display goal description in the view', async() => {
    const todaysGoal = of(TestUtils.getTestGoal()).toPromise();
    goalServiceSpy.getTodaysGoal.withArgs(authService.currentUserId).and.returnValue(todaysGoal);
    await component.ngOnInit();
    const goal = await todaysGoal;
    fixture.detectChanges();
    const nativeElement = TestUtils.getNativeElement(fixture);
    expect(nativeElement.innerText).toContain(goal.description);
  });

  // it('should display an accept button', () => {
  //   let todaysGoal = of(TestUtils.getTestGoal()).toPromise();
  //   goalServiceSpy.getTodaysGoal.withArgs(authService.currentUserId).and.returnValue(todaysGoal);
  //   component.ngOnInit();
  //   todaysGoal = Promise.resolve(todaysGoal);
  //   todaysGoal.then(goal => {
  //     fixture.detectChanges();
  //     const nativeElement = TestUtils.getNativeElement(fixture);
  //     const acceptBtn = nativeElement.querySelector('button#accept-button');
  //     expect(acceptBtn).not.toBe(null);
  //     expect(acceptBtn.innerHTML.trim()).toEqual('Accept');
  //   });
  // });

  // it('should display reject button', async () => {
  //   const todaysGoal = of(TestUtils.getTestGoal()).toPromise();
  //   goalServiceSpy.getTodaysGoal.withArgs(testHostComponent.student).and.returnValue(todaysGoal);
  //   await component.ngOnInit();
  //   testHostFixture.detectChanges();
  //   const nativeElement = TestUtils.getNativeElement(testHostFixture);
  //   const rejectButton = nativeElement.querySelector('button#reject-button');
  //   expect(rejectButton).not.toBe(null);
  //   expect(rejectButton.innerHTML.trim()).toEqual('Reject');
  // });

  // it('should only display \'No goal assigned\' when there is no goal assigned', ()=> {
  //   const nativeElement = TestUtils.getNativeElement(testHostFixture);
  //   const acceptBtn = nativeElement.querySelector('button#accept-button');
  //   expect(acceptBtn).toBe(null);
  //   const rejectButton = nativeElement.querySelector('button#reject-button');
  //   expect(rejectButton).toBe(null);
  //   expect(nativeElement.innerText).toEqual('No Goal Assigned');
  // });


});
