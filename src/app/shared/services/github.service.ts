import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  userGithubToken: string = "";
  githubUsername: string = "";
  githubProfile: any;
  constructor(private http: HttpClient) { 
  }

  viewUserRepos(): Promise<any>{
    let header = new HttpHeaders().set(
      "Authorization",
       this.userGithubToken
    );

    return this.http.get(`${this.githubProfile.repos_url}`, {headers:header}).pipe(take(1)).toPromise();
  }

  viewRepoCommits(repoName){
    let header = new HttpHeaders().set(
      "Authorization",
       this.userGithubToken
    );

    return this.http.get(`https://api.github.com/repos/${this.githubUsername}/${repoName}/commits`, {headers:header});
  }
}
