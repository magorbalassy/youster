import json, os, pafy, sys
from flask import Flask, jsonify, render_template, request, Response
from googleapiclient.discovery import build
from oauth2client import file, client, tools
from httplib2 import Http

SCOPES = 'https://www.googleapis.com/auth/drive'
# We define the default parent folder name from Google drive for the Playlists
PLAYLISTS_FOLDER_NAME='Playlists'

app = Flask(__name__)

class Drive:

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
            return custom_response('folder exists')
      # Create a folder on Drive, returns the newely created folders ID
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
def copy_to_drive(filename,playlist):
    def api_media_upload(filename):
        file_metadata = {'name' : filename, 'parents' : PLAYLISTS_FOLDER_ID}
        media = MediaFileUpload(filename,mimetype='audio/mp4')
        file = drive_service.files().create(body=file_metadata,
                                    media_body=media,
                                    fields='id').execute()
        return {'File ID':file.get('id')}

    print(filename)
    if os.path.getsize(filename) < 5242880:
      api_media_upload(filename)

@app.route('/download/<string:id>')
def download(id):
    response = jsonify({'results':pafy_dl(id)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/createpl/<string:name>')
def create(name):
  return custom_response(drive.create_folder(name))

@app.route('/move/')
def move():
  pass

def pafy_dl(id):
  vid = pafy.new('Cgw44TzMWuo')
  mp3 = vid.getbestaudio("m4a")
  if not os.path.isfile(mp3.title+'.'+mp3.extension):
    filename = mp3.download()
    return str(filename)
  return 'File exists'

def custom_response(msg):
  res = Response(
      response=json.dumps(msg),
      status=200,
      mimetype='application/json',
      )
  res.headers['Access-Control-Allow-Origin'] = '*'
  return res

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
    app.run(debug=True, host='0.0.0.0', port='5000')
'''
sudo pip  install pafy flask google-api-python-client oauth2client'''