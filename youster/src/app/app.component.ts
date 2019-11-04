import { Component, ElementRef, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PlaylistService } from './app.service';
import { Playlist } from './models';
import { Song } from './models';
import 'rxjs/add/operator/map'
import {SelectItem} from 'primeng/api';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('drop', {static: false}) drop:ElementRef;
  playlists : Playlist[] = [];
  selection : SelectItem[] = [];
  selectedPlaylist : String = '';
  selectedSongs : SelectItem[] = [];
  songsList : SelectItem[] = [];
  results : String[] = [];
  searchText = 'search';
  faSearch = faSearch;
  faPlus = faPlus;
  display: boolean = false;
  newPlaylist: String;


  constructor(private playlistService: PlaylistService){
    console.log('PlayerComponent Constructor  started');
    playlistService.getPlaylists()
      .subscribe(
      data => {
        this.playlists = data;
        this.playlists.forEach(function(p) {
          console.log(p['name']);
          this.selection.push({name:p['name'], value:p} as SelectItem);
          this.drop.nativeElement.onchange();
        }, this);
        this.selectedPlaylist = this.selection[0].label || "None";
        console.log('playlists:', this.playlists, this.selection, this.selectedPlaylist );
        console.log('drop:', this.drop);
      });
    console.log('PlayerComponent Constructor executed.');
  }

  create() {
    console.log(this.selectedPlaylist);
  }

  search() {
    console.log('text: ',this.searchText);
    this.playlistService.getSongs(this.searchText)
      .subscribe(
        data => {
          this.results = data['results'];
          this.songsList.length = 0;
          console.log('response:',this.results);
          console.log('result :',this.results.length,this.results);
          for (var i = 0, len = this.results.length; i < len; i++) {
            this.songsList.push({
              label:this.results[i].substr(0,this.results[i].length-13),
              value:{title:this.results[i]}
            } as SelectItem);
          }
          console.log('songlist:',this.songsList);
        }
      );
  }

 download() {
   console.log(this.selectedSongs[0].label);
  this.playlistService.downloadService(this.selectedSongs[0].title)
    .subscribe(
      data => {
        console.log('response from download:',data);
      }
    );
  console.log('download:',this.selectedSongs);
 } 

}
