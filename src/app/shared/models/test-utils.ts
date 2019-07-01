import { Group } from './group.model';
import UserClass from './user';
import GroupClass from './group';
import { User } from './user.model';

import { ComponentRef } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

export class TestUtils {
  static getTestGroup(name: string, users?: Array<User>): Group {
    if (!users) {
      users = [
        new UserClass('1', 'Katie', 'kkunesh@gmail.com', false),
        new UserClass('2', 'Jacob', 'jdulai@gmail.com', false),
        new UserClass('3', 'Noah', 'nrizika@gmail.com', false)
      ];
    }
    return new GroupClass('1', name, users);
  }

  static getRandomUID(): string {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }

  static getTestUser(
    uid = this.getRandomUID(),
    name = 'Test User',
    email = 'testemail@email.com',
    isAdmin = false,
    groups?: Array<Group>
  ): User {
    return new UserClass(uid, name, email, isAdmin, groups);
  }

  static getElement(fixture: ComponentFixture<ComponentRef<any>>): HTMLElement {
    const element: HTMLElement = fixture.nativeElement as HTMLElement;
    return element;
  }
}
