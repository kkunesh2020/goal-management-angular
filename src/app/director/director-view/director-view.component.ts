import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Class } from 'src/app/shared/models/class.model';
import { DirectorClass } from 'src/app/shared/models/directorClass.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClassService } from 'src/app/shared/services/class.service';

@Component({
  selector: 'gms-director-view',
  templateUrl: './director-view.component.html',
  styleUrls: ['./director-view.component.scss']
})
export class DirectorViewComponent implements OnInit {

  classes: DirectorClass[];
  loading = true;
  constructor(
    private classService: ClassService,
    private router: Router
  ) {
  }

  ngOnInit(){
    this.getClasses();
  }

  goToCard(classID: string) {
    this.router.navigate([`/classes/${classID}`]);
  }

  getClasses() {
    this.classService.getAllClasses().then((classData) => {
      console.log("done")
      this.classes = classData;
    });
    this.loading = false;
  }

}
