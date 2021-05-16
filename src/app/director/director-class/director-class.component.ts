import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CreateStudentComponent } from 'src/app/dialogs/create-student/create-student.component';
import { DirectorClass } from 'src/app/shared/models/directorClass.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';

@Component({
  selector: 'gms-director-class',
  templateUrl: './director-class.component.html',
  styleUrls: ['./director-class.component.scss']
})
export class DirectorClassComponent implements OnInit {
  loading: boolean = false;
  classID: string = "";
  classData: DirectorClass;
  displayedColumns: string[] = ['name', 'email'];
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

      this.classService.getClassDataForDirector(this.classID).then((classData) => {
        this.classData = classData;

        if(this.classData.studentEmails.length != 0){
          this.classService.getStudentsByEmails(this.classData.studentEmails).then((studentData) => {
            if (studentData) {
              this.studentDataSource = studentData;
              this.loading = false;
            }
          })
        }else{
          this.loading = false;
        }
       
      })
    });
  }

  ngOnInit() {
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
      if(data.id){
        this.studentDataSource.push(data);
      }
    })
  }

}
