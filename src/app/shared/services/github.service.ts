import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  userGithubToken: string = "";
  githubUsername: string = "";
  githubProfile: any;
  constructor(private http: HttpClient) { 
  }

  viewUserRepos(){
    let header = new HttpHeaders().set(
      "Authorization",
       this.userGithubToken
    );

    return this.http.get(`https://api.github.com/search/repositories?q=user:${this.githubUsername}`, {headers:header});
  }

  viewRepoCommits(repoName){
    let header = new HttpHeaders().set(
      "Authorization",
       this.userGithubToken
    );

    return this.http.get(`https://api.github.com/repos/${this.githubUsername}/${repoName}/commits`, {headers:header});
  }
}
