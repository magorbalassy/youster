# Drive imports
from __future__ import print_function
from apiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
from HTMLParser import HTMLParser

# Appengine imports
from flask import Flask, jsonify, render_template, request, Response
from google.appengine.ext import ndb

# My imports
import json
from models import Playlist, Track, User

app = Flask(__name__)

DEVELOPER_KEY = "Please use your own API key"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

def youtube_search(searchtext):
  youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                  developerKey=DEVELOPER_KEY)

  search_response = youtube.search().list(
      q=searchtext,
      part="id,snippet",
      maxResults=3
  ).execute()

  videos = []
  channels = []
  playlists = []

  # Add each result to the appropriate list, and then return the lists of
  # matching videos.
  for search_result in search_response.get("items", []):
    if search_result["id"]["kind"] == "youtube#video":
      videos.append("%s (%s)" % (search_result["snippet"]["title"],
                                 search_result["id"]["videoId"]))
  return videos

def custom_response(msg):
  response = jsonify({'results':msg})
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response

@app.route('/rest/')
@app.route('/rest/index')
def index():
    return "Flask server is running!"

@app.route('/rest/search/<string:search_string>')
def search(search_string):
    return custom_response(youtube_search(search_string))

@app.route('/rest/playlists', methods=['GET', 'POST'])
def playlists():
  res = []
  playlists = Playlist.query().fetch()
  if request.method == 'GET':
    if len(playlists) == 0 :
      unc = Playlist(name='Uncategorized', visibility='public')
      unc_key = unc.put()
      playlists.append(unc)
    for playlist in playlists:
      res.append({
        'id': playlist.key.id(),
        'name': playlist.name,
        'location': playlist.visibility
      })
    return custom_response(res)
  elif request.method == 'POST':
    if 'name' in request.form:
      if request.form['name'] in p_names:
        return custom_response('exists')
      else:
        p = Playlist(name=request.form['name'])
        p.put()
        return custom_response(str(request.form))
    else:
      return custom_response('Name must be specified.')

@app.route('/rest/tracks')
def tracks():
  tracks = Track.query().fetch()
  return str(tracks)
  