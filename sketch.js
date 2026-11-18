// Mariana Cuello, Isabella Tobón, Sara Serpa
// Proyecto final - Mundo Musical: "Recordar es vivir"
// Memorias en estéreo - Un viaje por los recuerdos a través de la música de Bacilos
// Música: fragmentos de 40 segundos de canciones de Bacilos,
// usados solo con fines académicos. Los derechos son de sus autores.

let escenaActual = 0;

// ESTADOS DE LAS INTERACCIONES
let maletaAbierta = false;
let perfumeActivo = false;
let particulas = [];
let fotoSeleccionada = -1;
let puertaSeleccionada = -1;
let estrellasEncendidas = [false, false, false, false, false];
let corazones = [];

// ANIMACIONES NUEVAS
let salidaFotos = 0;     // 0 = fotos dentro de la maleta, 1 = afuera
let alphaPolaroid = 0;   // transparencia de la foto en Tabaco y Chanel
let aperturaPuerta = 0;  // 0 = puerta cerrada, 1 = abierta

// MÚSICA (p5.sound)
let musica = [];         // aquí se guardan las 6 canciones
let musicaActual = null; // la canción que está sonando
let amplitud;            // mide el volumen de la canción
let fft;                 // separa la canción en graves, medios y agudos

// Valores de la música que se actualizan en cada frame
let nivel = 0;    // volumen (de 0 a 1)
let bajos = 0;    // energía de los graves (de 0 a 255, casi siempre entre 150 y 250)
let agudos = 0;   // energía de los agudos (de 0 a 255, casi siempre entre 30 y 120)

let archivosMusica = [
  "musica/mi-primer-millon.mp3",
  "musica/tabaco-y-chanel.mp3",
  "musica/perderme-contigo.mp3",
  "musica/guerras-perdidas.mp3",
  "musica/pequenos-romances.mp3",
  "musica/caraluna.mp3"
];

// FOTOS
let fotosGaleria = [];
let fotoGrado1, fotoGrado2;
let fotoPolaroid;
let fotosPerderme = [];
let fotoAtardecer;
let fotoNoche;
let fotoCaraluna;

// CANCIONES
let canciones = [
  "Mi primer millón",
  "Tabaco y Chanel",
  "Perderme Contigo",
  "Guerras perdidas",
  "Pequeños romances",
  "Caraluna"
];

let significados = [
  "Enfrentarse a la vida y salir adelante",
  "El amor y la fugacidad",
  "La complicidad y el amor duradero",
  "La tentación y las consecuencias de la infidelidad",
  "El miedo al compromiso",
  "Recordar a quienes ya no están"
];

// CARGAR ARCHIVOS ANTES DE EMPEZAR
function preload() {
  // Canciones
  for (let i = 0; i < 6; i++) {
    musica[i] = loadSound(archivosMusica[i]);
  }

  // Fotos de la galería (una por canción)
  fotosGaleria[0] = loadImage("fotos/galeria-1-mi-primer-millon.jpg");
  fotosGaleria[1] = loadImage("fotos/galeria-2-tabaco-y-chanel.jpg");
  fotosGaleria[2] = loadImage("fotos/galeria-3-perderme-contigo.jpg");
  fotosGaleria[3] = loadImage("fotos/galeria-4-guerras-perdidas.jpg");
  fotosGaleria[4] = loadImage("fotos/galeria-5-pequenos-romances.jpg");
  fotosGaleria[5] = loadImage("fotos/galeria-6-caraluna.jpg");

  // Fotos de cada escena
  fotoGrado1 = loadImage("fotos/millon-grado-1.jpg");
  fotoGrado2 = loadImage("fotos/millon-grado-2.jpg");
  fotoPolaroid = loadImage("fotos/tabaco-polaroid.jpg");
  fotosPerderme[0] = loadImage("fotos/perderme-1.jpg");
  fotosPerderme[1] = loadImage("fotos/perderme-2.jpg");
  fotosPerderme[2] = loadImage("fotos/perderme-3.jpg");
  fotoAtardecer = loadImage("fotos/guerras-atardecer.jpg");
  fotoNoche = loadImage("fotos/romances-noche.jpg");
  fotoCaraluna = loadImage("fotos/caraluna-familia.jpg");
}

