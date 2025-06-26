document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');

  navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.content section:not(#education)');

  sections.forEach((section, index) => {
    section.classList.add(index % 2 === 0 ? 'slide-from-left' : 'slide-from-right');
  });

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.6 
  });

  sections.forEach(section => {
    observer.observe(section);
  });
});

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Stars
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.5 });
const starsCount = 10000;
const positions = [];

for (let i = 0; i < starsCount; i++) {
    positions.push(
        Math.random() * 2000 - 1000, // x
        Math.random() * 2000 - 1000, // y
        Math.random() * 2000 - 1000  // z
    );
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Camera Position
camera.position.z = 0;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    stars.rotation.x += 0.001;
    stars.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();

// Adjust Canvas Size on Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

function typeWriterEffect(element, text, delay = 40, callback = null) {
  let i = 0;
  element.classList.add("typewriter-cursor");

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, delay);
    } else if (callback) {
      callback();
    }
  }

  element.innerHTML = ""; // Clear before typing
  type();
}

function deleteWriterEffect(element, delay = 20, callback = null) {
  let text = element.innerHTML;
  let i = text.length;

  function erase() {
    if (i > 0) {
      element.innerHTML = text.substring(0, --i);
      setTimeout(erase, delay);
    } else if (callback) {
      callback();
    }
  }

  erase();
}

function showWelcomeMessage() {
  const output = document.getElementById("output");
  output.innerHTML = "";

  const line1 = document.createElement("div");
  line1.className = "line ai";
  output.appendChild(line1);

  typeWriterEffect(line1, "HOLA! Welcome to my Portfolio ✌️", 40, () => {
    const line2 = document.createElement("div");
    line2.className = "line ai typewriter-cursor";
    output.appendChild(line2);

    const baseText = "I am ";
    const roles = ["a Software Developer", "a Student", "a Tech Enthusiast", "an Innovator"];
    let roleIndex = 0;

    function loopRoles() {
      const fullText = baseText + roles[roleIndex];
      typeWriterEffect(line2, fullText, 40, () => {
        setTimeout(() => {
          deleteWriterEffect(line2, 20, () => {
            roleIndex = (roleIndex + 1) % roles.length;
            loopRoles();
          });
        }, 800);
      });
    }

    loopRoles();
  });
}

window.onload = showWelcomeMessage;
