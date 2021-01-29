import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { GithubService } from 'src/app/shared/services/github.service';
import { GoalService } from 'src/app/shared/services/goal.service';

@Component({
  selector: 'gms-upload-commit',
  templateUrl: './upload-commit.component.html',
  styleUrls: ['./upload-commit.component.scss']
})
export class UploadCommitComponent implements OnInit {

  userRepos: any;
  loading: boolean = false;
  userCommits: any;
  selectedCommitLink: string = "";
  selectRepo: string = "";
  
  constructor(private githubService: GithubService, public dialogRef: MatDialogRef<UploadCommitComponent>, private goalService: GoalService) { }

  ngOnInit() {
    this.githubService.viewUserRepos().then((data) => {
      this.userRepos = data;
      console.log("got the user repos");
      console.log(this.userRepos)
    });
  }

  selectedRepo(commitLink: string, repoName: string){
    this.selectRepo = repoName;
    let altLink = commitLink.split("{")[0]; //getting only commit link (removes unessary error)
    this.githubService.viewRepoCommits(altLink).then((data) => {
      this.userCommits = data;
      console.log("da commits", this.userCommits)
    })
  }

  selectedCommit(commitLink){
    this.selectedCommitLink = commitLink;
  }

  addCommit(){
    this.loading = true;
    console.log("new commit", this.selectedCommitLink)
    this.goalService.addLinkToGoal(this.goalID, this.selectedCommitLink).then(() => {
      this.loading = false;
      this.dialogRef.close(this.selectedCommitLink);
    });
  }

}
