import GoalClass from './goal';
import { TestUtils } from './test-utils';
import UserClass from './user';

describe('goalClassTests', () => {
  let goal: GoalClass = null;

  beforeEach(() => {
    goal = TestUtils.getTestGoal();
  });
  afterEach(() => {
    goal = null;
  });

  it('should have a valid constructor', () => {
    expect(goal).not.toBeNull();
  });
  it ('should set description correctly through constructor', () => {
    expect(goal.description).toEqual('Test Goal');
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
  it('should set isCompleted correctly through the constructor', () => {
    expect(goal.isCompleted).toEqual(false);
  });
  it('should be able to set isCompleted', () => {
    goal.isCompleted = true;
    expect(goal.isCompleted).toEqual(true);
  });
  it('should set createdBy correctly through the constructor', () => {
    expect(goal.createdBy).toEqual(TestUtils.getTestUser());
  });
  it('should be able to set createdBy', () => {
    const user = new UserClass('6', 'user', 'email', false);
    goal.createdBy = user;
    expect(goal.createdBy).toEqual(user);
  });
  it('should set assignedTo correctly through constructor', () => {
    expect(goal.assignedTo).toEqual(
      [
        new UserClass('1', 'Katie', 'kkunesh@gmail.com', false),
        new UserClass('2', 'Jacob', 'jdulai@gmail.com', false),
        new UserClass('3', 'Noah', 'nrizika@gmail.com', false)
      ]
    );
  });
  it('should be able to set assignedTo', () => {
    const users = [
      new UserClass('4', 'Katie', 'kkunesh@gmail.com', false),
      new UserClass('5', 'Jacob', 'jdulai@gmail.com', false),
      new UserClass('6', 'Noah', 'nrizika@gmail.com', false)
    ];
    goal.assignedTo = users;
    expect(goal.assignedTo).toEqual(users);
  });
  it('should add a user to assignedTo', () => {
    const user = new UserClass('4', 'JD', 'jd@gmail.com', false);
    goal.assignedTo.push(user);
    expect(goal.assignedTo).toContain(user);
  });
  it('should set notes correctly though constructor', () => {
    expect(goal.notes).toEqual('do something');
  });
  it('should be able to set notes', () => {
    goal.notes = 'do homework';
    expect(goal.notes).toEqual('do homework');
  });
  it('should set groups correctly though constructor', () => {
    expect(goal.groups).toEqual(
      [
        TestUtils.getTestGroup('group 1'),
        TestUtils.getTestGroup('group 2')
      ]
    );
  });
  it('should be able to set groups', () => {
      const groups = [
        TestUtils.getTestGroup('group 3'),
        TestUtils.getTestGroup('group 4')
      ];
      goal.groups = groups;
      expect(goal.groups).toEqual(groups);
  });
  it('should add a group to groups', () => {
    const group = TestUtils.getTestGroup('group 5');
    goal.groups.push(group);
    expect(goal.groups).toContain(group);
  });

});