// CONFIGURACIÓN
function setup() {
  createCanvas(1000, 650);

  // Analizadores de sonido: escuchan lo que esté sonando
  amplitud = new p5.Amplitude();
  fft = new p5.FFT();

  for (let i = 0; i < 5; i++) {
    corazones.push({
      x: 200 + i * 150,
      y: 350,
      originalX: 200 + i * 150
    });
  }
}

// CONTROL DE MÚSICA
function reproducirCancion(numero) {
  detenerCancion();

  musicaActual = musica[numero];
  musicaActual.setVolume(0.6);
  musicaActual.setLoop(true); // el fragmento se repite
  musicaActual.play();
}

function detenerCancion() {
  if (musicaActual !== null) {
    musicaActual.stop();
    musicaActual = null;
  }
}

// PAUSAR O SEGUIR LA CANCIÓN
function pausarOSeguir() {
  if (musicaActual !== null) {
    if (musicaActual.isPlaying()) {
      musicaActual.pause();
    } else {
      musicaActual.play();
    }
  }
}

// DIBUJAR PANTALLAS
function draw() {
  background(92, 48, 25);

  // Leer la música en cada frame
  nivel = amplitud.getLevel();
  fft.analyze();
  bajos = fft.getEnergy("bass");
  agudos = fft.getEnergy("treble");

  if (escenaActual === 0) {
    portada();
  } else if (escenaActual === 1) {
    galeria();
  } else if (escenaActual === 2) {
    miPrimerMillon();
  } else if (escenaActual === 3) {
    tabacoYChanel();
  } else if (escenaActual === 4) {
    perdermeContigo();
  } else if (escenaActual === 5) {
    guerrasPerdidas();
  } else if (escenaActual === 6) {
    pequenosRomances();
  } else if (escenaActual === 7) {
    caraluna();
  }

  // El reproductor aparece en todas las escenas de canciones
  if (escenaActual >= 2) {
    reproductor();
  }
}

// PORTADA
function portada() {
  background(92, 48, 25);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(255, 235, 195);
  textSize(65);
  text("Recordar es vivir", 500, 230);

  textSize(25);
  text("Memorias en estéreo", 500, 310);

  textSize(18);
  text("Un universo musical inspirado en Bacilos", 500, 370);

  fill(255, 235, 195);
  rect(375, 440, 250, 60, 10);

  fill(92, 48, 25);
  textSize(20);
  text("Abrir mis recuerdos", 500, 470);

  fill(255, 235, 195, 150);
  textSize(13);
  text("Fragmentos musicales de Bacilos usados con fines académicos",
       500, 615);
}

// GALERÍA
function galeria() {
  background(180, 120, 65);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(255, 235, 195);
  textSize(45);
  text("Nuestros recuerdos", 500, 90);

  for (let i = 0; i < 6; i++) {
    let columna = i % 3;
    let fila = floor(i / 3);
    let x = 100 + columna * 300;
    let y = 160 + fila * 210;

    // Si el mouse está encima, la tarjeta se levanta un poco
    if (mouseX > x && mouseX < x + 230 &&
        mouseY > y && mouseY < y + 160) {
      y = y - 8;
    }

    fill(255, 235, 195);
    rect(x, y, 230, 160, 8);

    // Foto de la canción
    image(fotosGaleria[i], x + 10, y + 10, 210, 110);

    fill(92, 48, 25);
    textSize(17);
    text(canciones[i], x + 115, y + 140);
  }
}

// BOTÓN VOLVER
function botonVolver() {
  noStroke();
  fill(255, 235, 195);
  rect(30, 30, 160, 45, 8);

  fill(92, 48, 25);
  textAlign(CENTER, CENTER);
  textSize(17);
  text("Volver", 110, 52);
}

