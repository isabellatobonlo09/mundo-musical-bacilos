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
let fotosBacilos = [], visitados = new Set(), historia = 0, transicion = null;
let volumen = 0.6, giro = 0;
function preload() {
  ['bacilos-1.jpg','bacilos-2.png','bacilos-3.webp'].forEach((f,i)=>{
    fotosBacilos[i]=loadImage('fotos/'+f, undefined, ()=>{fotosBacilos[i]=null;});
  });
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
  createCanvas(windowWidth, windowHeight);
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  document.querySelector("canvas").style.display = "block";
  cargarTipografias();

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
  musicaActual.setVolume(volumen);
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
  push();
  let e = escalaEscena();
  background(48, 28, 21);
  translate((width - 1000 * e) / 2, (height - 650 * e) / 2);
  scale(e);
  fondoVintage(92, 48, 25);

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

  if (escenaActual === 8) escenaBacilos();
  // El reproductor aparece en todas las escenas de canciones
  if (escenaActual >= 2 && escenaActual <= 7) {
    reproductor();
  }
  navegacion();
  dibujarTransicion();
  pop();
}

// PORTADA
function portada() {
  fondoVintage(92, 48, 25);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(255, 235, 195);
  tipo(65);
  text("Recordar es vivir", 500, 230);

  tipo(25);
  text("Memorias en estéreo", 500, 310);

  tipo(18);
  text("Un universo musical inspirado en Bacilos", 500, 370);

  fill(255, 235, 195);
  rect(375, 440, 250, 60, 10);

  fill(92, 48, 25);
  tipo(20);
  text("Abrir mis recuerdos", 500, 470);

  fill(255, 235, 195, 150);
  tipo(13);
  text("Fragmentos musicales de Bacilos usados con fines académicos",
       500, 615);
}

// GALERÍA
function galeria() {
  fondoVintage(180,120,65); noStroke(); textAlign(CENTER,CENTER);
  fill(255,235,195); tipo(40); textFont('Allura'); textSize(49); text('Nuestros recuerdos',500,82);
  for(let i=0;i<6;i++){
    let x=110+(i%3)*280, y=125+floor(i/3)*215;
    let hover=dentro(x,y,220,180);
    push(); translate(x+110,y+90); rotate(hover?0:[-.035,.025,-.025,.035,-.02,.03][i]); scale(hover?1.045:1);
    drawingContext.shadowColor='rgba(38,19,10,.38)'; drawingContext.shadowBlur=13; drawingContext.shadowOffsetY=7;
    fill(255,240,210); rect(-110,-90,220,180,3); drawingContext.shadowBlur=0; drawingContext.shadowOffsetY=0;
    fotoAjustada(fotosGaleria[i],-100,-80,200,124);
    fill(92,48,25); textFont('Cormorant Garamond'); textSize(21); text(canciones[i],0,61);
    if(visitados.has(i)){fill(105,78,48); circle(94,-74,13); fill(255); textSize(10); text('✓',94,-74);}
    pop();
  }
  fill(255,235,195); tipo(17); text('Tu álbum: '+visitados.size+' de 6 recuerdos descubiertos',500,568);
  for(let i=0;i<6;i++){fill(visitados.has(i)?'#f8dfae':'#795638');circle(425+i*30,593,19);fill('#503421');circle(425+i*30,593,5);}
  if(visitados.size===6){fill(255,235,195);tipo(17);text('Tu álbum está completo',500,625);}
}

function botonVolver() {}

