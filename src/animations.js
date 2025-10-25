// Scroll-triggered animations and interactive elements
document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  scrollElements.forEach(el => observer.observe(el));

  // Parallax effect for floating shapes
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed);
      shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Button hover effects
  const buttons = document.querySelectorAll('.hero-btn, .cta-btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Feature card interactions
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = 'none';
    });
  });

  // Removed typing animation to keep the title static

  // Counter animation for stats
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + (target >= 1000 ? 'K+' : '%');
    }, 20);
  };

  // Trigger counter animation when stats come into view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target.querySelector('.stat-number');
        const text = statNumber.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        animateCounter(statNumber, number);
        statsObserver.unobserve(entry.target);
      }
    });
  });

  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(item => statsObserver.observe(item));

  // Loading shimmer effect
  const addShimmerEffect = () => {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
      card.classList.add('loading-shimmer');
      setTimeout(() => {
        card.classList.remove('loading-shimmer');
      }, 2000);
    });
  };

  // Add shimmer effect on page load
  setTimeout(addShimmerEffect, 500);

  // Particle system for background
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      left: ${Math.random() * 100}vw;
      top: 100vh;
      animation: floatUp 8s linear forwards;
    `;
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 8000);
  };

  // Create particles periodically
  setInterval(createParticle, 3000);

  // Add particle animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatUp {
      to {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
  // Scroll-based animations here
}, 16)); // ~60fps
