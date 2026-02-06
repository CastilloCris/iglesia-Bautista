const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});


function enviarWhatsApp(e) {
    e.preventDefault();

    const nombre = e.target[0].value;
    const email = e.target[1].value;
    const mensaje = e.target[2].value;

    const texto = `Hola, soy ${nombre}.
Email: ${email}
Mensaje: ${mensaje}`;

    const telefono = "549XXXXXXXXXX"; // número de la iglesia
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;

    window.open(url, "_blank");
}
