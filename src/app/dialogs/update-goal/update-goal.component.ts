import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import FileClass from 'src/app/shared/models/file';
import { GoalService } from 'src/app/shared/services/goal.service';
import { Goal } from '../../shared/models/goal.model';
import { UploaderComponent } from '../upload-file/uploader/uploader.component';
import { UploadLinkComponent } from '../upload-link/upload-link.component';

@Component({
  selector: 'gms-update-goal',
  templateUrl: './update-goal.component.html',
  styleUrls: ['./update-goal.component.scss']
})


export class UpdateGoalComponent{
  madeChanges:boolean = false;
  isLoading:boolean = false;
  currentGoal: Goal;
  isCompleted: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UploaderComponent>, private afs: AngularFirestore, private goalService: GoalService, private dialog: MatDialog) {
    console.log("data", this.data);
    this.currentGoal = {description: data.description,  dueDate: data.dueDate, hasCompleted: data.hasCompleted, pending: data.pending, declined: data.declined,createdBy: data.createdBy,
      assignedToID: data.assignedToID, id: data.id, classID: data.classID, files: data.files, links: data.links};
    this.currentGoal = this.goalService.validateGoal(this.currentGoal);
    this.isCompleted = data.isCompleted;
    console.log("files", this.currentGoal.files);
   }


  updateGoal(isDone){
    console.log(this.currentGoal, "current goal");
    this.madeChanges = true;
    this.isLoading = true;
    if(isDone){ // mark as done
      this.goalService.completeGoal(this.currentGoal, this.data.uid).then(() => {
        this.isLoading = false;
        this.madeChanges = true;
        this.dialogRef.close('updated');
      });
    }else{// unsubmit
      this.goalService.unsubmitGoal(this.currentGoal, this.data.uid).then(() => {
        this.isLoading = false;
        this.madeChanges = true;
        this.dialogRef.close('updated');
      });
    }
  }

  insertFileDialog(){
    let dialogRef = this.dialog.open(UploaderComponent, {height: '40rem', width: '60rem', data: {goal: this.currentGoal, uid: this.data.uid}});
    dialogRef.afterClosed().subscribe((result) => {
      console.log("got the result", result);
      if(result != ''){
        this.currentGoal.files = this.currentGoal.files.concat(result);
        console.log("detected the changes", result);
      }
    })
  }

  insertLinkDialog(){
    let dialogRef = this.dialog.open(UploadLinkComponent, {height: '14rem', width: '25rem', data: {goal: this.currentGoal, uid: this.data.uid}});
    dialogRef.afterClosed().subscribe((result) => {
      console.log("got the link result", result);
      if(result != ''){
        this.currentGoal.links != null ? this.currentGoal.links = this.currentGoal.links.concat(result) : this.currentGoal.links = result;
        console.log("detected the link changes");
      }
    })
  }

  findIndexOfFile(file: FileClass) {
    for (let i = 0; i < this.currentGoal.files.length; i++) {
      let fileData: FileClass = this.currentGoal.files[i];
      if(fileData.downloadURL === file.downloadURL) {
        return i;
      }
    }
  }

  deleteFile(file: FileClass){
    this.currentGoal.files.splice(this.findIndexOfFile(file), 1); //remove file from array
    this.currentGoal.files = this.currentGoal.files;
    this.goalService.deleteFileFromGoal(file, this.currentGoal.id);
  }

  deleteLink(url: string){
    let newLinks = this.currentGoal.links.filter(e => e.url !== url);
    this.currentGoal.links = newLinks;
    console.log("the new LInks", newLinks);
    this.goalService.removeLinks(newLinks, this.currentGoal.id);
  }

  goToLink(urlToOpen: string){
    let url: string = '';
    if (!/^http[s]?:\/\//.test(urlToOpen)) {
        url += 'http://';
    }

    url += urlToOpen;
    window.open(url, "_blank");
  }

}
