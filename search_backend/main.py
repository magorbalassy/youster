# Drive imports
from __future__ import print_function
from apiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools

# Appengine imports
import requests_toolbelt.adapters.appengine
from flask import Flask, jsonify, render_template, request, Response
from google.appengine.ext import ndb

# My imports
import json, logging, requests
from models import Playlist, Track, User

app = Flask(__name__)
requests_toolbelt.adapters.appengine.monkeypatch()

logging.basicConfig(filename='search.log',level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p')

DEVELOPER_KEY = "Please use your own API key"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

def youtube_search(searchtext):
  youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                  developerKey=DEVELOPER_KEY)

  search_response = youtube.search().list(
      q=searchtext,
      part="id,snippet",
      maxResults=10,
      type="video"
  ).execute()

  videos = []
  channels = []
  playlists = []

  # Add each result to the appropriate list, and then return the lists of
  # matching videos.
  logging.info('searchresult %s' % [ _["id"]["kind"] for _ in search_response.get("items",[])] )
  for search_result in search_response.get("items", []):
    if search_result["id"]["kind"] == "youtube#video":
      videos.append("%s (%s)" % (search_result["snippet"]["title"],
                                 search_result["id"]["videoId"]))
  logging.info('Search result for %s: %s, %d elements.' %(searchtext, videos, len(videos)))
  return videos

def custom_response(msg):
  response = jsonify({'results':msg})
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response

def create_playlist():
  pass

'''@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response'''

@app.route('/rest/')
@app.route('/rest/index')
def index():
    return "Flask server is running!"

@app.route('/rest/search/<string:search_string>')
def search(search_string):
    return custom_response(youtube_search(search_string))


@app.route('/rest/playlists/<string:name>', methods=['GET', 'POST'])
@app.route('/rest/playlists', methods=['GET', 'POST'])
def playlists(name=None):
  res = []
  playlists = Playlist.query().fetch()
  if request.method == 'GET':
    if len(playlists) == 0 :
      unc_key = unc.put()
      unc = Playlist(name='Uncategorized', visibility='public', drive_id=unc_key)
      playlists.append(unc)
    for playlist in playlists:
      res.append(playlist.serialize())
    print(res)
    return custom_response(res)
  elif request.method == 'POST':
    p_names = [ p.name for p in playlists]
    if name in p_names:
      return custom_response('exists')
    else:
      r = requests.get('http://gc.maz.si/createpl/%s' % name)
      drive_id = r.json()['results']
      p = Playlist(name=name, drive_id=drive_id, visibility='public')
      p.put()
      return custom_response(p.serialize())

@app.route('/rest/tracks', methods=['GET', 'POST'])
def tracks():
  tracks = Track.query().fetch()
  return str(tracks)
  