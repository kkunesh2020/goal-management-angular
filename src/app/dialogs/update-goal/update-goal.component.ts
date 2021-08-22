import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import FileClass from 'src/app/shared/models/file';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GithubService } from 'src/app/shared/services/github.service';
import { GoalService } from 'src/app/shared/services/goal.service';
import { Goal } from '../../shared/models/goal.model';
import { UploadCommitComponent } from '../upload-commit/upload-commit.component';
import { UploaderComponent } from '../upload-file/uploader/uploader.component';
import { UploadLinkComponent } from '../upload-link/upload-link.component';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'gms-update-goal',
  templateUrl: './update-goal.component.html',
  styleUrls: ['./update-goal.component.scss'],
})
export class UpdateGoalComponent implements OnInit{
  madeChanges = false;
  isLoading = false;
  public data: any;
  isCompleted = false;
  createdByStudent: boolean = false;
  updated: boolean = false;

  constructor(
    private afs: AngularFirestore,
    private goalService: GoalService,
    private dialog: MatDialog,
    private githubService: GithubService,
    private authService: AuthService,
    protected dialogService: NbDialogService,
    @Optional() protected dialogRef: NbDialogRef<UpdateGoalComponent>
  ) {

  }

  ngOnInit(){
    if(this.data){
      console.log("scope", this.data)
      this.createdByStudent = (this.data.createdBy.accountType == "student");
      this.data = this.goalService.validateGoal(this.data);
      this.isCompleted =  this.data.isCompleted;
      console.log('commits', this.data);
    }
  }

  updateGoal(isDone) {
    this.madeChanges = true;
    this.isLoading = true;
    if (isDone) {
      // mark as done
      console.log("intpus", this.data);
      this.goalService
        .completeGoal(this.data, this.authService.userEmail)
        .then(() => {
          this.isLoading = false;
          this.madeChanges = true;
          this.dialogRef.close('updated');
        });
    } else {
      // unsubmit
      this.goalService
        .unsubmitGoal(this.data, this.data.email)
        .then(() => {
          this.isLoading = false;
          this.madeChanges = true;
          this.dialogRef.close('updated');
        });
    }
  }

  deleteGoal(){
    this.isLoading = true;
    this.goalService.deleteGoal(this.data).then(() => {
      this.dialogRef.close({status: "deleted", id: this.data.id});
    })
  }

  closeModal(){
    console.log("returning", this.data)
    if(this.updated){
      this.dialogRef.close({data: this.data, status: "updated"});
    }else{
      this.dialogRef.close();
    }
    
  }

  insertFileDialog() {
    const dialogRef = this.dialogService.open(UploaderComponent, {
      context: {data: { goal: this.data, email: this.authService.userEmail }}
    });
    dialogRef.onClose.subscribe((result) => {
      if (result !== '') {
        this.data.files = this.data.files.concat(result);
        console.log('detected the changes', result);
        this.updated = true;
      }
    });
  }

  async viewGithubCommit() {
    if (this.githubService.githubProfile == null) {
      await this.authService.githubSignin();
    } 

    // this.$userRepos = this.githubService.viewUserRepos();
    const dialogRef = this.dialogService.open(UploadCommitComponent, {
      context: {data: { goal: this.data, uid: this.data.email }}
    });
    dialogRef.onClose.subscribe((result) => {
      if (result !== '') {
        this.updated = true;
        this.data.commits != null
          ? (this.data.commits = this.data.commits.concat(
              result
            ))
          : (this.data.commits = result);
      }
    });
    console.log(this.githubService.githubProfile);
    
  }

  insertLinkDialog() {
    const dialogRef = this.dialogService.open(UploadLinkComponent, {
      context: {data: { goal: this.data, email: this.data.email }}
    });
    dialogRef.onClose.subscribe((result) => {
      if (result !== '') {
        this.updated = true;
        this.data.links != null
          ? (this.data.links = this.data.links.concat(result))
          : (this.data.links = result);
      }
    });
  }

  findIndexOfFile(file: FileClass) {
    for (let i = 0; i < this.data.files.length; i++) {
      const fileData: FileClass = this.data.files[i];
      if (fileData.downloadURL === file.downloadURL) {
        return i;
      }
    }
  }

  deleteFile(file: FileClass) {
    this.data.files.splice(this.findIndexOfFile(file), 1); // remove file from array
    this.data.files = this.data.files;
    this.goalService.deleteFileFromGoal(file, this.data.id);
    this.updated = true;
  }

  deleteLink(url: string) {
    const newLinks = this.data.links.filter((e) => e.url !== url);
    this.data.links = newLinks;
    this.goalService.removeLinks(newLinks, this.data.id);
    this.updated = true;
  }

  goToLink(urlToOpen: string) {
    let url = '';
    if (!/^http[s]?:\/\//.test(urlToOpen)) {
      url += 'http://';
    }

    url += urlToOpen;
    window.open(url, '_blank');
  }
}
