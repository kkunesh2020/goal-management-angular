import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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

        this.classService.getStudentsByEmails(this.classData.studentEmails).then((studentData) => {
          if (studentData) {
            this.studentDataSource = studentData;
            this.loading = false;
          }
        })

      })



    });
  }

  ngOnInit() {
  }

}
