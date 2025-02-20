from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os

app = Flask(__name__)
CORS(app)

# Configuração da API do Google Drive
SERVICE_ACCOUNT_FILE = 'upload-imagens-check-list-ffe500042cde.json'  # Substitua pelo caminho correto
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return build('drive', 'v3', credentials=creds)

@app.route('/upload/<folder_id>', methods=['POST'])
def upload_files_to_folder(folder_id):
    if 'files' not in request.files:
        return jsonify({'error': 'Nenhuma imagem enviada'}), 400
    
    files = request.files.getlist('files')  # Captura todas as imagens corretamente
    uploaded_files = []

    drive_service = get_drive_service()

    for file in files:
        filename = file.filename
        filepath = os.path.join('uploads', filename)
        
        file.save(filepath)  # Salva temporariamente no servidor
        
        file_metadata = {'name': filename, 'parents': [folder_id]}  # Usando o ID da pasta passado na URL
        media = MediaFileUpload(filepath, mimetype=file.content_type)
        file_drive = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()

        uploaded_files.append({'filename': filename, 'file_id': file_drive.get('id')})
        
        os.remove(filepath)  # Apaga o arquivo após o upload
    
    return jsonify({'message': 'Upload realizado com sucesso', 'files': uploaded_files})

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)
