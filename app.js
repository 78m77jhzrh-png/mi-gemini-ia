const API_KEY = "AIzaSyDYAvEDHMi-A3cSjUgSV2QnG2YSYcUGQ94"; 
// Usaremos v1beta que es la más flexible en 2026
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function generarRespuesta(mensajeUsuario) {
    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: mensajeUsuario }]
                }]
            })
        });

        const data = await respuesta.json();

        // Si Google responde con un error, lo mostramos tal cual
        if (data.error) {
            console.error("Error real de Google:", data.error.message);
            return `Error de Google: ${data.error.message}`;
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("Error de conexión:", error);
        return "Error de conexión. Revisa tu internet o la consola (F12).";
    }
}