function reproductor(){
 if(!musicaActual)return; push(); noStroke(); fill('#e9d4af');rect(105,602,790,45,12);
 translate(132,624); if(musicaActual.isPlaying())giro+=.045; rotate(giro);fill('#26211e');circle(0,0,39);noFill();stroke('#62554a');for(let r=12;r<20;r+=3)circle(0,0,r*2);noStroke();fill('#aa7048');circle(0,0,15);fill('#e9d4af');circle(0,0,4);pop();
 push();textAlign(CENTER,CENTER);fill('#503421');tipo(15);text('◀',180,624);text(musicaActual.isPlaying()?'Ⅱ':'▶',220,624);text('▶',260,624);
 let d=musicaActual.duration()||1,t=musicaActual.currentTime(), f=constrain(t/d,0,1);stroke('#b69a76');strokeWeight(3);line(300,624,650,624);stroke('#68452e');line(300,624,300+350*f,624);noStroke();fill('#68452e');circle(300+350*f,624,9);tipo(13);text(tiempoAudio(t)+' / '+tiempoAudio(d),710,624);text(volumen?'Vol':'Mute',775,624);stroke('#b69a76');line(805,624,875,624);noStroke();fill('#68452e');circle(805+70*volumen,624,9);pop();
}

function miPrimerMillon() {
  fondoVintage(216, 180, 126);
  textAlign(CENTER, CENTER);
  noStroke();

  fill(92, 48, 25);
  tipo(48);
  text("Mi primer millón", 500, 100);

  tipo(22);
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
    fotoAjustada(fotoGrado1, x1 - crecer / 2, y1 - crecer / 2,
          180 + crecer, 240 + crecer);

    // Foto 2: sale hacia la derecha
    let x2 = lerp(375, 690, salidaFotos);
    let y2 = 280;
    fill(255, 235, 195);
    rect(x2 - 8 - crecer / 2, y2 - 8 - crecer / 2,
         266 + crecer, 204 + crecer);
    fotoAjustada(fotoGrado2, x2 - crecer / 2, y2 - crecer / 2,
          250 + crecer, 188 + crecer);
  }

  dibujarMaleta(salidaFotos);
  fill(75, 39, 24);
  tipo(20);
  text(maletaAbierta ? "Cada sueño es un recuerdo por construir" : "Haz clic en la maleta", 500, 550);

  botonVolver();
}

// TABACO Y CHANEL
function tabacoYChanel() {
  fondoVintage(228, 197, 160);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(102, 59, 43);
  tipo(48);
  text("Tabaco y Chanel", 500, 95);

  tipo(21);
  text("Hay recuerdos que permanecen como un aroma", 500, 155);

  // La foto aparece despacio cuando se activa el perfume
  if (perfumeActivo && alphaPolaroid < 255) {
    alphaPolaroid = alphaPolaroid + 2;
  }

  tint(255, alphaPolaroid);
  fotoAjustada(fotoPolaroid, 680, 230, 170, 205);
  noTint();

  sombra(500, 487, 420, 35);
  degradado(200, 475, 600, 30, "#bd9061", "#65412d", 3);
  dibujarPerfume();

  // Mientras más fuerte suena la canción, más perfume sale
  if (perfumeActivo && particulas.length < 300) {
    let cantidad = 1 + floor(constrain(map(nivel, 0, 0.25, 0, 3), 0, 3));

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

    noStroke();
    for (let j = 4; j > 0; j--) {
      fill(255, 224, 185, p.vida * 0.035);
      circle(p.x, p.y, p.tamano * j);
    }
    p.tamano += 0.12;
    p.vx += sin(frameCount * 0.025 + p.y * 0.03) * 0.025;

    p.x += p.vx;
    p.y += p.vy;
    p.vida -= 3;

    if (p.vida <= 0) {
      particulas.splice(i, 1);
    }
  }

  fill(102, 59, 43);
  tipo(19);

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
  fondoVintage(190, 155, 115);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(92, 48, 25);
  tipo(48);
  text("Perderme Contigo", 500, 95);

  tipo(21);
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

    fotoAjustada(fotosPerderme[i], x + 15, y + 15, 160, 160);

    fill(92, 48, 25);
    tipo(18);
    text("Recuerdo " + (i + 1), x + 95, y + 205);
  }

  let mensajes = [
    "Los momentos sencillos también son especiales",
    "Hay personas que hacen inolvidable un lugar",
    "Algunos recuerdos se construyen juntos"
  ];

  fill(92, 48, 25);
  tipo(19);

  if (fotoSeleccionada === -1) {
    text("Haz clic en una fotografía", 500, 550);
  } else {
    text(mensajes[fotoSeleccionada], 500, 550);
  }

  botonVolver();
}

