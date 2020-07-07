import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { Playlist, Song } from './models'


@Injectable()
export class PlaylistService {

  public response: Object;

  constructor(private http: Http) { }

  getPlaylists(): Observable<Playlist[]> {
    var res: Response;
    var url = 'http://192.168.10.10:8080/rest/playlists';
    //var url = 'http://178.83.233.13:5000/sendq/';    
    //var url = 'http://examsim-1.appspot.com/sendq/';

    console.log("Getting playlists - getPlaylists().");
    return this.http.get(url)
      .map(res=>res.json()['results']);
  }

  createPlaylist(name: String): Observable<Playlist[]> {
    var res: Response;
    var url = `http://gc.maz.si/createpl/${name}`;

    console.log("Creating playlist - ", name);
    return this.http.get(url)
      .map(res=>res.json()['results']);
  }
  getSongs(text: String): Observable<String[]> {
    const url = `http://192.168.10.10:8080/rest/search/${text}`;
    console.log('search text:',text, url);
    return this.http.get(url)
      .map(res=>res.json()['results']);
  }

  downloadService(text: String): Observable<String[]> {
    const url = `http://gc.maz.si/download/${text}`;
    console.log('download text:',text, url);
    return this.http.get(url)
      .map(res=>res.json());
  }

}
