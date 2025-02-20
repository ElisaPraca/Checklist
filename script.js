document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    const files = document.getElementById('imageFile').files;
    const folderId = document.getElementById('folderSelect').value;  // Obtém o ID da pasta selecionada

    if (files.length === 0) {
        document.getElementById('message').innerHTML = "Por favor, selecione pelo menos uma imagem!";
        return;
    }

    // Adiciona todas as imagens ao FormData
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);  // Correção: usar a mesma chave 'files' sem []
    }

    // Envia as imagens para a pasta selecionada
    fetch(`https://checklist-1-hstk.onrender.com/${folderId}`, {  // URL dinâmica com o ID da pasta
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('message').innerHTML = "Imagens enviadas com sucesso!";
        } else {
            document.getElementById('message').innerHTML = data.error || "Erro desconhecido!";
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('message').innerHTML = "Erro ao enviar as imagens!";
    });
});