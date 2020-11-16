import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import FileClass from '../models/file';
import { Goal } from '../models/goal.model';
import LinkClass from '../models/link';
import UserClass from '../models/user';
import { ClassService } from './class.service';
import { GoalService } from './goal.service';
import NoteClass from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class GoalStudentDataService {
  private studentDataSource = new BehaviorSubject({});
  currentStudentGoal = this.studentDataSource.asObservable();
  constructor(private classService: ClassService, private goalService: GoalService) { }

  getStudentStatus(hasCompleted: string[], pending: string[], declined: string[], studentID: string){
    let status = 'incompleted';
    if(hasCompleted.includes(studentID)){
      status = 'completed';
    }

    if(pending.includes(studentID)){
      status = 'pending';
    }

    if(declined.includes(studentID)){
      status = 'declined';
    }

    return status;
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
    let studentLinks: LinkClass[] = [];
    links.forEach((link) => {
      if(link.uid == studentID){
        studentLinks.push(link);
      }
    });
    return studentLinks;
  }

  getStudentDeclinedNote(declinedNotes: NoteClass[], studentID: string): NoteClass{
    let noteData = null;
    declinedNotes.forEach(note => {
      if(note.uid == studentID){
        noteData = note;
      }
    })
    return noteData;
  }

  setStudentGoalData(studentID: string, goal: Goal){
    if(studentID == null || goal == null){
      this.studentDataSource.next(null);
      return;
    }
    let student: UserClass;
    this.studentDataSource.next("loading");
    this.getStudentData(studentID).then(data => {
      student = data;
      let isCompleted: boolean; 
      let status: string = this.getStudentStatus(goal.hasCompleted, goal.pending, goal.declined, studentID);
      isCompleted = status == 'completed';
      let studentFiles: FileClass[] = this.getStudentFiles(goal.files ? goal.files : [], studentID);
      let studentLinks: LinkClass[] = this.getStudentLinks(goal.links ? goal.links : [], studentID);
      let studentData = {id: studentID, completed: isCompleted, name: student.name, files: studentFiles, links: studentLinks, status: status, declinedNote: ''};
      if(status == 'declined'){
        studentData.declinedNote = this.getStudentDeclinedNote(goal.declinedMessages, studentID).note;
      }
      this.studentDataSource.next(studentData);
    });
  }
}
