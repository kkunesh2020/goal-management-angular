import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import CommitClass from 'src/app/shared/models/commit';
import { Commit } from 'src/app/shared/models/commit.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GithubService } from 'src/app/shared/services/github.service';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-upload-commit',
  templateUrl: './upload-commit.component.html',
  styleUrls: ['./upload-commit.component.scss'],
})
export class UploadCommitComponent implements OnInit {
  userRepos: any;
  loading = false;
  userCommits: any;
  goalID: string;
  uid: string;
  selectedCommitObj: Commit;
  selectRepo = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private githubService: GithubService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<UploadCommitComponent>,
    private goalService: GoalService
  ) {
    this.goalID = data.goal.id;
    this.uid = this.authService.userEmail;
  }

  ngOnInit() {
    this.githubService.viewUserRepos().then((data) => {
      this.userRepos = data;
      console.log('got the user repos', this.userRepos);
      console.log(this.userRepos);
    });
  }

  selectedRepo(commitLink: string, repoName: string) {
    this.selectRepo = repoName;
    const altLink = commitLink.split('{')[0]; // getting only commit link (removes unessary error)
    this.githubService.viewRepoCommits(altLink).then((data) => {
      this.userCommits = data;
    });
  }

  selectedCommit(commitLink) {
    this.selectedCommitObj = new CommitClass(commitLink, this.uid);
  }

  addCommit() {
    this.loading = true;
    console.log('new commit', this.selectedCommitObj);
    this.goalService
      .addCommitToGoal(this.goalID, this.selectedCommitObj)
      .then(() => {
        this.loading = false;
        this.dialogRef.close(this.selectedCommitObj);
      });
  }
}
