
let escenaActual = 0;

// ESTADOS DE LAS INTERACCIONES
let maletaAbierta = false;
let perfumeActivo = false;
let particulas = [];
let fotoSeleccionada = -1;
let puertaSeleccionada = -1;
let estrellasEncendidas = [false, false, false, false, false];
let corazones = [];

// MÚSICA
let musicaActual = null;

let archivosMusica = [
  "musica/mi-primer-millon.mp3",
  "musica/tabaco-y-chanel.mp3",
  "musica/perderme-contigo.mp3",
  "musica/guerras-perdidas.mp3",
  "musica/pequenos-romances.mp3",
  "musica/caraluna.mp3"
];

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

// CONFIGURACIÓN
function setup() {
  createCanvas(1000, 650);

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

  musicaActual = new Audio(archivosMusica[numero]);
  musicaActual.volume = 0.6;

  musicaActual.play().catch(error => {
    console.log("No se pudo reproducir la canción:", error);
  });
}

function detenerCancion() {
  if (musicaActual !== null) {
    musicaActual.pause();
    musicaActual.currentTime = 0;
    musicaActual = null;
  }
}

// DIBUJAR PANTALLAS
function draw() {
  background(92, 48, 25);

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

    fill(255, 235, 195);
    rect(x, y, 230, 160, 8);

    fill(130, 75, 40);
    rect(x + 10, y + 10, 210, 110);

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
    fill(255, 235, 195);
    ellipse(440, 370, 65);
    ellipse(500, 370, 65);
    ellipse(560, 370, 65);

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

  // Fotografías
  for (let i = 0; i < 3; i++) {
    let x = 170 + i * 240;

    fill(255, 235, 195);
    rect(x, 240, 190, 230, 5);

    fill(140, 95, 65);
    rect(x + 15, 255, 160, 160);

    fill(92, 48, 25);
    textSize(18);
    text("Recuerdo " + (i + 1), x + 95, 445);
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

  // Puertas
  fill(125, 77, 62);
  rect(230, 230, 210, 270, 8);

  fill(230, 185, 130);
  circle(405, 365, 18);

  fill(145, 94, 76);
  rect(560, 230, 210, 270, 8);

  fill(230, 185, 130);
  circle(735, 365, 18);

  fill(255, 235, 195);
  textSize(22);
  text("Puerta 1", 335, 530);
  text("Puerta 2", 665, 530);

  textSize(18);

  if (puertaSeleccionada === -1) {
    text("Elige una puerta", 500, 590);
  } else if (puertaSeleccionada === 0) {
    text("Una decisión puede cambiarlo todo", 500, 590);
  } else {
    text("Toda acción puede tener consecuencias", 500, 590);
  }

  botonVolver();
}

// PEQUEÑOS ROMANCES
function pequenosRomances() {
  background(220, 150, 115);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(92, 48, 25);
  textSize(48);
  text("Pequeños romances", 500, 95);

  textSize(21);
  text("A veces acercarse también significa alejarse", 500, 155);

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
    textSize(65);
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

  // Luna
  fill(245, 225, 175);
  circle(500, 300, 150);

  fill(45, 55, 80);
  circle(545, 265, 140);

  // Estrellas
  for (let i = 0; i < 5; i++) {
    let x = 180 + i * 160;
    let y = 450;

    if (estrellasEncendidas[i]) {
      fill(255, 220, 100);
    } else {
      fill(110, 120, 145);
    }

    textSize(55);
    text("★", x, y);
  }

  fill(255, 235, 195);
  textSize(19);
  text("Haz clic en las estrellas para iluminar los recuerdos",
       500, 550);

  let total = 0;

  for (let encendida of estrellasEncendidas) {
    if (encendida) {
      total++;
    }
  }

  if (total === 5) {
    text("Hay personas que nunca dejamos de recordar",
         500, 590);
  }

  botonVolver();
}

// INTERACCIONES
function mousePressed() {

  // ENTRAR DESDE LA PORTADA
  if (escenaActual === 0) {
    if (mouseX > 375 && mouseX < 625 &&
        mouseY > 440 && mouseY < 500) {
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
            mouseY > 240 && mouseY < 470) {
          fotoSeleccionada = i;
        }
      }
    }

    // GUERRAS PERDIDAS
    if (escenaActual === 5) {
      if (mouseX > 230 && mouseX < 440 &&
          mouseY > 230 && mouseY < 500) {
        puertaSeleccionada = 0;
      }

      if (mouseX > 560 && mouseX < 770 &&
          mouseY > 230 && mouseY < 500) {
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