// GUERRAS PERDIDAS
function guerrasPerdidas() {
  fondoVintage(65, 43, 45);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(255, 225, 190);
  tipo(48);
  text("Guerras perdidas", 500, 95);

  tipo(21);
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
      fotoAjustada(fotoAtardecer, x, 230, 210, 270);
      noTint();

      // La puerta se hace más angosta: parece que se abre
      anchoPuerta = 210 - aperturaPuerta * 180;
    }

    if (i === 0) {
      fill(125, 77, 62);
    } else {
      fill(145, 94, 76);
    }
    dibujarPuerta(x, 230, anchoPuerta, 270, i);

    // Manija
    fill(230, 185, 130);
    circle(x + anchoPuerta * 0.84, 365, max(4, anchoPuerta * 0.07));
  }

  fill(255, 235, 195);
  tipo(22);
  text("Puerta 1", 335, 530);
  text("Puerta 2", 665, 530);

  tipo(18);

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
  fondoVintage(220, 150, 115);

  // Foto de fondo, casi transparente
  tint(255, 45);
  fotoAjustada(fotoNoche, 0, 0, 1000, 650);
  noTint();

  noStroke();
  textAlign(CENTER, CENTER);

  fill(92, 48, 25);
  tipo(48);
  text("Pequeños romances", 500, 95);

  tipo(21);
  text("A veces acercarse también significa alejarse", 500, 155);

  // Los corazones laten con los graves
  let latido = map(bajos, 150, 250, 50, 100);
  latido = constrain(latido, 50, 100);

  // Corazones
  for (let c of corazones) {
    let distancia = dist(mx(), my(), c.x, c.y);

    if (distancia < 100) {
      if (mx() < c.x) {
        c.x += 3;
      } else {
        c.x -= 3;
      }
    } else {
      c.x = lerp(c.x, c.originalX, 0.02);
    }

    c.x = constrain(c.x, 45, 955);

    dibujarCorazon(c.x, c.y, latido);
  }

  fill(92, 48, 25);
  tipo(20);
  text("Acerca el mouse a los corazones", 500, 520);

  botonVolver();
}

// CARALUNA
function caraluna() {
  fondoVintage(45, 55, 80);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(255, 235, 195);
  tipo(48);
  text("Caraluna", 500, 95);

  tipo(21);
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
  lunaRealista(870, 130);

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
  fotoAjustada(fotoCaraluna, 330, 200, 340, 190);
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
      tipo(55 + titileo);
    } else {
      fill(110, 120, 145);
      tipo(55);
    }

    estrellaLuz(x, y, estrellasEncendidas[i]);
  }

  fill(255, 235, 195);
  tipo(19);
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

  if(transicion && millis()-transicion.inicio<650)return;
  if(my()>=0 && my()<48){for(let i=0;i<3;i++)if(dentro(605+i*125,0,125,48)){irA([0,1,8][i]);return;}}
  if(escenaActual===0){if(dentro(375,440,250,60))irA(1);return;}
  if(escenaActual===1){for(let i=0;i<6;i++)if(dentro(110+i%3*280,125+floor(i/3)*215,220,180)){irA(i+2);return;}return;}
  if(escenaActual===8){for(let i=0;i<3;i++)if(dentro(85+i*280,150,270,220))historia=i;return;}
  {
    if(my()>602){
      if(dentro(160,602,40,45))irA(2+(escenaActual-2+5)%6);
      else if(dentro(200,602,40,45))pausarOSeguir();
      else if(dentro(240,602,40,45))irA(2+(escenaActual-2+1)%6);
      else if(musicaActual && mx()>=300 && mx()<=650){let sonaba=musicaActual.isPlaying();musicaActual.jump(constrain((mx()-300)/350,0,.999)*musicaActual.duration());if(!sonaba)musicaActual.pause();}
      else if(dentro(750,602,48,45)){volumen=volumen?0:.6;musicaActual.setVolume(volumen);}
      else if(dentro(800,602,85,45)){volumen=constrain((mx()-805)/70,0,1);musicaActual.setVolume(volumen);}
      return;
    }
    // MI PRIMER MILLÓN
    if (escenaActual === 2 &&
        mx() > 350 && mx() < 650 &&
        my() > 270 && my() < 500) {
      maletaAbierta = !maletaAbierta;
    }

    // TABACO Y CHANEL
    if (escenaActual === 3 &&
        mx() > 420 && mx() < 580 &&
        my() > 250 && my() < 475) {
      perfumeActivo = true;
      crearPerfume();
    }

    // PERDERME CONTIGO
    if (escenaActual === 4) {
      for (let i = 0; i < 3; i++) {
        let x = 170 + i * 240;

        if (mx() > x && mx() < x + 190 &&
            my() > 220 && my() < 470) {
          fotoSeleccionada = i;
        }
      }
    }

    // GUERRAS PERDIDAS
    if (escenaActual === 5) {
      if (mx() > 230 && mx() < 440 &&
          my() > 230 && my() < 500) {
        if (puertaSeleccionada !== 0) {
          aperturaPuerta = 0; // la nueva puerta empieza cerrada
        }
        puertaSeleccionada = 0;
      }

      if (mx() > 560 && mx() < 770 &&
          my() > 230 && my() < 500) {
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

        if (dist(mx(), my(), x, 450) < 35) {
          estrellasEncendidas[i] =
            !estrellasEncendidas[i];
        }
      }
    }
  }
}

