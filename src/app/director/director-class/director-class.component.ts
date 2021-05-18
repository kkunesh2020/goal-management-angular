import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CreateStudentComponent } from 'src/app/dialogs/create-student/create-student.component';
import { DeleteStudentComponent } from 'src/app/dialogs/delete-student/delete-student.component';
import { UpdateStudentComponent } from 'src/app/dialogs/update-student/update-student.component';
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
    private classService: ClassService
  ) {
    this.auth.user$.subscribe(async (userProfile) => {
      this.loading = true;
      this.classID = this.route.snapshot.paramMap.get('classID');
      if (!userProfile) {
        return;
      }

      this.classService.getDataForClass(this.classID).subscribe(async(classData) => {
        this.loading = true;
        console.log("classss", classData);
          this.classData = classData;
          this.classData.id = this.classID;
          if(classData){
            this.teacherData = await this.classService.getTeacherData(this.classData.teacherUID);
          }
          this.classService.getStudentsDataByReference(classData.students).then((studentData) => {
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

  editDialog(data: any){
    const dialogRef = this.dialog.open(UpdateStudentComponent, {
      data: data,
      height: '23rem',
      width: '30rem',
    });

   dialogRef.afterClosed().subscribe((returnData) => {
     if(returnData){
       // update data manaully here
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
      if(data.uid){
        this.studentDataSource.push(data);
      }
    })
  }

}
