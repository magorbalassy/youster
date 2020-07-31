import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Playlist, Song } from './models'


@Injectable()
export class PlaylistService {

  public response: Object;

  constructor(private http: HttpClient) { }

  getPlaylists() {
    var url = 'http://192.168.10.10:8080/rest/playlists';

    console.log("getPlaylists().");
    return this.http.get(url);
  }

  createPlaylist(name?: String): Observable<Playlist> {
    //switching to ui<->single backend mode
    //var url = `http://gc.maz.si/createpl/${name}`;
    var url = `http://192.168.10.10:8080/rest/playlists/${name}`;

    if (name == undefined) {
      console.log("Getting playlists.");
      return this.http.get(url)
        .map(res=>res['results']);
    }
    else {
      console.log("Creating playlist - ", name);
      return this.http.post(url, null)
        .map(res=>res['results']);
    }
  }

  getSongs(text: String): Observable<String[]> {
    const url = `http://192.168.10.10:8080/rest/search/${text}`;
    console.log('search text:',text, url);
    return this.http.get(url)
      .map(res=>res['results']);
  }

  downloadService(song: Song): Observable<String[]> {
    const url = `http://192.168.10.10:8080/rest/drive`;
    console.log('download song:',song, url);
    let postData = new FormData();
    postData.append('youtube_id' , song.youtube_id as string);
    postData.append('title' , song.title as string);
    postData.append('playlist' , song.playlist as string);

    return this.http.post(url, postData)
      .map(res=>res['results']);
  }

}
