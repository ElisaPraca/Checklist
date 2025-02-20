from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os
import json

app = Flask(__name__)
CORS(app)

# Configuração da API do Google Drive
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def get_drive_service():
    creds_json = os.getenv("GOOGLE_CREDENTIALS_JSON")  # Pegando a variável de ambiente
    if not creds_json:
        raise ValueError("A variável GOOGLE_CREDENTIALS_JSON não está configurada!")

    creds_dict = json.loads(creds_json)  # Transformando JSON em dicionário
    creds = service_account.Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
    return build('drive', 'v3', credentials=creds)

@app.route('/upload/<folder_id>', methods=['POST'])
def upload_files_to_folder(folder_id):
    if 'files' not in request.files:
        return jsonify({'error': 'Nenhuma imagem enviada'}), 400
    
    files = request.files.getlist('files')
    uploaded_files = []

    drive_service = get_drive_service()

    for file in files:
        filename = file.filename
        file_metadata = {'name': filename, 'parents': [folder_id]}
        media = MediaFileUpload(file, mimetype=file.content_type)
        file_drive = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()

        uploaded_files.append({'filename': filename, 'file_id': file_drive.get('id')})
    
    return jsonify({'message': 'Upload realizado com sucesso', 'files': uploaded_files})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
