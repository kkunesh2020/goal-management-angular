import { Utils } from './utils';
import { TestUtils } from './test-utils';

describe (' utils test cases ', () => {
  let userUidArray: Array<string> = null;
  it ('should correctly return user names', () => {
     const user1 = TestUtils.getTestUser('1', 'Test User 1');
     const user2 = TestUtils.getTestUser('2', 'Test User 2');
     const user3 = TestUtils.getTestUser('3', 'Test User 3');
     const goal1 = TestUtils.getTestGoal('Test Goal 1 User 1', undefined, undefined, user1);
     const goal2 = TestUtils.getTestGoal('Test Goal 2 User 1', undefined, undefined, user1);
     const goal3 = TestUtils.getTestGoal('Test Goal 3 User 1', undefined, undefined, user1);
     const goal4 = TestUtils.getTestGoal('Test Goal 1 User 2', undefined, undefined, user2);
     const goal5 = TestUtils.getTestGoal('Test Goal 2 User 2', undefined, undefined, user2);
     const goal6 = TestUtils.getTestGoal('Test Goal 1 User 3', undefined, undefined, user3);
     const goal7 = TestUtils.getTestGoal('Test Goal 2 User 3', undefined, undefined, user3);
     // array of user uids
     userUidArray = [user1.uid, user2.uid, user3.uid];

     const expectedDictionary = {
      1: 'Test User 1',
      2: 'Test User 2',
      3: 'Test User 3'
      };

     expect(Utils.getUserNames(userUidArray)).toEqual(expectedDictionary);
  });
});
