const paleta = document.getElementById("paleta");
const btnGenerar = document.getElementById("btnGenerar");
const cantidad = document.getElementById("cantidad");
const formato = document.getElementById("formato");

let coloresGuardados = JSON.parse(localStorage.getItem("paleta")) || [];

function randomHex() {

    const letras = "0123456789ABCDEF";
    let color = "#";

    for(let i = 0; i < 6; i++){
        color += letras[Math.floor(Math.random() * 16)];
    }

    return color;
}

function randomRGBA(){

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgba(${r}, ${g}, ${b}, 1)`;
}

function randomHSL(){

    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 100);
    const l = Math.floor(Math.random() * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

function obtenerColor(){

    const tipo = formato.value;

    if(tipo === "hsl"){
        return randomHSL();
    }

    return randomRGBA();
}

function showToast(texto){

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerText = texto;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    },100);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        },400);

    },2000);
}

function crearPaleta(){

    const total = cantidad.value;

    paleta.innerHTML = "";

    for(let i = 0; i < total; i++){

        let color;

        if(coloresGuardados[i]?.locked){

            color = coloresGuardados[i].color;

        }else{

            color = obtenerColor();
        }

        const card = document.createElement("article");
        card.classList.add("color-card");

        const preview = document.createElement("div");
        preview.classList.add("color-preview");
        preview.style.background = color;

        const info = document.createElement("div");
        info.classList.add("color-info");

        const codigo = document.createElement("span");
        codigo.classList.add("color-code");
        codigo.innerText = randomHex();

        codigo.addEventListener("click", () => {

            navigator.clipboard.writeText(color);

            showToast("Color copiado 🎉");
        });

        const lockBtn = document.createElement("button");
        lockBtn.classList.add("lock-btn");

        let locked = coloresGuardados[i]?.locked || false;

        if(locked){
            card.classList.add("locked");
        }

        lockBtn.innerText = locked ? "🔒" : "🔓";

        lockBtn.addEventListener("click", () => {

            locked = !locked;

            lockBtn.innerText = locked ? "🔒" : "🔓";

            card.classList.toggle("locked");

            coloresGuardados[i] = {
                color,
                locked
            };

            guardarLocal();
        });

        info.appendChild(codigo);
        info.appendChild(lockBtn);

        card.appendChild(preview);
        card.appendChild(info);

        paleta.appendChild(card);

        coloresGuardados[i] = {
            color,
            locked
        };
    }

    guardarLocal();
}

function guardarLocal(){

    localStorage.setItem("paleta", JSON.stringify(coloresGuardados));
}

btnGenerar.addEventListener("click", crearPaleta);

window.addEventListener("load", crearPaleta)