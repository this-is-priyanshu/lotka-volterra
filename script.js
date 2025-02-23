function lotkaVolterraRK4(x0, y0, alpha, beta, gamma, delta, tMax = 100, dt = 0.1) {
    let prey = [x0];
    let predator = [y0];
    let time = [0];

    for (let t = dt; t <= tMax; t += dt) {
        let x = prey[prey.length - 1];
        let y = predator[predator.length - 1];

        let k1x = alpha * x - beta * x * y;
        let k1y = delta * x * y - gamma * y;

        let k2x = alpha * (x + 0.5 * dt * k1x) - beta * (x + 0.5 * dt * k1x) * (y + 0.5 * dt * k1y);
        let k2y = delta * (x + 0.5 * dt * k1x) * (y + 0.5 * dt * k1y) - gamma * (y + 0.5 * dt * k1y);

        let k3x = alpha * (x + 0.5 * dt * k2x) - beta * (x + 0.5 * dt * k2x) * (y + 0.5 * dt * k2y);
        let k3y = delta * (x + 0.5 * dt * k2x) * (y + 0.5 * dt * k2y) - gamma * (y + 0.5 * dt * k2y);

        let k4x = alpha * (x + dt * k3x) - beta * (x + dt * k3x) * (y + dt * k3y);
        let k4y = delta * (x + dt * k3x) * (y + dt * k3y) - gamma * (y + dt * k3y);

        x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
        y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);

        prey.push(x);
        predator.push(y);
        time.push(t);
    }
    return { time, prey, predator };
}

function plotGraph(event) {
    event.preventDefault(); 

    const x0 = parseFloat(document.getElementById('x0').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const alpha = parseFloat(document.getElementById('alpha').value);
    const beta = parseFloat(document.getElementById('beta').value);
    const gamma = parseFloat(document.getElementById('gamma').value);
    const delta = parseFloat(document.getElementById('delta').value);

    const result = lotkaVolterraRK4(x0, y0, alpha, beta, gamma, delta);

    const preyTrace = {
        x: result.time,
        y: result.prey,
        mode: 'lines',
        name: 'Prey Population',
        line: { color: 'blue' }
    };

    const predatorTrace = {
        x: result.time,
        y: result.predator,
        mode: 'lines',
        name: 'Predator Population',
        line: { color: 'red' }
    };

    const layout = {
        title: 'Lotka-Volterra Model: Predator-Prey Population Over Time',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Population' }
    };

    document.getElementById('graph').style.display = 'block';

    Plotly.newPlot('graph', [preyTrace, predatorTrace], layout);

    document.getElementById('slider-container').style.display = 'block';
    addSliderEventListeners();
}

function updateGraphFromSliders() {
    const x0 = parseFloat(document.getElementById('slider-x0').value);
    const y0 = parseFloat(document.getElementById('slider-y0').value);
    const alpha = parseFloat(document.getElementById('slider-alpha').value);
    const beta = parseFloat(document.getElementById('slider-beta').value);
    const gamma = parseFloat(document.getElementById('slider-gamma').value);
    const delta = parseFloat(document.getElementById('slider-delta').value);

    const result = lotkaVolterraRK4(x0, y0, alpha, beta, gamma, delta);

    const preyTrace = {
        x: result.time,
        y: result.prey,
        mode: 'lines',
        name: 'Prey',
        line: { color: 'blue' }
    };

    const predatorTrace = {
        x: result.time,
        y: result.predator,
        mode: 'lines',
        name: 'Predator',
        line: { color: 'red' }
    };

    const layout = {
        title: 'Lotka-Volterra Model: Predator-Prey Population Over Time',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Population' }
    };

    document.getElementById('graph').style.display = 'block';

    Plotly.react('graph', [preyTrace, predatorTrace], layout);
}

function addSliderEventListeners() {
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', () => {
            document.getElementById(slider.id + '-value').textContent = slider.value;
            updateGraphFromSliders();
        });
    });
}

document.getElementById('form').addEventListener('submit', plotGraph);

plotGraph();