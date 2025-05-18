menu = false
const isSubPage = location.pathname.includes("/pages/");
const prefix = isSubPage ? "../" : "";
const prefixpages = isSubPage ? "" : "pages/";
let videoData = [];
let navData = [];


document.addEventListener("DOMContentLoaded", async function () {
    console.log("YopTube");
    console.log("Version 1.0");
    console.log("Développeur : Luka MARQUET - https://github.com/lukamarquet");

    try {
        const response = await fetch(prefix +'js/data.json');
        if (!response.ok) {
            throw new Error(`Fichier JSON non trouvé (code ${response.status})`);
        }
        const data = await response.json();
        data.nav.forEach(item => {
            item.lien = item.lien.includes("pages/") ? prefixpages + item.lien.split("pages/")[1] : prefix + item.lien;
            item.icon1 = prefix + item.icon1;
            item.icon2 = prefix + item.icon2;
        });

        data.video.forEach(item => {
            item.img = prefix + item.img;
        });
        navData = data.nav;
        videoData = data.video;

        console.log(navData);
        console.log(videoData);

        load(navData);
        loadvideo(videoData);

    } catch (error) {
        console.error("⚠️ Erreur lors du chargement du JSON :", error.message);
    }
    
    if (location.pathname.includes("video.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const watchlink = urlParams.get('watchlink');
        console.log("Lien de la vidéo : " + watchlink);
        
        if (watchlink) {
            const video = videoData.find(v => v.lien === watchlink);
            if (video) {
                document.getElementById('videoPlayer').innerHTML = `
                    <source id="videoSource" src="${video.fichiervid}" type="video/mp4">
                    Votre navigateur ne supporte pas la balise vidéo.
                `;
                document.getElementById("videoTitle").textContent = video.titre;
                document.getElementById("videoDescription").textContent = video.description;
                document.getElementById("uploaderName").textContent = video.pseudo;
            } else {
                console.warn("⚠️ Aucune vidéo trouvée avec ce lien.");
                afficherErreur404();
            }
        } else {
            console.error("⚠️ Aucun lien de vidéo trouvé dans l'URL.");
            document.querySelector(".contentvideo").style = "display: block; text-align: center; margin-top: 20px;";
            document.querySelector(".contentvideo").innerHTML = 
            `<h1>Erreur 404</h1>
            <p>La vidéo que vous cherchez n'existe pas ou a été supprimée.</p>
            <button onclick="window.location.href='../index.html'">Retour à l'accueil</button>`;
        }
    }
});

function loadvideo(video) {
    let videoload = document.querySelector(".wrapper"); 
    videoload.innerHTML = "";

    video.forEach(video => {
        videoload.innerHTML += `
            <div class="video" onclick="openvideo('${video.lien}')">
                <img src="${video.img}" alt="Miniature">
                <h3>${video.titre}</h3>                        
                <p>${video.pseudo}</p>
            </div>`;
    });
}

function load(nav) {
    let navigation = document.querySelector(".menu"); 
    navigation.innerHTML = "";

    nav.forEach(item => {
        if (location.pathname.includes(item.lien)) {
            navigation.innerHTML += `
                <div class="nav" onclick="window.location.href='${item.lien}'" title="${item.titre}">
                    <div class="ecrit">
                        <img src="${item.icon2}" height="25" width="25" alt="${item.titre}">
                        <br>
                        <p>${item.titre}</p>
                    </div>
                </div>`;
            return;
        } else {
            navigation.innerHTML += `
                <div class="nav" onclick="window.location.href='${item.lien}'" title="${item.titre}">
                    <div class="ecrit">
                        <img src="${item.icon1}" height="25" width="25" alt="${item.titre}">
                        <br>
                        <p>${item.titre}</p>
                    </div>
                </div>`;
        }
    });
}

function menuopen() {
    if (menu) {
        document.querySelector('.menu').style = "display:;" 
        menu = false
    } else {
        document.querySelector('.menu').style = "display: block;"
        menu = true
    }
}

function openvideo(lien) {
    console.log("lancement procédure");
    window.location.href = prefixpages + "video.html?watchlink=" + lien;
    console.log("Ouverture de la vidéo : " + lien);
}
