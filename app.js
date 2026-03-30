// CONFIGURACIÓN
const API_KEY = "AIzaSyDYAvEDHMi-A3cSjUgSV2QnG2YSYcUGQ94"; // Tu llave real
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// ELEMENTOS DE LA PÁGINA
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// FUNCIÓN PARA MOSTRAR MENSAJES EN LA PANTALLA
function agregarMensaje(texto, autor) {
    const div = document.createElement("div");
    div.classList.add("mensaje", autor);
    div.innerText = `${autor === "user" ? "Tú: " : "IA: "} ${texto}`;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll abajo
}

// FUNCIÓN QUE HABLA CON GOOGLE
async function enviarMensaje() {
    const mensaje = userInput.value.trim();
    if (!mensaje) return;

    // 1. Mostrar mensaje del usuario
    agregarMensaje(mensaje, "user");
    userInput.value = "";

    try {
        // 2. Llamada a la API
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: mensaje }] }]
            })
        });

        const data = await respuesta.json();

        // 3. Manejo de errores de Google (Cuota, Llave, etc.)
        if (data.error) {
            throw new Error(data.error.message);
        }

        // 4. Mostrar respuesta de la IA
        const respuestaIA = data.candidates[0].content.parts[0].text;
        agregarMensaje(respuestaIA, "bot");

    } catch (error) {
        console.error("Error detallado:", error);
        agregarMensaje(`Ups! Algo salió mal: ${error.message}`, "bot");
    }
}

// ESCUCHADORES DE EVENTOS (Los "cables")
sendBtn.addEventListener("click", enviarMensaje);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensaje();
});