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

import { NativeAudio } from '@ionic-native/native-audio/ngx';

import { SamplerWebService } from './sampler/services/samplerWeb.service';
import { SamplerNativeService } from './sampler/services/samplerNative.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: 'IFsService',
      useFactory: (platform: Platform, utils: UtilsService) => platform.is('cordova') ? 
        new FsLocalService(utils) : new FsWebService(utils),
        deps: [Platform, UtilsService]
    },
    {
      provide: "ISamplerService",
      useFactory: (platform: Platform, 
                  utils: UtilsService, 
                  nativeAudio: NativeAudio) => {
                    const fsService = platform.is('cordova') ? new FsLocalService(utils) : new FsWebService(utils);
                    return platform.is('cordova') ? 
                      new SamplerNativeService(utils, platform, nativeAudio) : new SamplerWebService(fsService, utils, platform)
                  }
        ,
        deps: [Platform, UtilsService, NativeAudio]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
