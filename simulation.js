const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const numMolecules = 50;
const moleculeRadius = 10;
const moleculeMass = 1;
const containerWidth = canvas.width;
const containerHeight = canvas.height;

// Van der Waals constants (simplified)
const a = 1; // Attraction term
const b = 0.1; // Repulsion term

class Molecule {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    // Update position and apply basic physics
    updatePosition() {
        this.x += this.vx;
        this.y += this.vy;

        // Handle wall collisions
        if (this.x <= moleculeRadius || this.x >= containerWidth - moleculeRadius) {
            this.vx *= -1;
        }
        if (this.y <= moleculeRadius || this.y >= containerHeight - moleculeRadius) {
            this.vy *= -1;
        }
    }

    // Render the molecule
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, moleculeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }
}

// Initialize molecules with random positions and velocities
const molecules = [];
for (let i = 0; i < numMolecules; i++) {
    const x = Math.random() * (containerWidth - 2 * moleculeRadius) + moleculeRadius;
    const y = Math.random() * (containerHeight - 2 * moleculeRadius) + moleculeRadius;
    const vx = (Math.random() - 0.5) * 2;
    const vy = (Math.random() - 0.5) * 2;
    molecules.push(new Molecule(x, y, vx, vy));
}

// Calculate van der Waals forces and apply distortion
function applyVanDerWaalsForces() {
    for (let i = 0; i < numMolecules; i++) {
        for (let j = i + 1; j < numMolecules; j++) {
            const dx = molecules[j].x - molecules[i].x;
            const dy = molecules[j].y - molecules[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 2 * moleculeRadius && distance > 0) {
                // Apply van der Waals force (simplified model)
                const forceMagnitude = a / (distance * distance) - b / Math.pow(distance, 6);

                // Apply force to both molecules
                const fx = (forceMagnitude * dx) / distance;
                const fy = (forceMagnitude * dy) / distance;

                molecules[i].vx += fx / moleculeMass;
                molecules[i].vy += fy / moleculeMass;
                molecules[j].vx -= fx / moleculeMass;
                molecules[j].vy -= fy / moleculeMass;
            }
        }
    }
}

// Simulation loop
function simulationLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    applyVanDerWaalsForces();

    molecules.forEach(molecule => {
        molecule.updatePosition();
        molecule.draw();
    });

    requestAnimationFrame(simulationLoop);
}

// Start the simulation
simulationLoop();
