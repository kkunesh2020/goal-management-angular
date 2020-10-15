import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {
  constructor(private auth: AuthService, private route: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.auth.user$.subscribe(async (userProfile) => {
        if(userProfile == null){
          console.log("Not logged in");
          this.route.navigate(['/']);
        }else if(userProfile.isAdmin == false){
          console.log("Is not admin");
          this.route.navigate(['/']);
        }
      })
    return true;
  }

}
