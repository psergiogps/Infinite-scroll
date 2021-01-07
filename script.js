const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let fotosArray = [];

/* Unsplash API  */
const count = 30; //máximo de fotos permitidas por la API
const apiKey = 'FpTrm4xJ-G574IAALV6nMUDIi0nZ42mMgMYznwoaHB0';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

//Chequear que todas las imágenes se cargaron
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}
//Helper function para setear los atributos en los elementos del DOM
function setAttributes(elemento, atributos) {
  for (const key in atributos) {
    elemento.setAttribute(key, atributos[key]);
  }
}

//Creando elementos para mostar las fotos
function displayFotos () {
  imagesLoaded = 0;
  totalImages = fotosArray.length;
  //console.log('Imágenes en total', totalImages);
  //Ejecutar función para cada objeto en fotosArray
  fotosArray.forEach((foto) => {// Cada objeto va a ser asignado a la variable 'foto'
    // creamos los <a> apuntando a Unsplash
    const item = document.createElement('a');
    //setamos los valores de los atributos
    setAttributes(item, {
      href: foto.links.html,
      target: '_blank',
    });
    console.log(foto);

    // Creamos los <img> para las fotos
    const img = document.createElement('img');
    setAttributes(img, {
      src: foto.urls.regular,
      alt: foto.alt_description,
      title: foto.alt_description,
    });

    //Event listener. Chequeamos cuando se han cargado las imágenes
    img.addEventListener('load', imageLoaded);

    //Creamos info
    let info = document.createElement('p');
    info.innerHTML = foto.exif.model;
    if (!info.innerHTML>0) {
      info.innerHTML = "No camera info";
      info.className = 'noInfo';
    }

    //Metemos los <img> dentro de los <a>, y los dos dentro del elemento imageContainer
    item.appendChild(img);
    item.appendChild(info); 
    imageContainer.appendChild(item); //appendChild para indicar que un elemento va dentro del otro
  });

}


/* Recibir fotos de Unsplash */
async function getPhotos () {
  try {
    const response = await fetch(apiUrl);
    fotosArray = await response.json();
    displayFotos();
  } catch (error) {
    //recogemos el error
  }
}

// Scroll infinito. Comprobamos si estamos cerca del bottom de la página, y cargamos más fotos.
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
})

// On load
getPhotos();
