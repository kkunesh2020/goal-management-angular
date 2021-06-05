import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import FileClass from '../models/file';
import { Goal } from '../models/goal.model';
import LinkClass from '../models/link';
import UserClass from '../models/user';
import { ClassService } from './class.service';
import { GoalService } from './goal.service';
import NoteClass from '../models/note';
import CommitClass from '../models/commit';

@Injectable({
  providedIn: 'root',
})
export class GoalStudentDataService {
  private studentDataSource = new BehaviorSubject({});
  currentStudentGoal = this.studentDataSource.asObservable();
  constructor(private classService: ClassService) {}

  // get status of a single student given the array of all students who have completed, panding, and declined status
  // @param hasCompleted: string[], pending: string[], declined: string[], studentID: string
  getStudentStatus(
    hasCompleted: string[],
    pending: string[],
    declined: string[],
    studentID: string
  ) {
    // if studentID is inside the hasCompleted array the student has completed the assignment
    if (hasCompleted.includes(studentID)) {
      return 'completed';
    }

    if (pending.includes(studentID)) {
      return 'pending';
    }

    if (declined.includes(studentID)) {
      return 'declined';
    }

    return 'incompleted';
  }
  // get a student's data with their id
  // @param studentEmail: string
  getStudentData(studentEmail: string): Promise<UserClass> {
    console.log('getting student data', studentEmail);
    const promise = this.classService
      .getStudentDataByEmail(studentEmail)
      .then((studentData) => {
        return studentData.data();
      });

    return promise;
  }

  // get a student's files with an array of files their id
  // @param files: FileClass[], studentID: string
  // files contains all the submitted files for the assignment (this contains files for all students in the class)
  getStudentFiles(files: FileClass[], studentID: string) {
    const studentFiles: FileClass[] = [];
    files.forEach((file) => {
      if (file.email === studentID) {
        // filters files to find files corresponding to the student's uid
        studentFiles.push(file);
      }
    });
    return studentFiles;
  }

  // get a student's links with an array of links their id
  // @param links: LinkClass[], studentID: string
  getStudentLinks(links: LinkClass[], studentID: string) {
    const studentLinks: LinkClass[] = [];
    links.forEach((link) => {
      if (link.email === studentID) {
        // filters links to find links corresponding to the student's uid
        studentLinks.push(link);
      }
    });
    return studentLinks;
  }
  

  //get a student's github commits with an array of links their id
  //@param commits: CommitClass[], studentID: string
  getStudentCommits(commits: CommitClass[], studentID: string){
    let studentCommits: CommitClass[] = [];
    commits.forEach((commit) => {
      if(commit.uid == studentID){ //filters links to find links corresponding to the student's uid
      studentCommits.push(commit);
      }
    });
    return studentCommits;
  }

  // get a student's declined note with an array of declined notes and their id
  // @param declinedNotes: NoteClass[], studentID: string
  getStudentDeclinedNote(
    declinedNotes: NoteClass[],
    studentID: string
  ): NoteClass {
    let noteData = null;
    declinedNotes.forEach((note) => {
      if (note.email === studentID) {
        // filters declined notes to find declined notes corresponding to the student's uid
        noteData = note;
      }
    });
    return noteData;
  }

  // get a student's goal data with their uid and a goal object
  // @param studentEmail: string, goal: Goal
  setStudentGoalData(studentEmail: string, goal: Goal) {
    if (studentEmail == null || goal == null) {
      // checking for invalid parameters
      this.studentDataSource.next(null);
      return;
    }
    let student: UserClass;
    // set datasource to loading while fetching data
    this.studentDataSource.next('loading');
    this.getStudentData(studentEmail).then((data) => {
      student = data;
      console.log(student);
      let isCompleted: boolean;
      let status: string = this.getStudentStatus(
        goal.hasCompleted,
        goal.pending,
        goal.declined,
        studentEmail
      );
      isCompleted = (status === 'completed');
      const studentFiles: FileClass[] = this.getStudentFiles(
        goal.files ? goal.files : [],
        studentEmail
      );
      const studentLinks: LinkClass[] = this.getStudentLinks(
        goal.links ? goal.links : [],
        studentEmail
      );

      let studentDataResult = {
        id: studentEmail,
        email: studentEmail,
        completed: isCompleted,
        name: student.name,
        files: studentFiles,
        links: studentLinks,
        declinedNote: ''
      };

      if (status === 'declined') {
        // if the status is declined the student has a declined note
        studentDataResult.declinedNote = null;
        if(this.getStudentDeclinedNote(
          goal.declinedMessages,
          studentEmail
        )){
          studentDataResult.declinedNote = this.getStudentDeclinedNote(
            goal.declinedMessages,
            studentEmail
          ).note;
        }
      }
      this.studentDataSource.next({...studentDataResult, status}); // input student data in the studentDataSource
    });
  }
}
