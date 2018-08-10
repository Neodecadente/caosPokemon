// Declaración variables UI

const UImiboton = document.querySelector('#sortearPokemon');
const pokeApi = 'https://pokeapi.co/api/v2/pokemon/';
const nuevoJ1 = document.querySelector('.nuevoJ1');
const nuevoJ2 = document.querySelector('.nuevoJ2');
const actualJ1 = document.querySelector('.actualJ1');
const actualJ2 = document.querySelector('.actualJ2');

// Agrega oyentes

agregaOyentes();

function agregaOyentes() {
  UImiboton.addEventListener('click', function(e){sorteaPokemon(e);});
  document.addEventListener('DOMContentLoaded', cargaPagina());
}

function cargaPagina() {
  if (localStorage.getItem('ultimosSorteadosJ1') && localStorage.getItem('ultimosSorteadosJ2')) {
    // Último sorteado para J1
    let ultimosSorteadosJ1 = JSON.parse(localStorage.getItem('ultimosSorteadosJ1'));
    let antJ1 = textoAMultielementos(ultimosSorteadosJ1.nombre+ultimosSorteadosJ1.img)
    let i = 0;
    while(i < antJ1.length) {
      actualJ1.appendChild(antJ1[i]);
    }

    // Último sorteado para J2
    let ultimosSorteadosJ2 = JSON.parse(localStorage.getItem('ultimosSorteadosJ2'));
    let antJ2 = textoAMultielementos(ultimosSorteadosJ2.nombre+ultimosSorteadosJ2.img)
    i = 0;
    while(i < antJ2.length) {
      actualJ2.appendChild(antJ2[i]);
    }
  }
}

async function sorteaPokemon(e) {
  e.preventDefault();

  nuevoJ1.innerHTML = '';
  nuevoJ2.innerHTML = '';

  // Declaración variables para la función
  let pokeAleatorioJ1;
  let pokeAleatorioJ2;
  let pokeUri;
  let yaSorteados= [];
  let porSortear = [];

  // Busca bloqueados en Local Storage
  if (localStorage.getItem('yaSorteados')) {
    yaSorteados = JSON.parse(localStorage.getItem('yaSorteados'));
  }

  // Inserta todos los Pokemon que NO están incluidos en yaSorteados
  if (yaSorteados && yaSorteados.length) {
    for(let i = 0; i < 151; i++ ) {
      if(!yaSorteados.includes(i)) {
        porSortear.push(i);
      }
    }
  } else {
    for(let i = 0; i < 151; i++ ) {
        porSortear.push(i);
      }
  }

  // Genera Pokemon para jugador 1
  pokeAleatorioJ1 =  porSortear[Math.trunc(Math.random()*porSortear.length)];

  // Ingresa Pokemon sorteado a lista de yaSorteados
  yaSorteados.push(pokeAleatorioJ1);

  // Crea elementos UI y muestra Pokemon escogidos para el Jugador 1
  pokeUri = pokeApi + pokeAleatorioJ1.toString();
  J1Pokemon = await obtienePokemon(pokeUri);
  nuevoJ1.appendChild(J1Pokemon.nombre);
  nuevoJ1.appendChild(J1Pokemon.img);


  do {
    // Genera Pokemon para jugador 2
    pokeAleatorioJ2 =  porSortear[Math.trunc(Math.random()*porSortear.length)];
  }
  while(pokeAleatorioJ1 === pokeAleatorioJ2);

  // Ingresa Pokemon sorteado a lista de yaSorteados
  yaSorteados.push(pokeAleatorioJ2);

  // Crea elementos UI y muestra Pokemon escogidos para el Jugador 2
  pokeUri = pokeApi + pokeAleatorioJ2.toString();
  J2Pokemon = await obtienePokemon(pokeUri);
  nuevoJ2.appendChild(J2Pokemon.nombre);
  nuevoJ2.appendChild(J2Pokemon.img);

  // Saves info to Local localStorage
  localStorage.setItem('yaSorteados', JSON.stringify(yaSorteados));
  localStorage.setItem('ultimosSorteadosJ1', JSON.stringify({
    nombre: J1Pokemon.nombre.outerHTML,
    img: J1Pokemon.img.outerHTML
  }));
  localStorage.setItem('ultimosSorteadosJ2', JSON.stringify({
    nombre: J2Pokemon.nombre.outerHTML,
    img: J2Pokemon.img.outerHTML
  }));
}

// Busca información en API
function obtienePokemon(pokeUri) {
  return fetch(pokeUri)
    .then(response => response.json())
    .then(json => {
      // Crea H4 con nombre del Pokemon
      let nombrePokemon = document.createElement('h4');
      nombrePokemon.appendChild(document.createTextNode(json.name));
      // Crea img con sprite del Pokemon
      let imgPokemon = document.createElement('img');
      imgPokemon.setAttribute('src', json.sprites.front_default);

      var obj = {"nombre" : nombrePokemon, "img" : imgPokemon};
      return obj;
    })
}

// Template para insertar datos dinámicos en DOM
function textoAElemento(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

// Template para insertar datos dinámicos en DOM
function textoAMultielementos(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.childNodes;
}