// REPRODUCTOR: botón pausa/play y barra de progreso
function reproductor() {
  if (musicaActual === null) {
    return;
  }

  // Fondo del reproductor
  noStroke();
  fill(0, 0, 0, 60);
  rect(130, 610, 800, 36, 18);

  // Botón circular
  fill(255, 235, 195);
  circle(160, 628, 28);

  fill(92, 48, 25);
  if (musicaActual.isPlaying()) {
    // Ícono de pausa: dos rayitas
    rect(154, 621, 4, 14);
    rect(162, 621, 4, 14);
  } else {
    // Ícono de play: triángulo
    triangle(155, 620, 155, 636, 168, 628);
  }

  // Barra de progreso
  let progreso = musicaActual.currentTime() / musicaActual.duration();
  let finBarra = map(progreso, 0, 1, 200, 800);

  stroke(255, 235, 195, 100);
  strokeWeight(4);
  line(200, 628, 800, 628);

  stroke(255, 235, 195);
  line(200, 628, finBarra, 628);

  // La bolita crece con el volumen de la canción
  noStroke();
  fill(255, 235, 195);
  circle(finBarra, 628, 10 + nivel * 40);

  textSize(12);
  textAlign(LEFT, CENTER);
  text("Espacio = pausa", 815, 628);
  textAlign(CENTER, CENTER);
}

// MI PRIMER MILLÓN
function miPrimerMillon() {
  background(216, 180, 126);
  textAlign(CENTER, CENTER);
  noStroke();

  fill(92, 48, 25);
  textSize(48);
  text("Mi primer millón", 500, 100);

  textSize(22);
  text("Los sueños que llevamos con nosotros", 500, 160);

  // Las fotos salen de la maleta poco a poco
  if (maletaAbierta) {
    salidaFotos = lerp(salidaFotos, 1, 0.06);
  } else {
    salidaFotos = lerp(salidaFotos, 0, 0.15);
  }

  // Cuánto crecen las fotos con el volumen
  let crecer = map(nivel, 0, 0.25, 0, 20);
  crecer = constrain(crecer, 0, 20);

  if (salidaFotos > 0.02) {
    // Foto 1: sale hacia la izquierda
    let x1 = lerp(410, 100, salidaFotos);
    let y1 = 250;
    fill(255, 235, 195);
    rect(x1 - 8 - crecer / 2, y1 - 8 - crecer / 2,
         196 + crecer, 256 + crecer);
    image(fotoGrado1, x1 - crecer / 2, y1 - crecer / 2,
          180 + crecer, 240 + crecer);

    // Foto 2: sale hacia la derecha
    let x2 = lerp(375, 690, salidaFotos);
    let y2 = 280;
    fill(255, 235, 195);
    rect(x2 - 8 - crecer / 2, y2 - 8 - crecer / 2,
         266 + crecer, 204 + crecer);
    image(fotoGrado2, x2 - crecer / 2, y2 - crecer / 2,
          250 + crecer, 188 + crecer);
  }

  // Asa de la maleta
  noFill();
  stroke(92, 48, 25);
  strokeWeight(8);
  rect(450, 235, 100, 55, 10);

  // Maleta
  fill(135, 81, 47);
  strokeWeight(4);
  rect(350, 270, 300, 230, 15);

  noStroke();
  fill(233, 199, 125);
  rect(390, 275, 20, 220);
  rect(590, 275, 20, 220);

  if (maletaAbierta) {
    // Los círculos laten con los graves
    let latido = map(bajos, 150, 250, 50, 85);
    latido = constrain(latido, 50, 85);

    fill(255, 235, 195);
    ellipse(440, 370, latido);
    ellipse(500, 370, latido);
    ellipse(560, 370, latido);

    fill(92, 48, 25);
    textSize(28);
    text("★", 440, 370);
    text("♥", 500, 370);
    text("$", 560, 370);

    textSize(18);
    text("Cada sueño es un recuerdo por construir", 500, 550);
  } else {
    fill(255, 235, 195);
    textSize(20);
    text("Haz clic en la maleta", 500, 550);
  }

  botonVolver();
}

