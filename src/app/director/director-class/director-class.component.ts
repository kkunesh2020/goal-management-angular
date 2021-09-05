import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CreateStudentComponent } from 'src/app/dialogs/create-student/create-student.component';
import { DeleteClassComponent } from 'src/app/dialogs/delete-class/delete-class.component';
import { DeleteStudentComponent } from 'src/app/dialogs/delete-student/delete-student.component';
import { UpdateClassComponent } from 'src/app/dialogs/update-class/update-class.component';
import { DirectorClass } from 'src/app/shared/models/directorClass.model';
import { User } from 'src/app/shared/models/user.model';
import firebase from 'firebase/app';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ClassService } from 'src/app/shared/services/class.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { HomeService } from 'src/app/shared/services/home.service';
@Component({
  selector: 'gms-director-class',
  templateUrl: './director-class.component.html',
  styleUrls: ['./director-class.component.scss']
})
export class DirectorClassComponent implements OnInit {
  loading: boolean = false;
  classID: string = "";
  teacherData: User;
  classData: DirectorClass;
  displayedColumns: string[] = ['name', 'email', 'edit'];
  students = [];
  retrieveClassSubscription: Subscription;
  sendEmailSubscription = firebase.functions().httpsCallable('studentAddedToClass');
  studentDataSource = [];

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    public dialog: MatDialog,
    protected dialogService: NbDialogService,
    private classService: ClassService,
    private router: Router,
    private functions: AngularFireFunctions
  ) {
    this.retrieveClassSubscription = this.auth.user$.subscribe(async (userProfile) => {
      this.loading = true;

      this.classID = this.route.snapshot.paramMap.get('classID');
      if (!userProfile) {
        return;
      }

      this.classService.getDataForClass(this.classID).subscribe(async(classData) => {
        this.loading = true;
          this.classData = classData;
          if(classData){
            this.classData.id = this.classID;
            this.teacherData = await this.classService.getTeacherData(this.classData.teacherEmail);

            this.classService.getStudentsDataByReference(classData.students).then((studentData) => {
              this.loading = true;
              console.log("got student data by emails", studentData)
              if(studentData.length > 0){
                this.studentDataSource = studentData;
              }
              this.loading = false;
            });
          }
        
      })
    });
  }

  ngOnInit() {
  }


  deleteClassDialog(){
    const dialogRef = this.dialogService.open(DeleteClassComponent, {
      context: {dialogData: this.classData}
    });

   dialogRef.onClose.subscribe((returnData) => {
     if(returnData){
       this.retrieveClassSubscription.unsubscribe();
      this.router.navigate(['/director'], {state: {action: "delete", id: returnData}});
     }
   })
  }


  editDialog(){
    console.log("updating data with", this.classData);
    const dialogRef = this.dialogService.open(UpdateClassComponent, {
      context: {data: this.classData}
    });

   dialogRef.onClose.subscribe((returnData) => {
     if(returnData){ 
       this.classData.title = returnData.data.title;
       this.classData.classIcon = returnData.data.classIcon;
       this.classData.teacherEmail = returnData.data.teacherEmail;
     }
   })
  }


  deleteDialog(data: any){
    console.log("deleting", data);
    const dialogRef = this.dialogService.open(DeleteStudentComponent, {
      context: {dialogData: {student: data, class: this.classData}}
    });

   dialogRef.onClose.subscribe((returnData) => {
     if(returnData){ 
       console.log("yay", returnData);
       this.studentDataSource = this.studentDataSource.filter(student => student.email != returnData.email);
     }
   })
  }

  async sendEmail(name: string, email: string){
    console.log('sending email 2', email);
    this.sendEmailSubscription({ subject: `You are invited to join ${this.classData.title}!`, class: this.classData.title, teacher: this.teacherData.name, link: 'https://goal-management-system.web.app/goals', name: name, email: email}).then((response) => {
      console.log("sent!", response);
    }).catch((err) => {
      console.log("ERROR",err);
    })
  }

  openStudentCreateModal(){
    let ref = this.dialogService.open(CreateStudentComponent, {
      context: {data: this.classData}
    })
    ref.onClose.subscribe(async(data) => {
      if(data && data.email){
        this.studentDataSource.push(data);
        console.log('sending email 1');
        await this.sendEmail(data.name, data.email);
      }
    })
  }

}
