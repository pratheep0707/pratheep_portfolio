/**
 * PRATHEEP S - DATA ANALYST PORTFOLIO
 * Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initNetworkCanvas();
  initLightbox();
  initCopyButtons();
  initContactForm();
  initCounterAnimations();
});

/* ===================================================================
   1. NAVBAR & NAVIGATION
   =================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ===================================================================
   2. DATA NETWORK CANVAS BACKGROUND (Floating Nodes & Edges)
   =================================================================== */
function initNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.min(Math.floor((width * height) / 18000), 55);
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      isGold: Math.random() > 0.75,
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.15;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = nodes[i].isGold || nodes[j].isGold 
            ? `rgba(245, 166, 35, ${alpha})` 
            : `rgba(56, 189, 248, ${alpha * 0.8})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.isGold ? 'rgba(245, 166, 35, 0.75)' : 'rgba(209, 213, 219, 0.4)';
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   3. HIGH-RESOLUTION DASHBOARD LIGHTBOX MODAL
   =================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const triggerImg = document.getElementById('dashboard-trigger');
  const triggerBtn = document.getElementById('view-dashboard-btn');
  const closeBtn = document.getElementById('lightbox-close');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomResetBtn = document.getElementById('zoom-reset');
  const lightboxImg = document.getElementById('lightbox-img');

  if (!modal || !lightboxImg) return;

  let zoomLevel = 1;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetZoom();
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function applyZoom() {
    lightboxImg.style.transform = `scale(${zoomLevel})`;
    lightboxImg.style.cursor = zoomLevel > 1 ? 'grab' : 'zoom-in';
  }

  function resetZoom() {
    zoomLevel = 1;
    applyZoom();
  }

  if (triggerImg) triggerImg.addEventListener('click', openModal);
  if (triggerBtn) triggerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      if (zoomLevel < 3.0) {
        zoomLevel += 0.25;
        applyZoom();
      }
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      if (zoomLevel > 0.75) {
        zoomLevel -= 0.25;
        applyZoom();
      }
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', resetZoom);
  }

  // Close on backdrop click (outside image and header)
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-body')) {
      closeModal();
    }
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   4. COPY TO CLIPBOARD WITH TOAST FEEDBACK
   =================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied: ${textToCopy}`);
        }).catch(() => {
          // Fallback
          const temp = document.createElement('textarea');
          temp.value = textToCopy;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          showToast(`Copied: ${textToCopy}`);
        });
      }
    });
  });
}

/* ===================================================================
   5. CONTACT FORM HANDLER
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name')?.value || '';
    const email = document.getElementById('form-email')?.value || '';
    const subject = document.getElementById('form-subject')?.value || 'Data Analytics Opportunity';
    const message = document.getElementById('form-message')?.value || '';

    // Create mailto fallback link
    const mailtoUrl = `mailto:pratheepsara2000@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    showToast('Opening email client to send message...');
    window.location.href = mailtoUrl;
    form.reset();
  });
}

/* ===================================================================
   6. DYNAMIC BAR CHART IN DATA CONSOLE
   =================================================================== */
function initCounterAnimations() {
  // Animate mini bars periodically
  const bars = document.querySelectorAll('.chart-bar-fill');
  if (bars.length > 0) {
    setInterval(() => {
      bars.forEach((bar) => {
        const currentHeight = parseInt(bar.style.height || '50');
        const variation = (Math.random() * 20 - 10);
        let newHeight = Math.min(Math.max(currentHeight + variation, 25), 95);
        bar.style.height = `${newHeight}%`;
      });
    }, 2800);
  }
}
