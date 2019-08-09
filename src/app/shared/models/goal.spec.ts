import GoalClass from './goal';
import { TestUtils } from '../utils/test-utils';
import UserClass from './user';
import { Status } from './status';

describe('goalClassTests', () => {
  let goal: GoalClass = null;

  beforeEach(() => {
    goal = TestUtils.getTestGoal('This will be a different description');
  });
  afterEach(() => {
    goal = null;
  });

  it('should have a valid constructor', () => {
    expect(goal).not.toBeNull();
  });
  it ('should set description correctly through constructor', () => {
    expect(goal.description).toEqual('This will be a different description');
  });
  it('should be able to set description', () => {
    goal.description = 'mash potatoes';
    expect(goal.description).toEqual('mash potatoes');
  });
  it('should set due date correctly through constructor', () => {
    expect(goal.dueDate).toEqual(new Date('2019-07-03'));
  });
  it('should be able to set due date', () => {
    goal.dueDate = new Date('2019-07-04');
    expect(goal.dueDate).toEqual(new Date('2019-07-04'));
  });
  it('should set status correctly through the constructor', () => {
    expect(goal.status).toEqual(Status.In_Progress);
  });
  it('should be able to set status', () => {
    goal.status = Status.Completed;
    expect(goal.status).toEqual(Status.Completed);
  });
  it('should set createdBy correctly through the constructor', () => {
    expect(goal.createdBy).toEqual(TestUtils.getTestUser());
  });
  it('should be able to set createdBy', () => {
    const user = new UserClass('6', 'user', 'email', false, 4, 6);
    goal.createdBy = user;
    expect(goal.createdBy).toEqual(user);
  });
  it('should set assignedTo correctly through constructor', () => {
    expect(goal.assignedTo).toEqual(
        new UserClass('1', 'Katie', 'kkunesh@gmail.com', false, 4, 6)
    );
  });
  it('should be able to set assignedTo', () => {
    const user =
      new UserClass('4', 'Katie', 'kkunesh@gmail.com', false, 4, 6);
    goal.assignedTo = user;
    expect(goal.assignedTo).toEqual(user);
  });
  it('should set notes correctly though constructor', () => {
    expect(goal.notes).toEqual('do something');
  });
  it('should be able to set notes', () => {
    goal.notes = 'do homework';
    expect(goal.notes).toEqual('do homework');
  });
});
