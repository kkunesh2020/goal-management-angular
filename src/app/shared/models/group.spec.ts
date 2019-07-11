import GroupClass from './group';
import { TestUtils } from '../utils/test-utils';
import UserClass from './user';

describe('GroupClass Tests', () => {
  let group: GroupClass = null;

  beforeEach(() => {
    group = TestUtils.getTestGroup('test group');
  });
  afterEach(() => {
    group = null;
  });

  it('should have a valid constructor',() => {
    expect(group).not.toBeNull();
  });

  it('should set name correctly through constructor', () => {
    expect(group.name).toEqual('test group');
  });

  it('should be able to set name', () => {
    group.name = 'spaghetti';
    expect(group.name).toEqual('spaghetti');
  });

  it('should set uid correctly through constructor', () => {
    expect(group.uid).toEqual('1');
  });

  it('should be able to set uid', () => {
    group.uid = '2';
    expect(group.uid).toEqual('2');
  });

  it('should set users correctly through constructor', () => {
    const users = [
      new UserClass('1', 'Katie', 'kkunesh@gmail.com', false, 4, 6),
      new UserClass('2', 'Jacob', 'jdulai@gmail.com', false, 4, 6),
      new UserClass('3', 'Noah', 'nrizika@gmail.com', false, 4, 6)
    ];
    expect(group.users).toEqual(users);
  });

  it('should be able to set users', () => {
    const users = [
      new UserClass('1', 'Sam', 'kkunesh@gmail.com', false, 4, 6),
      new UserClass('2', 'Jacob', 'jdulai@gmail.com', false, 4, 6),
      new UserClass('3', 'Noah', 'nrizika@gmail.com', false, 4, 6)
    ];
    group.users = users;
    expect(group.users).toEqual(users);
  });

  it('should add a user to users', () => {
    const newUser = new UserClass('4', 'Jd', 'jd@mail.com', true, 4, 6);
    group.users.push(newUser);
    expect(group.users).toContain(newUser);
  });

});
