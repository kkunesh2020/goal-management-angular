import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateStudentComponent } from 'src/app/dialogs/create-student/create-student.component';
import { DeleteClassComponent } from 'src/app/dialogs/delete-class/delete-class.component';
import { DeleteStudentComponent } from 'src/app/dialogs/delete-student/delete-student.component';
import { UpdateClassComponent } from 'src/app/dialogs/update-class/update-class.component';
import { DirectorClass } from 'src/app/shared/models/directorClass.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';
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
  studentDataSource = [];

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    public dialog: MatDialog,
    private classService: ClassService,
    private router: Router
  ) {
    this.auth.user$.subscribe(async (userProfile) => {
      this.loading = true;
      this.classID = this.route.snapshot.paramMap.get('classID');
      if (!userProfile) {
        return;
      }

      this.classService.getDataForClass(this.classID).subscribe(async(classData) => {
        this.loading = true;
          this.classData = classData;
          this.classData.id = this.classID;
          if(classData){
            this.teacherData = await this.classService.getTeacherData(this.classData.teacherUID);
          }
          // replace with email code
          this.classService.getStudentsByEmails(classData.students).then((studentData) => {
          console.log("got student data by emails", studentData)
          if(studentData.length > 0){
            this.studentDataSource = studentData;
          }
        });
        this.loading = false;
      })
    });
  }

  ngOnInit() {
  }


  deleteClassDialog(){
    const dialogRef = this.dialog.open(DeleteClassComponent, {
      data: this.classData,
      height: '15rem',
      width: '25rem',
    });

   dialogRef.afterClosed().subscribe((returnData) => {
     if(returnData){
      this.router.navigate(['/director'], {state: {action: "delete", id: returnData}});
     }
   })
  }


  editDialog(){
    const dialogRef = this.dialog.open(UpdateClassComponent, {
      data: this.classData,
      height: '31rem',
      width: '25rem',
    });

   dialogRef.afterClosed().subscribe((returnData) => {
     if(returnData){ 
       this.classData.title = returnData.data.title;
       this.classData.classIcon = returnData.data.classIcon;
       this.classData.teacherUID = returnData.data.teacherUID;
     }
   })
  }


  deleteDialog(data: any){
    console.log("deleting", data);
    const dialogRef = this.dialog.open(DeleteStudentComponent, {
      data: {student: data, class: this.classData},
      height: '16rem',
      width: '25rem',
    });

   dialogRef.afterClosed().subscribe((returnData) => {
     if(returnData){ 
       this.studentDataSource = this.studentDataSource.filter(student => student.id != returnData.uid);
     }
   })
  }

  openStudentCreateModal(){
    let ref = this.dialog.open(CreateStudentComponent, {
      width: '27rem',
      height: '27rem',
      panelClass: 'custom-modalbox',
      data: this.classData
    })
    ref.afterClosed().subscribe((data) => {
      console.log("got the data", data);
      if(data && data.uid){
        this.studentDataSource.push(data);
      }
    })
  }

}
