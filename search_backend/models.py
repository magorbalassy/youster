from google.appengine.ext import ndb

class Track(ndb.Model):
  title = ndb.StringProperty()
  playlist = ndb.StringProperty()
  tags = ndb.StringProperty(repeated=True)
  youtube_id = ndb.StringProperty()
  drive_id = ndb.StringProperty()  
  #uploaded_by = ndb.StringProperty()

class Playlist(ndb.Model):
  
  def serialize(self):
    return {
      'drive_id': self.drive_id,
      'name': self.name,
      'location': self.visibility
    }

  drive_id = ndb.StringProperty()
  name = ndb.StringProperty()
  visibility = ndb.StringProperty()
  
class User(ndb.Model):
  user = ndb.StringProperty()
  fname = ndb.StringProperty()
  lname = ndb.StringProperty()
  email = ndb.StringProperty()
  playlists = ndb.StringProperty(repeated=True)