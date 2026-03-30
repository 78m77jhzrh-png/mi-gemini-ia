const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// PEGA AQUÍ TU API KEY DE GOOGLE
const API_KEY = "AIzaSyDSrACwSY-5Ncc7bnnmkbWkZct2cCc3UvI"; 
// Cambia la línea de API_URL por esta:
const API_URL = `https://corsproxy.io/?${encodeURIComponent(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`)}`;

async function pedirRespuestaIA(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        // Extraemos el texto de la respuesta de Google
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error:", error);
        return "Lo siento, hubo un error al conectar con el servidor.";
    }
}

function crearMensaje(texto, esUsuario) {
    const saludo = chatContainer.querySelector('.text-center.mt-20');
    if (saludo) saludo.remove();

    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `flex ${esUsuario ? 'justify-end' : 'justify-start'} mb-6`;

    mensajeDiv.innerHTML = `
        <div class="${esUsuario ? 'bg-[#28292a] border border-gray-700' : ''} p-4 rounded-2xl max-w-[85%]">
            <p class="text-gray-200 whitespace-pre-wrap">${texto}</p>
        </div>
    `;

    chatContainer.appendChild(mensajeDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function enviarMensaje() {
    const texto = userInput.value.trim();
    if (texto === "") return;

    crearMensaje(texto, true);
    userInput.value = "";

    // Efecto de "escribiendo..."
    const loading = document.createElement('p');
    loading.className = 'text-blue-400 text-sm ml-2 animate-pulse';
    loading.innerText = 'Gemini está pensando...';
    chatContainer.appendChild(loading);

    // Llamada real al servidor de Google
    const respuesta = await pedirRespuestaIA(texto);
    
    loading.remove();
    crearMensaje(respuesta, false);
}

sendBtn.addEventListener('click', enviarMensaje);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviarMensaje(); });