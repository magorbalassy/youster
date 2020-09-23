import { Component, ElementRef, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PlaylistService } from '../backend/backend.service';
import { Playlist } from '../models';
import { Song } from '../models';
import 'rxjs/add/operator/map'
import { SelectItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
//import { DropdownModule } from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent  {
  @ViewChild('drop') drop:ElementRef;
  playlists : Playlist[] = [];
  selection : SelectItem[] = [];
  selectedPlaylist : Playlist;
  selectedSongs : Song[] = [];
  songsList : SelectItem[] = [];
  results : String[] = [];
  searchText : String;
  display: boolean = false;
  newPlaylist: String;

  constructor(private playlistService: PlaylistService,
              private messageService: MessageService) {
    console.log('PlayerComponent Constructor  started');
    playlistService.getPlaylists()
      .subscribe(
      data => {
        console.log('getPlaylists() response data:', data);
        this.playlists = data['results'];
        this.selectedPlaylist = this.playlists[0];
        this.playlists.forEach(function(p) {
          this.selection.push(p);
        }, this);
      });
    console.log('PlayerComponent Constructor executed.');
  }

  create(el: OverlayPanel) {
    var id: String;

    el.hide()
    this.playlistService.createPlaylist(this.newPlaylist)
      .subscribe(
        data => {
          if (JSON.stringify(data) != JSON.stringify("exists")) { 
            console.log('Created playlist folder and db item', JSON.stringify(data));
            this.playlists.push(data);
            this.selection = [];
            this.playlists.forEach(function(p) {
              this.selection.push(p);
            }, this);
            this.messageService.add({key: 'pl', severity:'success', summary: 'Created folder.'});
          }
          else {
            console.log('Folder exists.');
            this.messageService.add({key: 'pl', severity:'error', summary: 'Folder exists on Drive'});
          }
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
          this.selectedSongs = [];
          console.log('response:', this.results);
          console.log('result :', this.results.length, this.results);
          for (var i = 0, len = this.results.length; i < len; i++) {
            this.songsList.push({
              label:this.results[i].substr(0, this.results[i].length-13),
              value:{ 
                title:this.results[i], 
                playlist:this.selectedPlaylist.name, 
                youtube_id:this.results[i].slice(length-12,length-1),
                drive_id:'',
                filename:'',
              } as Song
            } );
          }
          console.log('songlist:',this.songsList);
        }
      );
  }

 download() {
  console.log(this.selectedSongs[0].youtube_id);
  this.playlistService.downloadService(this.selectedSongs[0])
    .subscribe(
      data => {
        console.log('response from download:',data);

      }
    );
 } 

}
