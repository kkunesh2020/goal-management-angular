import { TestBed } from '@angular/core/testing';

import { GoalService } from './goal.service';
import { TestUtils } from '../utils/test-utils';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import GoalClass from '../models/goal';
import { User } from '../models/user.model';
import { of } from 'rxjs';

describe('GoalService', () => {
  let currentUser: User;
  const currentGoals = new GoalClass('test desc', new Date(), null, currentUser, new Date(), currentUser, 'notes');

  beforeEach(() => {
    currentUser = TestUtils.getTestUser('currentUser');
    const notTheCurrentUser = TestUtils.getTestUser('notTheCurrentUser');


    const goals = [
      currentGoals,
      new GoalClass('test desc', new Date(), null, notTheCurrentUser, new Date(), notTheCurrentUser, 'notes'),
    ];

    const collectionStub = {
      valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of(goals))
    };

    const angularFirestoreStub = {
      collection: jasmine.createSpy('collection').and.returnValue(collectionStub)
    };

    TestBed.configureTestingModule({
      // imports: [AngularFireModule.initializeApp(environment.firebaseConfig), AngularFirestoreModule],
      providers: [
        { provide: AngularFirestore,
          useValue: angularFirestoreStub
        }
      ]
    });
});

  it('does my component works', () => {
    const service: GoalService = TestBed.get(GoalService);
    expect(service).toBeTruthy();
  });

  describe('getTodayGoal', () => {
    it('returns the first goal for student', () => {

      const goalService: GoalService = TestBed.get(GoalService);
      goalService.getTodaysGoal(currentUser.uid).then(goal => {
        expect(goal).toEqual(currentGoals);
      });
    });
  });

});
