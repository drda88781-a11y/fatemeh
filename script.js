/**
 * FATEMEH - A Little Program for You ❤️
 * Cinematic Interactive Romantic Experience
 */

(function () {
  'use strict';

  // --- Audio State & Controller ---
  const bgAudio = document.getElementById('bg-music');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  let isAudioPlaying = false;
  let userInteracted = false;

  function initAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0.85;

    // Try autoplay (may be blocked by browser policy until interaction)
    const promise = bgAudio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          isAudioPlaying = true;
          updateAudioUI(true);
        })
        .catch(() => {
          // Autoplay blocked, wait for user interaction
          isAudioPlaying = false;
          updateAudioUI(false);
        });
    }

    // Start on first user interaction anywhere
    const startAudioOnTouch = () => {
      if (!userInteracted) {
        userInteracted = true;
        bgAudio.play()
          .then(() => {
            isAudioPlaying = true;
            updateAudioUI(true);
          })
          .catch(() => {});
      }
    };

    window.addEventListener('click', startAudioOnTouch, { passive: true });
    window.addEventListener('touchstart', startAudioOnTouch, { passive: true });
    window.addEventListener('keydown', startAudioOnTouch, { passive: true });

    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userInteracted = true;
        if (isAudioPlaying) {
          bgAudio.pause();
          isAudioPlaying = false;
          updateAudioUI(false);
        } else {
          bgAudio.play().then(() => {
            isAudioPlaying = true;
            updateAudioUI(true);
          }).catch(err => console.log('Audio play failed:', err));
        }
      });
    }
  }

  function updateAudioUI(playing) {
    if (!audioToggleBtn) return;
    const label = audioToggleBtn.querySelector('.audio-label');
    if (playing) {
      audioToggleBtn.classList.add('playing');
      if (label) label.textContent = 'موسیقی (روشن)';
    } else {
      audioToggleBtn.classList.remove('playing');
      if (label) label.textContent = 'موسیقی (خاموش)';
    }
  }

  // --- DOM Elements ---
  const openingScreen = document.getElementById('opening-screen');
  const startBtn = document.getElementById('start-btn');
  const terminalWindow = document.getElementById('terminal-window');
  const codeContent = document.getElementById('code-content');
  const lineNumbersCol = document.getElementById('line-numbers');
  const skipBtn = document.getElementById('skip-btn');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');

  const msg1 = document.getElementById('console-msg-1');
  const msg2 = document.getElementById('console-msg-2');
  const msg3 = document.getElementById('console-msg-3');

  const climaxContainer = document.getElementById('climax-container');
  const heartPath = document.getElementById('heart-path');
  const heartInner = document.getElementById('heart-inner');
  const calligraphySvg = document.getElementById('calligraphy-svg');
  const nameCalligraphyText = document.getElementById('name-calligraphy-text');
  const decorativeFlourish = document.getElementById('decorative-flourish');
  const finalMessage = document.getElementById('final-message');
  const replayBtn = document.getElementById('replay-btn');
  const penTip = document.getElementById('pen-tip');

  // Python Code to type
  const pythonCode = `class A_Little_Surprise:

    def __init__(self):
        self.name = "Fatemeh"
        self.reason = "to make you smile"

    def run(self):
        while True:
            create_a_little_happiness()
            send_a_heart(to=self.name)


program = A_Little_Surprise()
program.run()`;

  let typingTimer = null;
  let isTyping = false;
  let heartParticlesActive = false;

  // Simple and robust syntax highlighting for Python code
  function highlightPython(code) {
    const lines = code.split('\n');
    return lines.map(line => {
      // Escape HTML
      let formatted = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Strings
      formatted = formatted.replace(/(".*?"|'.*?')/g, '<span class="syn-string">$1</span>');

      // Keywords
      formatted = formatted.replace(/\b(class|def|while|True|to)\b/g, '<span class="syn-keyword">$1</span>');

      // Built-ins & self
      formatted = formatted.replace(/\b(self)\b/g, '<span class="syn-self">$1</span>');

      // Class names
      formatted = formatted.replace(/\b(A_Little_Surprise)\b/g, '<span class="syn-class">$1</span>');

      // Function definitions & calls
      formatted = formatted.replace(/\b(__init__|run|create_a_little_happiness|send_a_heart)\b/g, '<span class="syn-func">$1</span>');

      return formatted;
    }).join('\n');
  }

  // Generate line numbers
  function updateLineNumbers(currentCode) {
    const lineCount = (currentCode.match(/\n/g) || []).length + 1;
    let numbersHtml = '';
    for (let i = 1; i <= Math.max(lineCount, 14); i++) {
      numbersHtml += `${i}<br>`;
    }
    lineNumbersCol.innerHTML = numbersHtml;
  }

  // --- Start Typing Sequence ---
  function startTyping() {
    isTyping = true;
    let charIndex = 0;
    const totalChars = pythonCode.length;
    codeContent.innerHTML = '';
    updateLineNumbers('');

    function typeNextChar() {
      if (!isTyping) return;

      if (charIndex < totalChars) {
        charIndex++;
        const currentSlice = pythonCode.slice(0, charIndex);
        codeContent.innerHTML = highlightPython(currentSlice) + '<span class="terminal-cursor"></span>';
        updateLineNumbers(currentSlice);

        // Typing cadence: slight pauses after newlines & colons
        const char = pythonCode[charIndex - 1];
        let delay = 22 + Math.random() * 25;
        if (char === '\n') delay = 90;
        if (char === ':') delay = 120;

        typingTimer = setTimeout(typeNextChar, delay);
      } else {
        finishTyping();
      }
    }

    typeNextChar();
  }

  // Finish typing immediately (Skip or naturally finished)
  function finishTyping() {
    isTyping = false;
    clearTimeout(typingTimer);
    codeContent.innerHTML = highlightPython(pythonCode) + '<span class="terminal-cursor"></span>';
    updateLineNumbers(pythonCode);
    if (skipBtn) skipBtn.style.display = 'none';

    // Update status
    if (statusIndicator) statusIndicator.classList.add('done');
    if (statusText) statusText.textContent = 'در حال اجرا...';

    // Persian execution messages cascade
    setTimeout(() => {
      if (msg1) msg1.classList.add('visible');
    }, 400);

    setTimeout(() => {
      if (msg2) msg2.classList.add('visible');
    }, 1200);

    setTimeout(() => {
      if (msg3) msg3.classList.add('visible');
      if (statusText) statusText.textContent = 'خاتمه یافت';
    }, 2000);

    // Transition to heart
    setTimeout(() => {
      startCinematicClimax();
    }, 3200);
  }

  // --- Stage Transition: Opening to Terminal ---
  startBtn.addEventListener('click', () => {
    // Start background audio if not started
    if (bgAudio && bgAudio.paused) {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        updateAudioUI(true);
      }).catch(() => {});
    }

    openingScreen.classList.add('fade-out');

    setTimeout(() => {
      openingScreen.style.display = 'none';
      terminalWindow.classList.add('active');
      startTyping();
    }, 600);
  });

  // Skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      finishTyping();
    });
  }

  // --- Cinematic Climax: Terminal -> Glowing Heart & Fatemeh Calligraphy ---
  function startCinematicClimax() {
    terminalWindow.classList.remove('active');
    terminalWindow.classList.add('fade-out');

    setTimeout(() => {
      terminalWindow.style.display = 'none';
      climaxContainer.classList.add('active');
      heartParticlesActive = true;

      // Draw SVG Heart stroke
      if (heartPath) {
        heartPath.classList.add('draw');
      }

      // Animate Calligraphy Strokes
      setTimeout(() => {
        animateCalligraphy();
      }, 1000);

      // Show inner heart glow
      setTimeout(() => {
        if (heartInner) heartInner.classList.add('visible');
      }, 2000);

      // Reveal calligraphy text
      setTimeout(() => {
        if (nameCalligraphyText) nameCalligraphyText.classList.add('revealed');
        if (decorativeFlourish) decorativeFlourish.classList.add('revealed');
        if (penTip) penTip.style.opacity = '0';
      }, 3400);

      // Reveal Final Message
      setTimeout(() => {
        if (finalMessage) finalMessage.classList.add('revealed');
      }, 4200);

    }, 900);
  }

  // Calligraphy Animation with glowing pen tip
  function animateCalligraphy() {
    const strokes = calligraphySvg.querySelectorAll('.cursive-stroke');
    strokes.forEach((stroke, idx) => {
      stroke.style.animationDelay = `${idx * 0.15}s`;
      stroke.classList.add('animate');
    });

    // Animate glowing pen tip along the main cursive path
    const mainStroke = document.getElementById('name-main-path');
    if (mainStroke && penTip) {
      penTip.style.opacity = '1';
      const pathLength = mainStroke.getTotalLength();
      const startTime = performance.now();
      const duration = 2800; // ms

      function followPath(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const point = mainStroke.getPointAtLength(progress * pathLength);

        // Convert SVG point coordinates to parent wrapper coordinates
        const svgRect = calligraphySvg.getBoundingClientRect();
        const wrapperRect = calligraphySvg.parentElement.getBoundingClientRect();

        const scaleX = svgRect.width / 500; // SVG viewBox width is 500
        const scaleY = svgRect.height / 160; // SVG viewBox height is 160

        const posX = (point.x * scaleX) + (svgRect.left - wrapperRect.left);
        const posY = (point.y * scaleY) + (svgRect.top - wrapperRect.top);

        penTip.style.left = `${posX}px`;
        penTip.style.top = `${posY}px`;

        if (progress < 1 && climaxContainer.classList.contains('active')) {
          requestAnimationFrame(followPath);
        } else {
          penTip.style.opacity = '0';
        }
      }

      requestAnimationFrame(followPath);
    }
  }

  // --- Replay Functionality ---
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      // Reset classes
      climaxContainer.classList.remove('active');
      heartParticlesActive = false;

      if (heartPath) heartPath.classList.remove('draw');
      if (heartInner) heartInner.classList.remove('visible');
      if (nameCalligraphyText) nameCalligraphyText.classList.remove('revealed');
      if (decorativeFlourish) decorativeFlourish.classList.remove('revealed');
      if (finalMessage) finalMessage.classList.remove('revealed');

      const strokes = calligraphySvg.querySelectorAll('.cursive-stroke');
      strokes.forEach(s => s.classList.remove('animate'));

      // Reset console messages
      if (msg1) msg1.classList.remove('visible');
      if (msg2) msg2.classList.remove('visible');
      if (msg3) msg3.classList.remove('visible');

      if (statusIndicator) statusIndicator.classList.remove('done');
      if (statusText) statusText.textContent = 'در حال تایپ...';
      if (skipBtn) skipBtn.style.display = 'block';

      // Reset terminal
      terminalWindow.style.display = 'flex';
      terminalWindow.classList.remove('fade-out');

      setTimeout(() => {
        terminalWindow.classList.add('active');
        startTyping();
      }, 500);
    });
  }

  // ==========================================================================
  // HIGH-PERFORMANCE 60FPS CANVAS PARTICLE ENGINE
  // ==========================================================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function updateCanvasDimensions() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', updateCanvasDimensions);
  window.addEventListener('orientationchange', () => {
    setTimeout(updateCanvasDimensions, 200);
  });

  // Ambient Star Dust Particles
  const starsCount = 85;
  const stars = [];
  for (let i = 0; i < starsCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.7 + 0.2,
      flickerSpeed: Math.random() * 0.02 + 0.005,
      flickerOffset: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.05
    });
  }

  // Floating Hearts
  const floatingHeartsCount = 18;
  const floatingHearts = [];
  for (let i = 0; i < floatingHeartsCount; i++) {
    floatingHearts.push({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      size: Math.random() * 10 + 6,
      vy: Math.random() * 0.6 + 0.4,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayDist: Math.random() * 25 + 10,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.45 + 0.2,
      color: Math.random() > 0.4 ? '#ff2a85' : '#c084fc'
    });
  }

  // Draw Heart shape on Canvas helper
  function drawCanvasHeart(context, x, y, size, color, opacity) {
    context.save();
    context.translate(x, y);
    context.globalAlpha = opacity;
    context.fillStyle = color;
    context.beginPath();
    const topCurveHeight = size * 0.3;
    context.moveTo(0, topCurveHeight);
    // top left curve
    context.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
    // top right curve
    context.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
    context.closePath();
    context.fill();
    context.restore();
  }

  // Parametric Heart Formula for Halo Particles
  // x = 16 * sin^3(t)
  // y = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t))
  function getHeartPoint(t, scale) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return {
      x: x * scale,
      y: y * scale
    };
  }

  // Heart Halo Particles (Active during climax)
  const haloCount = 140;
  const haloParticles = [];
  for (let i = 0; i < haloCount; i++) {
    const t = Math.random() * Math.PI * 2;
    haloParticles.push({
      t: t,
      speed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      scaleVariation: Math.random() * 0.18 - 0.09,
      size: Math.random() * 2.8 + 1.2,
      jitterX: (Math.random() - 0.5) * 16,
      jitterY: (Math.random() - 0.5) * 16,
      color: Math.random() > 0.35 ? '#ff2a85' : (Math.random() > 0.5 ? '#fbcfe8' : '#a855f7'),
      glow: Math.random() * 12 + 6
    });
  }

  // Main Render Loop
  let frame = 0;
  function renderCanvas() {
    frame++;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Star Dust
    for (let i = 0; i < starsCount; i++) {
      const s = stars[i];
      s.x += s.vx;
      s.y += s.vy;
      if (s.y < -10) {
        s.y = height + 10;
        s.x = Math.random() * width;
      }
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;

      const currentOpacity = s.opacity * (0.65 + 0.35 * Math.sin(frame * s.flickerSpeed + s.flickerOffset));
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = currentOpacity;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ff65a9';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Draw Floating Hearts
    for (let i = 0; i < floatingHeartsCount; i++) {
      const h = floatingHearts[i];
      h.y -= h.vy;
      const swayX = h.x + Math.sin(frame * h.swaySpeed + h.swayOffset) * h.swayDist;

      if (h.y < -30) {
        h.y = height + Math.random() * 80;
        h.x = Math.random() * width;
      }

      drawCanvasHeart(ctx, swayX, h.y, h.size, h.color, h.opacity);
    }

    // 3. Draw Heart Halo Particles (during climax)
    if (heartParticlesActive) {
      const centerX = width / 2;
      // Adjust center Y slightly upwards to match the heart SVG position
      const centerY = height * 0.46;
      const baseScale = Math.min(width, height) * 0.0155;

      for (let i = 0; i < haloCount; i++) {
        const p = haloParticles[i];
        p.t += p.speed;
        const scale = baseScale * (1 + p.scaleVariation);
        const pt = getHeartPoint(p.t, scale);

        const currentX = centerX + pt.x + p.jitterX;
        const currentY = centerY + pt.y + p.jitterY;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.glow;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    requestAnimationFrame(renderCanvas);
  }

  // Initialize Canvas & Audio
  renderCanvas();
  initAudio();

})();

