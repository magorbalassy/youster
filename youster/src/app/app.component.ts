import { Component, ElementRef, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PlaylistService } from './app.service';
import { Playlist } from './models';
import { Song } from './models';
import 'rxjs/add/operator/map'
import { SelectItem } from 'primeng/api';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('drop') drop:ElementRef;
  playlists : Playlist[] = [];
  selection : SelectItem[] = [];
  selectedPlaylist : Playlist;
  selectedSongs : SelectItem[] = [];
  songsList : SelectItem[] = [];
  results : String[] = [];
  searchText : String;
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
          this.selection.push(p);
        }, this);
        this.selectedPlaylist = this.selection[0] || "None";
      });
    console.log('PlayerComponent Constructor executed.');
  }

  create(event, el) {
    var id: String;

    el.hide(event)
    this.playlistService.createPlaylist(this.newPlaylist)
      .subscribe(
        data => {
          console.log('response', data);
          if (data != 'folder exists') { id = data } 
        }
      )

  }

  search() {
    console.log('text: ', this.searchText);
    this.playlistService.getSongs(this.searchText)
      .subscribe(
        data => {
          this.results = data;
          this.songsList.length = 0;
          console.log('response:', this.results);
          console.log('result :', this.results.length, this.results);
          for (var i = 0, len = this.results.length; i < len; i++) {
            this.songsList.push({
              label:this.results[i].substr(0, this.results[i].length-13),
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
