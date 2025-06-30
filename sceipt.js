<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Debounced Heart</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: black;
    }
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>

  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    function debounce(func, threshold, callImmediately) {
      var timeout;
      return function () {
        const context = this;
        const args = arguments;

        const delayed = function () {
          timeout = null;
          if (!callImmediately) func.apply(context, args);
        };

        const callNow = callImmediately && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(delayed, threshold);

        if (callNow) func.apply(context, args);
      };
    }

    // Создание точек сердца
    const particles = [];
    function heartShape(t) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      return { x, y };
    }

    for (let i = 0; i < 1000; i++) {
      const angle = Math.random() * Math.PI * 2;
      const { x, y } = heartShape(angle);
      particles.push({
        x: canvas.width / 2 + x * 15,
        y: canvas.height / 2 - y * 15,
        vx: 0,
        vy: 0,
        baseX: canvas.width / 2 + x * 15,
        baseY: canvas.height / 2 - y * 15,
        size: 2 + Math.random() * 2
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let p of particles) {
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let force = Math.min(100 / dist, 5);

        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;

        // притягиваем обратно к исходной позиции
        p.vx += (p.baseX - p.x) * 0.01;
        p.vy += (p.baseY - p.y) * 0.01;

        // трение
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    draw();

    const handleMouseMove = debounce((e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, 10); // ← debounce в 10 мс

    window.addEventListener('mousemove', handleMouseMove);
  </script>
</body>
</html>