// PANTALLA ADAPTABLE Y DIRECCIÓN VISUAL
function escalaEscena() { return Math.min(width / 1000, height / 650); }
function mx() { let e = escalaEscena(); return (mouseX - (width - 1000 * e) / 2) / e; }
function my() { let e = escalaEscena(); return (mouseY - (height - 650 * e) / 2) / e; }
function windowResized() { resizeCanvas(windowWidth, windowHeight); }
function cargarTipografias() {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:wght@400;500&family=Playfair+Display&display=swap";
  link.onload = function() {
    if (document.fonts) {
      Promise.all([
        document.fonts.load('60px Allura'),
        document.fonts.load('20px "Cormorant Garamond"'),
        document.fonts.load('25px "Playfair Display"')
      ]).catch(function(error) { console.warn("Tipografías:", error); });
    }
  };
  document.head.appendChild(link);
}
function tipo(n) {
  // Usar el nombre exacto de cada fuente para que p5.js no lo trate
  // como un único nombre de familia con comas.
  textFont(n >= 45 ? "Allura" : n <= 18 ? "Cormorant Garamond" : "Playfair Display");
  textSize(n >= 45 ? n * 1.22 : n);
}
function fondoVintage(r,g,b) {
  let e = escalaEscena(), w = width/e, h = height/e;
  let x = (1000-w)/2, y = (650-h)/2;
  let ctx = drawingContext;
  let grad = ctx.createRadialGradient(470,270,20,500,325,max(w,h)*0.65);
  grad.addColorStop(0, `rgb(${min(255,r+24)},${min(255,g+18)},${min(255,b+12)})`);
  grad.addColorStop(1, `rgb(${r*0.46},${g*0.42},${b*0.42})`);
  ctx.save(); ctx.fillStyle=grad; ctx.fillRect(x,y,w,h); ctx.restore();
  noStroke();
  for(let i=0;i<1800;i++) {
    let px=x+((i*7919)%10007)/10007*w, py=y+((i*3571)%10009)/10009*h;
    fill(i%2?255:0, 12); rect(px,py,1.2,1.2);
  }
}
function fotoAjustada(img,x,y,w,h) {
  if(!img || !img.width || !img.height) return;
  let ratio=max(w/img.width,h/img.height), sw=w/ratio, sh=h/ratio;
  image(img,x,y,w,h,(img.width-sw)/2,(img.height-sh)/2,sw,sh);
}
function degradado(x,y,w,h,a,b,radio=8) {
  let ctx=drawingContext; ctx.save();
  let g=ctx.createLinearGradient(x,y,x+w*0.2,y+h); g.addColorStop(0,a); g.addColorStop(1,b);
  ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(x,y,w,h,min(radio,w/2,h/2)); ctx.fill(); ctx.restore();
}
function sombra(x,y,w,h) {
  push(); noStroke(); for(let i=12;i>0;i--){fill(25,12,5,5); ellipse(x,y,w+i*5,h+i*2);} pop();
}
function dibujarMaleta(t) {
  push(); noStroke(); sombra(500,500,320,32);
  noFill(); stroke(65,35,22); strokeWeight(13); rect(451,235,98,60,18);
  stroke(157,103,64); strokeWeight(4); rect(451,235,98,60,18); noStroke();
  degradado(350,270,300,230,"#b17b4c","#4d281a",17);
  degradado(362,282,276,205,"#8d5633","#422219",12);
  let tapa=205*(1-t*0.78);
  degradado(362,282,276,tapa,"#a66d42","#5d321e",10);
  if(t>0.03){fill(38,22,17); rect(371,282+tapa,258,max(1,205-tapa),5);}
  for(let x of [385,590]) {
    degradado(x,275,23,220,"#ad8255","#694124",4);
    degradado(x-4,425,31,27,"#ead19a","#80602d",3);
    fill(73,45,25); rect(x+3,431,17,14,2);
  }
  noFill(); stroke(216,163,104,150); strokeWeight(1.5);
  drawingContext.setLineDash([3,4]); rect(358,278,284,214,13); drawingContext.setLineDash([]);
  noStroke(); for(let x of [365,635]) for(let y of [286,484]) {fill(179,139,76); circle(x,y,12); fill(245,213,153); circle(x-2,y-2,3);}
  pop();
}
function dibujarPerfume() {
  push(); noStroke(); sombra(500,475,165,22);
  degradado(420,285,160,190,"#f8e2bd","#80502c",15);
  degradado(429,308,142,158,"#e7b66a","#9b562a",10);
  degradado(465,250,70,40,"#f3db9d","#68513a",5);
  fill(255,240,208,115); rect(430,300,8,150,4); rect(553,300,4,145,2);
  degradado(440,345,120,80,"#fff1d6","#d2b68c",3);
  fill(70,40,26); tipo(17); text("TABACO",500,375); text("& CHANEL",500,400);
  pop();
}
function dibujarPuerta(x,y,w,h,i) {
  push(); noStroke(); degradado(x,y,w,h,i?"#a66b48":"#88583d","#39221b",3);
  for(let j=0;j<12;j++){stroke(50,25,15,40); strokeWeight(1); let xx=x+w*(j+1)/13; line(xx,y+4,xx,y+h-4);}
  noStroke(); for(let yy of [y+18,y+143]) {degradado(x+w*.12,yy,w*.76,108,"#583321","#ad7650",3); degradado(x+w*.17,yy+6,w*.66,96,"#a16b46","#65412c",2);}
  pop();
}
function dibujarCorazon(x,y,n) {
  push(); translate(x,y); scale(n/80); noStroke();
  let ctx=drawingContext; let g=ctx.createRadialGradient(-14,-16,1,0,0,55); g.addColorStop(0,"#edb09a");g.addColorStop(1,"#792b35");
  ctx.save();ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,30);ctx.bezierCurveTo(-65,-10,-35,-48,0,-22);ctx.bezierCurveTo(35,-48,65,-10,0,30);ctx.fill();ctx.restore();pop();
}
function estrellaLuz(x,y,on) {
  push(); noStroke(); if(on) for(let i=10;i>0;i--){fill(255,208,115,8);circle(x,y,i*8);}
  fill(on?color(255,239,190):color(145,150,165)); beginShape(); for(let i=0;i<8;i++){let a=-HALF_PI+i*PI/4;let r=i%2?5:23;vertex(x+cos(a)*r,y+sin(a)*r);}endShape(CLOSE);pop();
}
function lunaRealista(x,y) {
  push(); noStroke(); for(let i=12;i>0;i--){fill(255,225,170,5);circle(x,y,110+i*9);}
  fill(240,220,176);circle(x,y,110);
  for(let i=0;i<32;i++){let a=i*2.4,r=42*sqrt(i/32);fill(142,126,104,35);circle(x+cos(a)*r,y+sin(a)*r,5+i%11);}
  pop();
}

