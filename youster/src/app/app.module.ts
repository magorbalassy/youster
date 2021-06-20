import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth/auth.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchComponent } from './search/search.component';
import { BodyComponent } from './body/body.component';
import { MenuService } from './menu.service';

import { PlaylistService } from './backend/backend.service';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {ToastModule} from 'primeng/toast';
import {TooltipModule} from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';

import {environment} from "../environments/environment";
import { UserComponent } from './user/user.component';

const config = {
  apiKey: environment.apiKey,
  authDomain: "youster-db.firebaseapp.com",
  databaseURL: "https://youster-db.firebaseio.com",
  projectId: "youster-db",
  storageBucket: "youster-db.appspot.com",
  messagingSenderId: "253186525931",
  appId: "1:253186525931:web:1fe25bbbe831608df90cae"
}

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    SearchComponent,
    BodyComponent,
    HomeComponent,
    UserComponent
  ],
  imports: [
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    InputTextModule,
    ListboxModule,
    OverlayPanelModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [AuthGuard, AuthService, MenuService, MessageService, PlaylistService],
  bootstrap: [AppComponent]
})
export class AppModule { }
