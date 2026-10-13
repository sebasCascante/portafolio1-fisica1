function chart(id, xs, ser, xl, yl) {
    const W = 640, H = 300, L = 62, R = 14, T = 14, B = 48, el = document.getElementById(id);
    const x0 = Math.min(...xs), x1 = Math.max(...xs);
    let all = ser.flatMap(s => s.y), y0 = Math.min(0, ...all), y1 = Math.max(...all);
    if (y1 === y0) { y1 = y0 + 1 }
    const pad = (y1 - y0) * 0.08; y1 += pad; if (y0 < 0) y0 -= pad;
    const sx = x => L + (x - x0) / (x1 - x0) * (W - L - R), sy = y => H - B - (y - y0) / (y1 - y0) * (H - T - B);
    let s = '<g font-family="system-ui,sans-serif" font-size="12" fill="#51606d">';
    for (let i = 0; i <= 5; i++) {
        const xv = x0 + (x1 - x0) * i / 5, yv = y0 + (y1 - y0) * i / 5;
        s += '<line x1="' + sx(xv) + '" y1="' + T + '" x2="' + sx(xv) + '" y2="' + (H - B) + '" stroke="#e3e9ee"/>';
        s += '<line x1="' + L + '" y1="' + sy(yv) + '" x2="' + (W - R) + '" y2="' + sy(yv) + '" stroke="#e3e9ee"/>';
        s += '<text x="' + sx(xv) + '" y="' + (H - B + 16) + '" text-anchor="middle">' + (+xv.toFixed(2)) + '</text>';
        s += '<text x="' + (L - 6) + '" y="' + (sy(yv) + 4) + '" text-anchor="end">' + (+yv.toFixed(2)) + '</text>';
    }
    s += '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="#13202b"/><line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '" stroke="#13202b"/>';
    s += '<text x="' + ((L + W - R) / 2) + '" y="' + (H - 22) + '" text-anchor="middle" fill="#13202b" font-size="13">' + xl + '</text>';
    s += '<text transform="translate(14,' + ((T + H - B) / 2) + ') rotate(-90)" text-anchor="middle" fill="#13202b" font-size="13">' + yl + '</text>';
    ser.forEach((q, i) => {
        s += '<polyline fill="none" stroke="' + q.c + '" stroke-width="2.2" points="' + xs.map((x, j) => sx(x).toFixed(1) + ',' + sy(q.y[j]).toFixed(1)).join(' ') + '"/>';
        s += '<line x1="' + (L + 12 + i * 150) + '" y1="' + (H - 6) + '" x2="' + (L + 34 + i * 150) + '" y2="' + (H - 6) + '" stroke="' + q.c + '" stroke-width="3"/><text x="' + (L + 40 + i * 150) + '" y="' + (H - 2) + '" fill="#13202b">' + q.n + '</text>';
    });
    el.innerHTML = s + '</g>';
}
// Tema 1
const t = []; for (let i = 0; i <= 60; i++)t.push(i / 2);
const X = t.map(u => 2 * u + 0.1 * u * u), Y = t.map(u => 15 * Math.sin(0.25 * u));
const VX = t.map(u => 2 + 0.2 * u), VY = t.map(u => 3.75 * Math.cos(0.25 * u));
const AX = t.map(() => 0.2), AY = t.map(u => -0.9375 * Math.sin(0.25 * u));
const A = '#0a6c8c', O = '#c2410c', G = '#13202b';
chart('c1a', t, [{ n: 'x(t)', y: X, c: A }, { n: 'y(t)', y: Y, c: O }], 'Tiempo t (s)', 'Posición (m)');
chart('c1b', t, [{ n: 'vx', y: VX, c: A }, { n: 'vy', y: VY, c: O }, { n: '|v|', y: VX.map((v, i) => Math.hypot(v, VY[i])), c: G }], 'Tiempo t (s)', 'Velocidad (m/s)');
chart('c1c', t, [{ n: 'ax', y: AX, c: A }, { n: 'ay', y: AY, c: O }], 'Tiempo t (s)', 'Aceleración (m/s²)');
// Tema 4
const fz = []; for (let i = 0; i <= 32; i++)fz.push(i * 0.25);
chart('c4', fz, [{ n: 'Modelo simple μ constante', y: fz.map(f => 2 * f), c: O }, { n: 'Con sensibilidad a la carga', y: fz.map(f => f * (2 - 0.06 * f)), c: A }], 'Carga vertical Fz (kN)', 'Fuerza lateral máxima (kN)');
// Tema 5
const xm = []; for (let i = 0; i <= 40; i++)xm.push(i * 0.25);
chart('c5', xm, [{ n: 'F = kx (máx. 6 N)', y: xm.map(x => Math.min(0.8 * x, 6)), c: A }], 'Desplazamiento del gatillo x (mm)', 'Fuerza restauradora (N)');
// Tema 2
const cv = document.getElementById('cv'), cx = cv.getContext('2d'), v0 = document.getElementById('v0'), gg = document.getElementById('gg'), VXH = 5;
function sim() {
    const v = +v0.value, g = +gg.value, h = v * v / (2 * g), T = 2 * v / g, rng = VXH * T;
    document.getElementById('v0o').textContent = v; document.getElementById('ggo').textContent = g;
    document.getElementById('so').innerHTML = 'Altura máxima h = v₀²/(2g) = <b>' + h.toFixed(2) + ' m</b> · Tiempo en el aire = 2v₀/g = <b>' + T.toFixed(2) + ' s</b> · Alcance = <b>' + rng.toFixed(1) + ' m</b> · Referencia: con g = 9,81 el mismo impulso daría h = ' + (v * v / 19.62).toFixed(2) + ' m';
    return { v, g, h, T, rng };
}
function draw() {
    const s = sim(), W = 640, H = 260, sc = Math.min((W - 60) / s.rng, (H - 60) / s.h);
    cx.clearRect(0, 0, W, H);
    cx.strokeStyle = '#13202b'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(20, H - 30); cx.lineTo(W - 20, H - 30); cx.stroke();
    cx.strokeStyle = '#0a6c8c'; cx.lineWidth = 2; cx.beginPath();
    for (let i = 0; i <= 80; i++) { const u = s.T * i / 80, px = 30 + VXH * u * sc, py = H - 30 - (s.v * u - 0.5 * s.g * u * u) * sc; i ? cx.lineTo(px, py) : cx.moveTo(px, py) }
    cx.stroke();
    const u = ((performance.now() / 1000) % (s.T + 0.4));
    if (u <= s.T) { cx.fillStyle = '#c2410c'; cx.beginPath(); cx.arc(30 + VXH * u * sc, H - 30 - (s.v * u - 0.5 * s.g * u * u) * sc - 8, 8, 0, 7); cx.fill() }
    cx.fillStyle = '#51606d'; cx.font = '13px system-ui'; cx.fillText('escala ajustada automáticamente', 24, 18);
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);