function dentro(x,y,w,h){return mx()>=x&&mx()<=x+w&&my()>=y&&my()<=y+h;}
function tiempoAudio(t){return floor(t/60)+':'+String(floor(t%60)).padStart(2,'0');}
function irA(n){if(n===escenaActual)return; let anterior=escenaActual; detenerCancion(); escenaActual=n;
 transicion={inicio:millis(),tipo:n>=2&&n<=7?'flash':n===1&&anterior>=2?'pagina':'fade'};
 if(n>=2&&n<=7){userStartAudio();visitados.add(n-2);maletaAbierta=false;perfumeActivo=false;particulas=[];fotoSeleccionada=-1;puertaSeleccionada=-1;estrellasEncendidas=Array(5).fill(false);salidaFotos=0;alphaPolaroid=0;aperturaPuerta=0;reproducirCancion(n-2);}
}
function navegacion(){push();noStroke();fill('#39271f');rect(0,0,1000,48);fill('#f5dfb9');textAlign(LEFT,CENTER);textFont('Allura');textSize(32);text('Memorias en estéreo',30,25);textAlign(CENTER,CENTER);textFont('Cormorant Garamond');textSize(19);let nombres=['Inicio','Universos','Bacilos'];for(let i=0;i<3;i++){let x=605+i*125;fill(dentro(x,0,125,48)?'#cfa77b':'#f5dfb9');text(nombres[i],x+62,24);if(escenaActual===[0,1,8][i]||(i===1&&escenaActual>=2&&escenaActual<=7)){rect(x+25,39,75,1);}}pop();}
function dibujarTransicion(){if(!transicion)return;let t=(millis()-transicion.inicio)/650;if(t>=1){transicion=null;return;}push();noStroke();if(transicion.tipo==='pagina'){fill(238,218,181,255*(1-t));rect(1000*t,0,1000*(1-t),650);fill(120,83,48,80*(1-t));rect(1000*t,0,12,650);}else{fill(transicion.tipo==='flash'?color(255,239,210,150*pow(1-t,3)):color(40,25,20,230*(1-t)));rect(0,0,1000,650);}pop();}
function escenaBacilos(){fondoVintage(145,93,52);push();textAlign(CENTER,CENTER);noStroke();fill('#fff0d1');tipo(46);text('Detrás de las canciones',500,91);let tit=['Los orígenes','Su trayectoria','Su legado'];let info=['Bacilos nació en Miami en los años noventa. Su música reúne influencias latinoamericanas, pop y ritmos caribeños.','Con canciones como Tabaco y Chanel, Caraluna y Mi primer millón, el grupo alcanzó reconocimiento internacional y recibió premios Grammy y Latin Grammy.','Sus canciones hablan de sueños, amores y recuerdos. En nuestro proyecto las usamos para conectar la música con momentos de la vida cotidiana.'];for(let i=0;i<3;i++){let x=85+i*280;fill(i===historia?'#fff2d5':'#e1c39a');rect(x,150,270,220,4);if(fotosBacilos[i]&&fotosBacilos[i].width>1)fotoAjustada(fotosBacilos[i],x+10,160,250,165);fill('#583923');tipo(21);text(tit[i],x+135,347);}fill('#f4dfb8');rect(85,397,830,195,6);fill('#563821');tipo(26);text(tit[historia],500,430);tipo(21);textAlign(CENTER,TOP);text(info[historia],130,455,740,105);pop();}
