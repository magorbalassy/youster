import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PlaylistService } from './app.service';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {ListboxModule} from 'primeng/listbox';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFontAwesomeModule } from 'angular-font-awesome';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    HttpModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    InputTextModule,
    ListboxModule,
    OverlayPanelModule,
    AngularFontAwesomeModule
  ],
  providers: [PlaylistService],
  bootstrap: [AppComponent]
})
export class AppModule { }
