// Type writer effect//
var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};

// Hamburger menu //
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger');

        menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('translate-x-full');
        menuBtn.classList.toggle('text-white');
        hamburger.classList.toggle('fixed');
        hamburger.classList.toggle('absolute');
});

// Event listener for scrolling//
document.addEventListener("wheel", (event) => {
    if (event.deltaY > 0) {
        moveToNextSection();
    }

if (event.deltaY < 0) {
        moveToPrevSection();
    }
});

function moveToNextSection() {
    const sections = document.querySelectorAll("section");
    let currentSectionIndex = 0;
    
    sections.forEach((section, index) => {
        if (window.scrollY >= section.offsetTop - 10) {
            currentSectionIndex = index;
        }
    });
    
    const nextSection = sections[currentSectionIndex + 1];
    if (nextSection) {
        window.scrollTo({
            top: nextSection.offsetTop,
            behavior: "smooth"
        });
    }
}

function moveToPrevSection() {
    const sections = document.querySelectorAll("section");
    let currentSectionIndex = 0;
    
    sections.forEach((section, index) => {
        if (window.scrollY >= section.offsetTop - 10) {
            currentSectionIndex = index;
        }
    });
    
    const prevSection = sections[currentSectionIndex - 1];
    if (prevSection) {
        window.scrollTo({
            top: prevSection.offsetTop,
            behavior: "smooth"
        });
    }
}

function handleout(){ 
    mobileMenu.classList.toggle('translate-x-full');
    menuBtn.classList.toggle('text-white');
    hamburger.classList.toggle('fixed');
    hamburger.classList.toggle('absolute');
}


// Eye Tracker Animation
const config = {
    maxEyeMovementX: 4,
    maxEyeMovementY: 2,
    maxHeadRotation: 3,
    maxHeadTranslation: 4,
    lookForwardDistance: 10
  };

  // Get DOM elements
  const container = document.getElementById('container');
  const headContainer = document.getElementById('headContainer');
  const leftEye = document.getElementById('leftEye');
  const rightEye = document.getElementById('rightEye');
  const demoCursor = document.getElementById('demoCursor');

  // Calculate eye movement with elliptical constraint
  function calculateEyeMovement(mouseX, mouseY, eyeCenterX, eyeCenterY) {
    const dx = mouseX - eyeCenterX;
    const dy = mouseY - eyeCenterY;
    
    // Elliptical clamp so vertical movement is gentler
    const norm = Math.sqrt(
      (dx * dx) / (config.maxEyeMovementX * config.maxEyeMovementX) +
      (dy * dy) / (config.maxEyeMovementY * config.maxEyeMovementY)
    );
    
    if (norm <= 1) return { x: dx, y: dy };
    
    const scale = 1 / norm;
    return { x: dx * scale, y: dy * scale };
  }

  // Handle mouse movement
  function handleMouseMove(e) {
    // Update demo cursor position
    demoCursor.style.left = e.clientX + 'px';
    demoCursor.style.top = e.clientY + 'px';

    // Get container center
    const containerRect = container.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    // Calculate distance from mouse to container center
    const dx = e.clientX - containerCenterX;
    const dy = e.clientY - containerCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If mouse is very close to container, eyes look forward
    if (distance < config.lookForwardDistance) {
      leftEye.style.transform = 'translate(0, 0)';
      rightEye.style.transform = 'translate(0, 0)';
      headContainer.style.transform = 'translate(0, 0) rotateX(0deg) rotateY(0deg)';
      return;
    }

    // Calculate head movement and rotation
    const headRotationX = Math.max(-config.maxHeadRotation, Math.min(config.maxHeadRotation, 
      (dy / containerRect.height) * config.maxHeadRotation));
    const headRotationY = Math.max(-config.maxHeadRotation, Math.min(config.maxHeadRotation, 
      (dx / containerRect.width) * config.maxHeadRotation));
    
    const headTranslationX = Math.max(-config.maxHeadTranslation, Math.min(config.maxHeadTranslation, 
      (dx / containerRect.width) * config.maxHeadTranslation));
    const headTranslationY = Math.max(-config.maxHeadTranslation, Math.min(config.maxHeadTranslation, 
      (dy / containerRect.height) * config.maxHeadTranslation));

    // Calculate eye movements
    const leftEyeRect = leftEye.getBoundingClientRect();
    const rightEyeRect = rightEye.getBoundingClientRect();

    const leftEyeCenterX = leftEyeRect.left + leftEyeRect.width / 2;
    const leftEyeCenterY = leftEyeRect.top + leftEyeRect.height / 2;
    const rightEyeCenterX = rightEyeRect.left + rightEyeRect.width / 2;
    const rightEyeCenterY = rightEyeRect.top + rightEyeRect.height / 2;

    // Calculate eye positions
    const leftEyeMovement = calculateEyeMovement(e.clientX, e.clientY, leftEyeCenterX, leftEyeCenterY);
    const rightEyeMovement = calculateEyeMovement(e.clientX, e.clientY, rightEyeCenterX, rightEyeCenterY);

    // Apply eye movements
    leftEye.style.transform = `translate(${leftEyeMovement.x}px, ${leftEyeMovement.y}px)`;
    rightEye.style.transform = `translate(${rightEyeMovement.x}px, ${rightEyeMovement.y}px)`;
  }

  // Add event listener
  document.addEventListener('mousemove', handleMouseMove);

  // Hide demo cursor after 3 seconds
  setTimeout(() => {
    demoCursor.style.opacity = '0';
  }, 3000);