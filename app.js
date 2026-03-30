// 1. Configuración básica
const API_KEY = "AIzaSyDYAvEDHMi-A3cSjUgSV2QnG2YSYcUGQ94"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 2. Verificar que los elementos existen antes de hacer nada
window.onload = function() {
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatContainer = document.getElementById("chat-container");

    if (!sendBtn || !userInput || !chatContainer) {
        console.error("ERROR: No se encontraron los elementos en el HTML. Revisa los IDs.");
        return;
    }

    // 3. Función para enviar
    async function enviar() {
        const texto = userInput.value.trim();
        if (texto === "") return;

        // Mostrar lo que tú escribes
        chatContainer.innerHTML += `<p><b>Tú:</b> ${texto}</p>`;
        userInput.value = "";

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: texto }] }]
                })
            });

            const data = await res.json();
            
            if (data.error) {
                chatContainer.innerHTML += `<p style="color:red"><b>Error:</b> ${data.error.message}</p>`;
            } else {
                const respuestaIA = data.candidates[0].content.parts[0].text;
                chatContainer.innerHTML += `<p><b>IA:</b> ${respuestaIA}</p>`;
            }
        } catch (e) {
            chatContainer.innerHTML += `<p style="color:red"><b>Fallo de conexión.</b></p>`;
        }
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // 4. Asignar los eventos
    sendBtn.onclick = enviar;
    userInput.onkeypress = (e) => { if (e.key === "Enter") enviar(); };
    
    console.log("Chat listo y conectado.");
};