import youtube_dl
import pafy, os
from flask import Flask, jsonify, render_template, request, Response

app = Flask(__name__)

@app.route('/download/<string:id>')
def download(id):
    response = jsonify({'results':pafy_dl(id)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

def download_song(id, song_title='temp'):
    """
    Download a song using youtube url and song title
    """

    outtmpl = song_title + '.%(ext)s'
    ydl_opts = {
        'format': 'bestaudio/best',
        'hls_prefer_native': True,
        'outtmpl': outtmpl,
    }
    song_url = "https://www.youtube.com/watch?v=%s" % id
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(song_url, download=True) 

def pafy_dl(id):
  vid = pafy.new('Cgw44TzMWuo')
  mp3 = vid.getbestaudio("m4a")
  if not os.path.isfile(mp3.title+'.'+mp3.extension):
    filename = mp3.download()
  return filename

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port='5001')
    id = "Cgw44TzMWuo"
    #pafy_dl(id)
    #download_song(id,'test')
