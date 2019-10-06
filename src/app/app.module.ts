import { NgModule, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FsLocalService } from './fs/services/fsLocal.service';
import { FsWebService } from './fs/services/fsWeb.service';

import { Platform } from '@ionic/angular';
import { UtilsService } from './utils/services/utils.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: 'IFsService',
      useFactory: (platform: Platform, utils: UtilsService) => platform.is('cordova') ? 
        new FsLocalService(utils) : new FsWebService(utils),
      deps: [Platform, UtilsService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
