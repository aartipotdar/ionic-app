import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Subscription, take } from 'rxjs';
import { App, AppState } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    //console.log(this.platform.is('hybrid'));
    if(!Capacitor.isPluginAvailable('SpalshScreen')) {
      SplashScreen.hide();
    }
    this.platform.ready().then(() => {
    }).catch(() => {
      StatusBar.show();
    });
  }

  ngOnInit() {
      this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if(!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
      });
      App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
  }

  onLogout() {
    this.authService.logout();
    //this.router.navigateByUrl('/auth');
  }

  ngOnDestroy() {
      if(this.authSub) {
        this.authSub.unsubscribe();
      }
  }

  private checkAuthOnResume(state: AppState) {
    if(state.isActive) {
      this.authService.autoLogin().pipe(take(1)).subscribe(success => {
        if(!success) {
          this.onLogout();
        }
      })
    }
  }

}
