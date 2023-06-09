import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TimeoutService } from './timeout.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private timeoutService: TimeoutService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage.getItem('loggedIn')) {
      !this.timeoutService.inSession && this.timeoutService.init();
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}
