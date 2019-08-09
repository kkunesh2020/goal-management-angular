import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysGoalComponent } from './todays-goal.component';
import { Component, ViewChild } from '@angular/core';
import { TestUtils } from '../shared/utils/test-utils';
import { GoalService } from '../shared/services/goal.service';
import UserClass from '../shared/models/user';
import { of } from 'rxjs';

describe('TodaysGoalComponent', () => {
  @Component({
    selector: `gms-host-component`,
    template: `<gms-todays-goal [currentStudent]="student"></gms-todays-goal>`
  })
  class TestHostComponent {
    @ViewChild(TodaysGoalComponent, {static: false})
    todaysGoalComponent: TodaysGoalComponent;
    student = new UserClass('1', 'Katie', 'kkunesh@gmail.com', false, 4, 6);
  }
  let component: TodaysGoalComponent;
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<any>;
  let goalServiceSpy: jasmine.SpyObj<GoalService>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('GoalService', ['getTodaysGoal']);
    TestBed.configureTestingModule({
      declarations: [ TodaysGoalComponent, TestHostComponent ],
      providers: [
        {
          provide : GoalService,
          useValue : spy
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
    component = testHostComponent.todaysGoalComponent;
    goalServiceSpy = TestBed.get(GoalService);
  });

  it('should create todays goal component', () => {
    expect(testHostComponent.todaysGoalComponent).toBeTruthy();
  });

  it('should set student attribute correctly', () => {
    expect(component.currentStudent).not.toBe(null);
    expect(component.currentStudent).toEqual(testHostComponent.student);
  });

  it('should correctly set today\'s goal', () => {
    const todaysGoal = of(TestUtils.getTestGoal()).toPromise();
    goalServiceSpy.getTodaysGoal.withArgs(testHostComponent.student).and.returnValue(todaysGoal);
    component.ngOnInit();
    todaysGoal.then(goal => {
      expect(component.goal).toEqual(goal);
    });
  });

  it('should display goal in the parent component', async () => {
    const todaysGoal = of(TestUtils.getTestGoal()).toPromise();
    goalServiceSpy.getTodaysGoal.withArgs(testHostComponent.student).and.returnValue(todaysGoal);
    await component.ngOnInit();
    testHostFixture.detectChanges();
    const nativeElement = TestUtils.getNativeElement(testHostFixture);
    todaysGoal.then(goal => {
      expect(nativeElement.innerText).toContain(goal.description);
    });

  });

  it('should display an accept button', async () => {
    const todaysGoal = of(TestUtils.getTestGoal()).toPromise();
    goalServiceSpy.getTodaysGoal.withArgs(testHostComponent.student).and.returnValue(todaysGoal);
    await component.ngOnInit();
    testHostFixture.detectChanges();
    const nativeElement = TestUtils.getNativeElement(testHostFixture);
    const acceptBtn = nativeElement.querySelector('button#accept-button');
    expect(acceptBtn).not.toBe(null);
    expect(acceptBtn.innerHTML.trim()).toEqual('Accept');

  });

  it('should display reject button', async () => {
    const todaysGoal = of(TestUtils.getTestGoal()).toPromise();
    goalServiceSpy.getTodaysGoal.withArgs(testHostComponent.student).and.returnValue(todaysGoal);
    await component.ngOnInit();
    testHostFixture.detectChanges();
    const nativeElement = TestUtils.getNativeElement(testHostFixture);
    const rejectButton = nativeElement.querySelector('button#reject-button');
    expect(rejectButton).not.toBe(null);
    expect(rejectButton.innerHTML.trim()).toEqual('Reject');
  });

  it('should only display \'No goal assigned\' when there is no goal assigned', ()=> {
    const nativeElement = TestUtils.getNativeElement(testHostFixture);
    const acceptBtn = nativeElement.querySelector('button#accept-button');
    expect(acceptBtn).toBe(null);
    const rejectButton = nativeElement.querySelector('button#reject-button');
    expect(rejectButton).toBe(null);
    expect(nativeElement.innerText).toEqual('No Goal Assigned');
  });


});