// TABACO Y CHANEL
function tabacoYChanel() {
  background(228, 197, 160);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(102, 59, 43);
  textSize(48);
  text("Tabaco y Chanel", 500, 95);

  textSize(21);
  text("Hay recuerdos que permanecen como un aroma", 500, 155);

  // La foto aparece despacio cuando se activa el perfume
  if (perfumeActivo && alphaPolaroid < 255) {
    alphaPolaroid = alphaPolaroid + 2;
  }

  tint(255, alphaPolaroid);
  image(fotoPolaroid, 680, 230, 170, 205);
  noTint();

  // Mesa
  fill(166, 113, 74);
  rect(200, 475, 600, 30);

  // Perfume
  fill(197, 142, 97);
  stroke(116, 69, 47);
  strokeWeight(4);
  rect(420, 285, 160, 190, 15);

  fill(232, 210, 173);
  rect(465, 250, 70, 40, 5);

  noStroke();
  fill(247, 229, 201);
  rect(440, 345, 120, 80, 5);

  fill(102, 59, 43);
  textSize(18);
  text("TABACO", 500, 375);
  text("& CHANEL", 500, 400);

  // Mientras más fuerte suena la canción, más perfume sale
  if (perfumeActivo && particulas.length < 300) {
    let cantidad = floor(map(nivel, 0, 0.25, 0, 5));

    for (let i = 0; i < cantidad; i++) {
      particulas.push({
        x: 500,
        y: 260,
        vx: random(-2, 2),
        vy: random(-3, -0.5),
        tamano: random(5, 15),
        vida: 255
      });
    }
  }

  // Partículas
  for (let i = particulas.length - 1; i >= 0; i--) {
    let p = particulas[i];

    fill(166, 113, 74, p.vida);
    circle(p.x, p.y, p.tamano);

    p.x += p.vx;
    p.y += p.vy;
    p.vida -= 3;

    if (p.vida <= 0) {
      particulas.splice(i, 1);
    }
  }

  fill(102, 59, 43);
  textSize(19);

  if (perfumeActivo) {
    text("Algunos momentos pasan, pero su recuerdo permanece",
         500, 555);
  } else {
    text("Haz clic en el perfume", 500, 555);
  }

  botonVolver();
}

// CREAR PARTÍCULAS DEL PERFUME
function crearPerfume() {
  particulas = [];

  for (let i = 0; i < 45; i++) {
    particulas.push({
      x: 500,
      y: 260,
      vx: random(-2, 2),
      vy: random(-3, -0.5),
      tamano: random(5, 15),
      vida: 255
    });
  }
}

// PERDERME CONTIGO
function perdermeContigo() {
  background(190, 155, 115);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(92, 48, 25);
  textSize(48);
  text("Perderme Contigo", 500, 95);

  textSize(21);
  text("Los recuerdos que construimos juntos", 500, 155);

  // Las fotos saltan con los graves de la canción
  let salto = map(bajos, 150, 250, 0, 18);
  salto = constrain(salto, 0, 18);

  // Fotografías
  for (let i = 0; i < 3; i++) {
    let x = 170 + i * 240;
    let y = 240 - salto * 0.4;

    // La foto seleccionada sube más y tiene sombra
    if (i === fotoSeleccionada) {
      y = 220 - salto;
      fill(92, 48, 25, 80);
      rect(x + 8, y + 8, 190, 230, 5);
    }

    fill(255, 235, 195);
    rect(x, y, 190, 230, 5);

    image(fotosPerderme[i], x + 15, y + 15, 160, 160);

    fill(92, 48, 25);
    textSize(18);
    text("Recuerdo " + (i + 1), x + 95, y + 205);
  }

  let mensajes = [
    "Los momentos sencillos también son especiales",
    "Hay personas que hacen inolvidable un lugar",
    "Algunos recuerdos se construyen juntos"
  ];

  fill(92, 48, 25);
  textSize(19);

  if (fotoSeleccionada === -1) {
    text("Haz clic en una fotografía", 500, 550);
  } else {
    text(mensajes[fotoSeleccionada], 500, 550);
  }

  botonVolver();
}

