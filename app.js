// 1. CONFIGURACIÓN
const API_KEY = "AIzaSyCxE82AU3L0UdPVkqVhn8ismKiC8uylmR4"; 
// Esta es la URL más compatible: versión v1 y modelo 1.5-flash
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 2. FUNCIÓN PARA LLAMAR A LA IA
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

        const data = await response.json();

        if (!response.ok) {
            // Si el modelo no se encuentra, intentamos con el nombre alternativo que mencionaba tu doc
            if (data.error?.message.includes("not found")) {
                return "Error: Google no reconoce el modelo. Intenta cambiar 'gemini-1.5-flash' por 'gemini-pro' en la URL.";
            }
            return "Error de Google: " + (data.error?.message || "Error desconocido");
        }

        if (data.candidates && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "La IA no pudo generar una respuesta.";
        }

    } catch (error) {
        return "Error de red: No se pudo conectar con Google.";
    }
}

// 3. FUNCIÓN PARA MOSTRAR MENSAJES
function crearMensaje(texto, esUsuario) {
    const saludo = document.querySelector('.text-center.mt-20');
    if (saludo) saludo.remove();

    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `flex ${esUsuario ? 'justify-end' : 'justify-start'} mb-6`;

    mensajeDiv.innerHTML = `
        <div class="${esUsuario ? 'bg-[#28292a] border border-gray-700' : 'bg-[#1e1f20]'} p-4 rounded-2xl max-w-[85%] shadow-md">
            <p class="text-gray-200" style="white-space: pre-wrap;">${texto}</p>
        </div>
    `;

    chatContainer.appendChild(mensajeDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 4. FUNCIÓN DE ENVÍO
async function enviarMensaje() {
    const texto = userInput.value.trim();
    if (texto === "") return;

    crearMensaje(texto, true);
    userInput.value = "";

    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.className = 'flex justify-start mb-6';
    loading.innerHTML = `<p class="text-blue-400 text-sm ml-4 animate-pulse">Gemini está pensando...</p>`;
    chatContainer.appendChild(loading);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const respuesta = await pedirRespuestaIA(texto);
    
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.remove();
    
    crearMensaje(respuesta, false);
}

sendBtn.addEventListener('click', enviarMensaje);
userInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') enviarMensaje(); 
});
