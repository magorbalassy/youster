import json, logging, os, pafy, socket, sys

from flask import Flask, jsonify, render_template, request, Response
from googleapiclient.discovery import build
from apiclient.http import MediaFileUpload
from oauth2client import file, client, tools
from httplib2 import Http
from werkzeug.utils import secure_filename

SCOPES = 'https://www.googleapis.com/auth/drive'
# We define the default parent folder name from Google drive for the Playlists
PLAYLISTS_FOLDER_NAME = 'Playlists'

app = Flask(__name__)

logging.basicConfig(filename='drive.log',level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p')

class Drive:
  """ 
  This the class which provides the interface to handle the required operetions
  with the Google Drive Api.
    
  Attributes: 
      service: The Drive API instance 
      PLAYLISTS_FOLDER_ID (str): The Drive ID of the folder where the playlist are stored

  Methods:
      __init__: constructor, will dinitialize Drive service and get the id of the folder
                containing the playlists 
  """
  def __init__(self):
    self.service = self.connect()
    self.PLAYLISTS_FOLDER_ID = self.get_id_by_name(PLAYLISTS_FOLDER_NAME)

  def connect(self):
    store = file.Storage('token.json')
    creds = store.get()
    if not creds or creds.invalid:
      flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
      creds = tools.run_flow(flow, store)
    return build('drive', 'v3', http=creds.authorize(Http()))
  
  def create_folder(self, folderName):
      # Check if folder exists
      for item in self.get_folder_content():
        pcs = item.split()
        if 'folder' in pcs[2] and pcs[0] == folderName:
            return 'folder exists'
      # Create a folder on Drive, returns the newly created folders ID
      body = {
          'name': folderName,
          'mimeType': "application/vnd.google-apps.folder",
          'parents': [self.PLAYLISTS_FOLDER_ID]
      }
      root_folder = self.service.files().create(body = body).execute()
      return root_folder['id']

  def get_folder_content(self):
      print(self.PLAYLISTS_FOLDER_ID)
      response = self.service.files().list(q="'"+self.PLAYLISTS_FOLDER_ID+"' in parents").execute()
      res = []
      for file in response.get('files', []):
          res.append('%s %s %s' % (file.get('name'), file.get('id'), file.get('mimeType')))
      return res

  def get_id_by_name(self, folderName):
    results = self.service.files().list(q="name='" + folderName + "'",
        fields="files(id)").execute()
    items = results.get('files', [])
    return str(items[0]['id'])

# Copy file to the specified Drive folder
  def copy_to_drive(self, filename, playlist):
      def api_media_upload(filename):
          parent = []
          parent.append(self.get_id_by_name(playlist))
          logging.info('Parent %s folder id: %s' %(playlist, parent))
          file_metadata = {'name' : filename, 'parents' : parent}
          media = MediaFileUpload(filename, mimetype='audio/mp4')
          file = self.service.files().create(body=file_metadata,
                                      media_body=media,
                                      fields='id').execute()
          return file.get('id')
      return api_media_upload(filename)

@app.before_request
def before_request():
    if request.remote_addr != socket.gethostbyname('maz.si'):
        return custom_response("Requests from your IP are not allowed.")

@app.route('/download/', methods=['GET', 'POST'])
def download():
  if request.method == "GET":
    logging.info('GET request')
    return custom_response('GET request')
  elif request.method == "POST":
    logging.info('POST request  %s ' % str(request.form) )
    drive_id, filename = pafy_dl(request.form['youtube_id'], request.form['playlist'])
    return custom_response({
      'drive_id': drive_id,
      'filename': filename
    })
  else:
    return

@app.route('/createpl/<string:name>')
def create(name):
  return custom_response(drive.create_folder(name))

def progress(total, recvd, ratio, rate, eta):
  logging.info('%s '% str((total, recvd, ratio, rate, eta)))

def pafy_dl(youtube_id, playlist):
  vid = pafy.new(youtube_id)
  mp3 = vid.getbestaudio("m4a")
  filename = secure_filename(mp3.title + '.' + mp3.extension.lower())
  logging.info('Downloading filename %s' % filename)
  if not os.path.isfile(filename):
    mp3.download(filename, callback=progress)
    logging.info('Downloaded filename %s' % filename)
    drive_id = drive.copy_to_drive(filename, playlist)
    logging.info('Copied to drive %s, parent folder %s, drive_id %s' % (filename, playlist, drive_id) )
    return drive_id, filename
  return 'File exists'

def custom_response(msg):
  response = jsonify({'results':msg})
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response

if __name__ == "__main__":
    # Call the Drive v3 API
    drive = Drive()
    #print(drive.create_folder('folderName'))
    #items = results.get('files', [])
    #sys.exit(0)
    #if not items:
    #    print('No files found.')
    #else:
    #    print('Files:')
    #    for item in items:
    #        print(u'{0} ({1})'.format(item['name'], item['id']))    
    app.run(debug=True, host='0.0.0.0', port='80')
