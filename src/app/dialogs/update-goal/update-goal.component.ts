import { ChangeDetectorRef, Component, Inject } from '@angular/core';
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

@Component({
  selector: 'gms-update-goal',
  templateUrl: './update-goal.component.html',
  styleUrls: ['./update-goal.component.scss'],
})
export class UpdateGoalComponent {
  madeChanges = false;
  isLoading = false;
  currentGoal: any;
  isCompleted = false;
  createdByStudent: boolean = false;
  updated: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UploaderComponent>,
    private afs: AngularFirestore,
    private goalService: GoalService,
    private dialog: MatDialog,
    private githubService: GithubService,
    private authService: AuthService
  ) {
    console.log('data', this.data);
    this.currentGoal = {
      description: data.description,
      dueDate: data.dueDate,
      hasCompleted: data.hasCompleted,
      pending: data.pending,
      declined: data.declined,
      createdBy: data.createdBy,
      assignedToID: data.assignedToID,
      id: data.id,
      classID: data.classID,
      files: data.files,
      links: data.links,
      commits: data.commits,
    };
    this.createdByStudent = (this.currentGoal.createdBy.accountType == "student");
    this.currentGoal = this.goalService.validateGoal(this.currentGoal);
    this.isCompleted = data.isCompleted;
    console.log('commits', this.currentGoal);
  }

  updateGoal(isDone) {
    this.madeChanges = true;
    this.isLoading = true;
    if (isDone) {
      // mark as done
      this.goalService
        .completeGoal(this.currentGoal, this.data.email)
        .then(() => {
          this.isLoading = false;
          this.madeChanges = true;
          this.dialogRef.close('updated');
        });
    } else {
      // unsubmit
      this.goalService
        .unsubmitGoal(this.currentGoal, this.data.email)
        .then(() => {
          this.isLoading = false;
          this.madeChanges = true;
          this.dialogRef.close('updated');
        });
    }
  }

  deleteGoal(){
    this.isLoading = true;
    this.goalService.deleteGoal(this.currentGoal).then(() => {
      this.dialogRef.close({status: "deleted", id: this.currentGoal.id});
    })
  }

  closeModal(){
    console.log("returning", this.currentGoal)
    if(this.updated){
      this.dialogRef.close({data: this.currentGoal, status: "updated"});
    }else{
      this.dialogRef.close();
    }
    
  }

  insertFileDialog() {
    const dialogRef = this.dialog.open(UploaderComponent, {
      height: '40rem',
      width: '60rem',
      data: { goal: this.currentGoal, email: this.data.email },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== '') {
        this.currentGoal.files = this.currentGoal.files.concat(result);
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
    const dialogRef = this.dialog.open(UploadCommitComponent, {
      height: '30rem',
      width: '25rem',
      data: { goal: this.currentGoal, uid: this.data.email },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== '') {
        this.updated = true;
        this.currentGoal.commits != null
          ? (this.currentGoal.commits = this.currentGoal.commits.concat(
              result
            ))
          : (this.currentGoal.commits = result);
      }
    });
    console.log(this.githubService.githubProfile);
    
  }

  insertLinkDialog() {
    const dialogRef = this.dialog.open(UploadLinkComponent, {
      height: '14rem',
      width: '25rem',
      data: { goal: this.currentGoal, email: this.data.email },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== '') {
        this.updated = true;
        this.currentGoal.links != null
          ? (this.currentGoal.links = this.currentGoal.links.concat(result))
          : (this.currentGoal.links = result);
      }
    });
  }

  findIndexOfFile(file: FileClass) {
    for (let i = 0; i < this.currentGoal.files.length; i++) {
      const fileData: FileClass = this.currentGoal.files[i];
      if (fileData.downloadURL === file.downloadURL) {
        return i;
      }
    }
  }

  deleteFile(file: FileClass) {
    this.currentGoal.files.splice(this.findIndexOfFile(file), 1); // remove file from array
    this.currentGoal.files = this.currentGoal.files;
    this.goalService.deleteFileFromGoal(file, this.currentGoal.id);
    this.updated = true;
  }

  deleteLink(url: string) {
    const newLinks = this.currentGoal.links.filter((e) => e.url !== url);
    this.currentGoal.links = newLinks;
    this.goalService.removeLinks(newLinks, this.currentGoal.id);
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