// GUERRAS PERDIDAS
function guerrasPerdidas() {
  background(65, 43, 45);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(255, 225, 190);
  textSize(48);
  text("Guerras perdidas", 500, 95);

  textSize(21);
  text("Las decisiones también dejan recuerdos", 500, 155);

  // Línea de "latido": la forma de onda de la canción
  let onda = fft.waveform();
  noFill();
  stroke(230, 185, 130);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < onda.length; i += 8) {
    let x = map(i, 0, onda.length, 150, 850);
    let y = 195 + onda[i] * 25;
    vertex(x, y);
  }
  endShape();

  // La puerta elegida se abre poco a poco
  if (puertaSeleccionada !== -1) {
    aperturaPuerta = lerp(aperturaPuerta, 1, 0.05);
  }

  // Dibujar las dos puertas
  for (let i = 0; i < 2; i++) {
    let x = 230 + i * 330;

    // Brillo alrededor de la puerta según el volumen
    let brillo = map(nivel, 0, 0.25, 0, 255);
    noFill();
    stroke(255, 200, 120, brillo);
    strokeWeight(6);
    rect(x - 6, 224, 222, 282, 10);
    noStroke();

    let anchoPuerta = 210;

    if (i === puertaSeleccionada) {
      // Detrás de la puerta está la foto
      if (i === 1) {
        tint(200, 110, 110); // la segunda puerta es más roja
      }
      image(fotoAtardecer, x, 230, 210, 270);
      noTint();

      // La puerta se hace más angosta: parece que se abre
      anchoPuerta = 210 - aperturaPuerta * 180;
    }

    if (i === 0) {
      fill(125, 77, 62);
    } else {
      fill(145, 94, 76);
    }
    rect(x, 230, anchoPuerta, 270, 8);

    // Manija
    fill(230, 185, 130);
    circle(x + anchoPuerta - 35, 365, 18);
  }

  fill(255, 235, 195);
  textSize(22);
  text("Puerta 1", 335, 530);
  text("Puerta 2", 665, 530);

  textSize(18);

  if (puertaSeleccionada === -1) {
    text("Elige una puerta", 500, 580);
  } else if (puertaSeleccionada === 0) {
    text("Una decisión puede cambiarlo todo", 500, 580);
  } else {
    text("Toda acción puede tener consecuencias", 500, 580);
  }

  botonVolver();
}

// PEQUEÑOS ROMANCES
function pequenosRomances() {
  background(220, 150, 115);

  // Foto de fondo, casi transparente
  tint(255, 45);
  image(fotoNoche, 0, 0, 1000, 650);
  noTint();

  noStroke();
  textAlign(CENTER, CENTER);

  fill(92, 48, 25);
  textSize(48);
  text("Pequeños romances", 500, 95);

  textSize(21);
  text("A veces acercarse también significa alejarse", 500, 155);

  // Los corazones laten con los graves
  let latido = map(bajos, 150, 250, 50, 100);
  latido = constrain(latido, 50, 100);

  // Corazones
  for (let c of corazones) {
    let distancia = dist(mouseX, mouseY, c.x, c.y);

    if (distancia < 100) {
      if (mouseX < c.x) {
        c.x += 3;
      } else {
        c.x -= 3;
      }
    } else {
      c.x = lerp(c.x, c.originalX, 0.02);
    }

    c.x = constrain(c.x, 45, 955);

    fill(150, 55, 65);
    textSize(latido);
    text("♥", c.x, c.y);
  }

  fill(92, 48, 25);
  textSize(20);
  text("Acerca el mouse a los corazones", 500, 520);

  botonVolver();
}

// CARALUNA
function caraluna() {
  background(45, 55, 80);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(255, 235, 195);
  textSize(48);
  text("Caraluna", 500, 95);

  textSize(21);
  text("Recordar a quienes siempre llevamos con nosotros",
       500, 155);

  // Contar estrellas encendidas
  let total = 0;

  for (let encendida of estrellasEncendidas) {
    if (encendida) {
      total++;
    }
  }

  // Luna (arriba a la derecha)
  fill(245, 225, 175);
  circle(870, 130, 110);

  fill(45, 55, 80);
  circle(903, 104, 103);

  // Halo de la luna: crece con el volumen
  let halo = map(nivel, 0, 0.25, 0, 60);
  halo = constrain(halo, 0, 60);
  noFill();
  stroke(255, 235, 195, 80);
  strokeWeight(2);
  circle(870, 130, 130 + halo);
  circle(870, 130, 160 + halo * 1.5);
  noStroke();

  // La foto aparece más con cada estrella encendida
  let alphaFoto = map(total, 0, 5, 0, 255);

  fill(255, 235, 195, alphaFoto);
  rect(320, 190, 360, 210, 4);

  tint(255, alphaFoto);
  image(fotoCaraluna, 330, 200, 340, 190);
  noTint();

  // Estrellas
  for (let i = 0; i < 5; i++) {
    let x = 180 + i * 160;
    let y = 450;

    if (estrellasEncendidas[i]) {
      fill(255, 220, 100);
      // Las estrellas encendidas titilan con los agudos
      let titileo = map(agudos, 30, 120, 0, 25);
      titileo = constrain(titileo, 0, 25);
      textSize(55 + titileo);
    } else {
      fill(110, 120, 145);
      textSize(55);
    }

    text("★", x, y);
  }

  fill(255, 235, 195);
  textSize(19);
  text("Haz clic en las estrellas para iluminar los recuerdos",
       500, 530);

  if (total === 5) {
    text("Hay personas que nunca dejamos de recordar",
         500, 570);
  }

  botonVolver();
}

