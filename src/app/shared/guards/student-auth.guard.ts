import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}


  // check if user is a student
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.authService.user$.subscribe(async (userProfile) => {
        if (userProfile == null) {
          this.router.navigate(['/']);
        } else {
          if (userProfile.accountType === 'student') {
            this.router.navigate(['/']);
          }
        }
      });
      return true;
  }
}
