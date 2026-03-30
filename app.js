const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// TU LLAVE (Asegúrate de que no tenga espacios antes o después)
const API_KEY = "AIzaSyDSrACwSY-5Ncc7bnnmkbWkZct2cCc3UvI"; 

// Usamos la versión v1 (estable) y el nombre completo del modelo
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function pedirRespuestaIA(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: prompt }] 
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error de la API:", errorData);
            return "Error de la API: " + (errorData.error?.message || "No se pudo conectar.");
        }

        const data = await response.json();
        
        // Verificamos que la respuesta tenga el formato correcto
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "La IA no devolvió una respuesta válida.";
        }

    } catch (error) {
        console.error("Error de red:", error);
        return "Error de red: No se pudo contactar con el servidor.";
    }
}

function crearMensaje(texto, esUsuario) {
    // Quitamos el saludo inicial si existe
    const saludo = chatContainer.querySelector('.text-center');
    if (saludo) saludo.remove();

    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `flex ${esUsuario ? 'justify-end' : 'justify-start'} mb-6`;

    mensajeDiv.innerHTML = `
        <div class="${esUsuario ? 'bg-[#28292a] border border-gray-700' : ''} p-4 rounded-2xl max-w-[85%] shadow-sm">
            <p class="text-gray-200 whitespace-pre-wrap">${texto}</p>
        </div>
    `;

    chatContainer.appendChild(mensajeDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function enviarMensaje() {
    const texto = userInput.value.trim();
    if (texto === "") return;

    // 1. Mostrar mensaje del usuario
    crearMensaje(texto, true);
    userInput.value = "";

    // 2. Mostrar indicador de carga
    const loading = document.createElement('div');
    loading.id = 'loading-state';
    loading.className = 'flex justify-start mb-6';
    loading.innerHTML = `<p class="text-blue-400 text-sm ml-4 animate-pulse">Gemini está pensando...</p>`;
    chatContainer.appendChild(loading);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 3. Pedir respuesta a Google
    const respuesta = await pedirRespuestaIA(texto);
    
    // 4. Quitar indicador de carga y mostrar respuesta
    const loadingElement = document.getElementById('loading-state');
    if (loadingElement) loadingElement.remove();
    
    crearMensaje(respuesta, false);
}

// Eventos de escucha
sendBtn.addEventListener('click', enviarMensaje);
userInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') enviarMensaje(); 
});
