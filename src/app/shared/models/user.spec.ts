import UserClass from './user';
import { TestUtils } from '../utils/test-utils';

describe('UserClass tests', () => {
    let user: UserClass = null;

    beforeEach(() => {
        user = new UserClass('1', 'Test User', 'test@email.com', false, 4, 6);
    });
    afterEach(() => {
        user = null;
    });

    it('should have a valid constructor', () => {
        expect(user).not.toBeNull();
    });

    it('should set name correctly through constructor', () => {
        expect(user.name).toEqual('Test User');
    });

    it('should be able to set name', () => {
        user.name = 'jimmy';
        expect(user.name).toEqual('jimmy');
    });

    it('should set email correctly through constructor', () => {
        expect(user.email).toEqual('test@email.com');
    });

    it('should be able to set email', () => {
        user.email = 'jimmy@gmail.com';
        expect(user.email).toEqual('jimmy@gmail.com');
    });

    it('should set isAdmin correctly through constructor', () => {
        expect(user.isAdmin).toEqual(false);
    });

    it('should be able to set isAdmin', () => {
        user.isAdmin = true;
        expect(user.isAdmin).toEqual(true);
    });

    it('should set id correctly through constructor', () => {
      //user = new UserClass('1', 'joe', 'joe@joe.com', true, undefined);
      expect(user.uid).toEqual('1');
    });

    it('should be able to set id', () => {
      user.uid = '1';
      expect(user.uid).toEqual('1');
    });
});
