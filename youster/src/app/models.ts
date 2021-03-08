export class Playlist {
  name : String;
  drive_id: String;
  visbility : String;
}

export class Song {
  title : String;
  playlist : String;
  filename : String;
  drive_id: String;
  youtube_id: String;
}

export class Track {
  title : String;
  playlist : String;
  tags: Array<String>;
  drive_id: String;
  youtube_id: String;
  filename : String;
}