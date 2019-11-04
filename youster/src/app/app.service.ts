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
    var url = 'http://127.0.0.1:8080/playlists';
    //var url = 'http://178.83.233.13:5000/sendq/';    
    //var url = 'http://examsim-1.appspot.com/sendq/';

    console.log("Getting playlists - getPlaylists().");
    return this.http.get(url)
      .map(res=>res.json());
  }

  getSongs(text: String): Observable<String[]> {
    const url = `http://127.0.0.1:8080/search/${text}`;
    console.log('search text:',text, url);
    return this.http.get(url)
      .map(res=>res.json());
  }

  downloadService(text: String): Observable<String[]> {
    const url = `http://127.0.0.1:8080/download/${text}`;
    console.log('download text:',text, url);
    return this.http.get(url)
      .map(res=>res.json());
  }

}
