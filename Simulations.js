const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const temperatureLabel = document.getElementById('temperature');

const numMolecules = 50;
const moleculeRadius = 10;
const moleculeMass = 6.646e-27; // Mass of a helium molecule in kg
const containerWidth = canvas.width;
const containerHeight = canvas.height;
const kB = 1.38e-23; // Boltzmann constant in J/K

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

    // Calculate kinetic energy of this molecule
    kineticEnergy() {
        return 0.5 * moleculeMass * (this.vx * this.vx + this.vy * this.vy);
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
    const vx = (Math.random() - 0.5) * 500;
    const vy = (Math.random() - 0.5) * 500;
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

                molecules[i].vx += fx