// TECLADO: la barra espaciadora pausa o sigue la canción
function keyPressed() {
  if (key === " ") {
    pausarOSeguir();
  }
}

// INTERACCIONES
function mousePressed() {

  // ENTRAR DESDE LA PORTADA
  if (escenaActual === 0) {
    if (mouseX > 375 && mouseX < 625 &&
        mouseY > 440 && mouseY < 500) {
      userStartAudio(); // el navegador pide un clic antes de sonar
      escenaActual = 1;
    }
  }

  // ELEGIR CANCIÓN EN LA GALERÍA
  else if (escenaActual === 1) {
    for (let i = 0; i < 6; i++) {
      let columna = i % 3;
      let fila = floor(i / 3);

      let x = 100 + columna * 300;
      let y = 160 + fila * 210;

      if (mouseX > x && mouseX < x + 230 &&
          mouseY > y && mouseY < y + 160) {

        escenaActual = i + 2;

        // Reiniciar interacciones
        maletaAbierta = false;
        perfumeActivo = false;
        particulas = [];
        fotoSeleccionada = -1;
        puertaSeleccionada = -1;
        estrellasEncendidas = [
          false, false, false, false, false
        ];
        salidaFotos = 0;
        alphaPolaroid = 0;
        aperturaPuerta = 0;

        // REPRODUCIR CANCIÓN AUTOMÁTICAMENTE
        reproducirCancion(i);

        break;
      }
    }
  }

  // INTERACCIONES DE LOS ESCENARIOS
  else {

    // VOLVER A LA GALERÍA Y DETENER MÚSICA
    if (mouseX > 30 && mouseX < 190 &&
        mouseY > 30 && mouseY < 75) {

      detenerCancion();
      escenaActual = 1;
      return;
    }

    // REPRODUCTOR: botón pausa/play
    if (dist(mouseX, mouseY, 160, 628) < 16) {
      pausarOSeguir();
      return;
    }

    // REPRODUCTOR: clic en la barra para saltar a otra parte
    if (musicaActual !== null &&
        mouseX > 200 && mouseX < 800 &&
        mouseY > 615 && mouseY < 641) {
      let segundo = map(mouseX, 200, 800, 0, musicaActual.duration());
      musicaActual.jump(segundo);
      return;
    }

    // MI PRIMER MILLÓN
    if (escenaActual === 2 &&
        mouseX > 350 && mouseX < 650 &&
        mouseY > 270 && mouseY < 500) {
      maletaAbierta = !maletaAbierta;
    }

    // TABACO Y CHANEL
    if (escenaActual === 3 &&
        mouseX > 420 && mouseX < 580 &&
        mouseY > 250 && mouseY < 475) {
      perfumeActivo = true;
      crearPerfume();
    }

    // PERDERME CONTIGO
    if (escenaActual === 4) {
      for (let i = 0; i < 3; i++) {
        let x = 170 + i * 240;

        if (mouseX > x && mouseX < x + 190 &&
            mouseY > 220 && mouseY < 470) {
          fotoSeleccionada = i;
        }
      }
    }

    // GUERRAS PERDIDAS
    if (escenaActual === 5) {
      if (mouseX > 230 && mouseX < 440 &&
          mouseY > 230 && mouseY < 500) {
        if (puertaSeleccionada !== 0) {
          aperturaPuerta = 0; // la nueva puerta empieza cerrada
        }
        puertaSeleccionada = 0;
      }

      if (mouseX > 560 && mouseX < 770 &&
          mouseY > 230 && mouseY < 500) {
        if (puertaSeleccionada !== 1) {
          aperturaPuerta = 0;
        }
        puertaSeleccionada = 1;
      }
    }

    // CARALUNA
    if (escenaActual === 7) {
      for (let i = 0; i < 5; i++) {
        let x = 180 + i * 160;

        if (dist(mouseX, mouseY, x, 450) < 35) {
          estrellasEncendidas[i] =
            !estrellasEncendidas[i];
        }
      }
    }
  }
}
