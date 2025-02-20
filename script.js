document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    const files = document.getElementById('imageFile').files;
    const folderId = document.getElementById('folderSelect').value; // Obtém o ID da pasta

    if (files.length === 0) {
        document.getElementById('message').innerHTML = "Por favor, selecione pelo menos uma imagem!";
        return;
    }

    // Adiciona todas as imagens ao FormData
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]); // Mantendo a chave 'files' se o backend espera assim
    }

    // Faz a requisição para o backend
    fetch(`https://checklist-3.onrender.com/upload/${folderId}`, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        // Verifique o conteúdo bruto da resposta antes de parsear
        return response.text();  // Usamos .text() para obter o conteúdo bruto
    })
    .then(data => {
        console.log('Resposta bruta:', data);  // Verifique o conteúdo aqui
        try {
            const jsonResponse = JSON.parse(data);  // Tente parsear manualmente
            console.log('Resposta JSON:', jsonResponse);
            if (jsonResponse.message) {
                document.getElementById('message').innerHTML = "Imagens enviadas com sucesso!";
            } else {
                document.getElementById('message').innerHTML = jsonResponse.error || "Erro desconhecido!";
            }
        } catch (error) {
            console.error('Erro ao parsear JSON:', error);
            document.getElementById('message').innerHTML = "Erro na resposta do servidor!";
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('message').innerHTML = "Erro ao enviar as imagens!";
    });

})