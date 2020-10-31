import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import FileClass from '../models/file';
import { Goal } from '../models/goal.model';
import LinkClass from '../models/link';
import UserClass from '../models/user';
import { ClassService } from './class.service';

@Injectable({
  providedIn: 'root'
})
export class GoalStudentDataService {
  private studentDataSource = new BehaviorSubject({});
  currentStudentGoal = this.studentDataSource.asObservable();
  constructor(private classService: ClassService) { }

  isCompleted(hasCompleted: string[], studentID: string) : boolean{
    hasCompleted.forEach((id) => {
      if (id == studentID) {return true; }
    });
    return false;
  }

  getStudentData(studentID: string): Promise<UserClass>{
    console.log("getting student data", studentID);
    let promise = this.classService.getStudentDataByID(studentID).then((studentData) => {
      return studentData;
    });

    return promise;
  }

  getStudentFiles(files: FileClass[], studentID: string){
    let studentFiles: FileClass[] = [];
    files.forEach(file => {
      if(file.uid == studentID){
        studentFiles.push(file);
      }
    });
    return studentFiles;
  }

  getStudentLinks(links: LinkClass[], studentID: string){
    let studentLinks: LinkClass[];
    links.forEach((link) => {
      if(link.uid == studentID){
        studentLinks.push(link);
      }
    });
    return studentLinks;
  }

  setStudentGoalData(studentID: string, goal: Goal){
    if(studentID == null || goal == null){
      this.studentDataSource.next(null);
      return;
    }
    let student: UserClass;
    this.getStudentData(studentID).then(data => {
      student = data;
      let isCompleted: boolean = this.isCompleted(goal.hasCompleted, studentID);
      let studentFiles: FileClass[] = this.getStudentFiles(goal.files ? goal.files : [], studentID);
      let studentLinks: LinkClass[] = this.getStudentLinks(goal.links ? goal.links : [], studentID);
      let studentData = {id: studentID, completed: isCompleted, name: student.name, files: studentFiles, links: studentLinks};
      this.studentDataSource.next(studentData);
    });
  }
}
