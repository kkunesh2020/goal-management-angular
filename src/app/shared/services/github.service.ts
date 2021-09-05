import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  userGithubToken = '';
  githubUsername = '';
  githubProfile: any;
  constructor(private http: HttpClient) {}

  viewUserRepos(): Promise<any> {
    console.log("getting from", this.userGithubToken, this.githubUsername, this.githubProfile)
    const header = new HttpHeaders().set('Authorization', `Bearer ${this.userGithubToken}`);

    return this.http
      .get(`https://api.github.com/user/repos`, { headers: header })
      .pipe(take(1))
      .toPromise();
  }

  viewRepoCommits(commitLink) {
    const header = new HttpHeaders().set('Authorization', this.userGithubToken);

    return this.http
      .get(`${commitLink}`, { headers: header })
      .pipe(take(1))
      .toPromise();
  }
}
