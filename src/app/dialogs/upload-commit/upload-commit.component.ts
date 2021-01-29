import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { GithubService } from 'src/app/shared/services/github.service';

@Component({
  selector: 'gms-upload-commit',
  templateUrl: './upload-commit.component.html',
  styleUrls: ['./upload-commit.component.scss']
})
export class UploadCommitComponent implements OnInit {

  userRepos: any;
  userCommits: any;
  
  constructor(private githubService: GithubService) { }

  ngOnInit() {
    this.githubService.viewUserRepos().then((data) => {
      this.userRepos = data;
      console.log("got the user repos");
      console.log(this.userRepos)
    });
  }

  selectedRepo(commitLink: string){
    let altLink = commitLink.split("{")[0]; //getting only commit link (removes unessary error)
    this.githubService.viewRepoCommits(altLink).then((data) => {
      this.userCommits = data;
      console.log("da commits", this.userCommits)
    })
  }

}
