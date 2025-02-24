document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const fileInput = document.getElementById("imageFile");
    const folderId = document.getElementById("folderSelect").value;
    const messageDiv = document.getElementById("message");

    if (!fileInput.files.length) {
        messageDiv.innerText = "Selecione pelo menos um arquivo!";
        messageDiv.style.color = "red";
        return;
    }

    let formData = new FormData();
    for (let file of fileInput.files) {
        formData.append("files", file);
    }

    messageDiv.innerText = "Enviando...";
    messageDiv.style.color = "blue";

    try {
        const response = await fetch(`https://checklist-dwvs.onrender.com/upload/${folderId}`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.innerText = `Upload realizado! Arquivos enviados com sucesso.`;
            messageDiv.style.color = "green";
        } else {
            messageDiv.innerText = `Erro: ${result.error}`;
            messageDiv.style.color = "red";
        }
    } catch (error) {
        messageDiv.innerText = `Erro ao conectar com o servidor!`;
        messageDiv.style.color = "red";
    }
});
