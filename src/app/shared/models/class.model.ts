import { User } from './user.model';
import { Group } from './group.model';

export interface Class {
  members: number;
  title: string;
  teacherUID: string;
  students: User[];
  id: string;
}
