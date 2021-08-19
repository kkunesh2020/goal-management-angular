import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CreateClassComponent } from 'src/app/dialogs/create-class/create-class.component';
import { CreateGoalComponent } from 'src/app/dialogs/create-goal/create-goal.component';
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
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(){
    this.getClasses();
    // let actionData = this.router.getCurrentNavigation().extras.state.action;
    // if(actionData && actionData == "delete"){
    //   this.classes = this.classes.filter(c => c.id != this.router.getCurrentNavigation().extras.state.id);
    // }
    
  }

  goToCard(classID: string) {
    this.router.navigate([`/director/${classID}`]);
  }

  getClasses() {
    this.classService.getAllClasses().then((classData) => {
      console.log("done")
      this.classes = classData;
    });
    this.loading = false;
  }


  createClassDialog() {
    // opens up the create goal dialog to create a new goal
    // passes in class data into the dialog
    const dialogRef = this.dialog.open(CreateClassComponent, {
      width: '27rem',
      height: '40rem',
      panelClass: 'custom-modalbox',
    });

    dialogRef.onClose.subscribe((result) => {
      if (result.result === 'success') {
        // if a goal is created reshow goals
        this.classes.push(result.data);
      }
    });
  }

}
