class Particle {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} r 
     */
    constructor(x, y, r) {
        this.desiredPos = new Vector(x, y);
        this.pos = new Vector(x, y)
        this.vel = new Vector(0, 0);
        this.accel = new Vector(0, 0);
        this.r = r;
        this.mass = r * r / 100;
    }
    /**
     * @param {Vector} mouse 
     */
    updateAccel(mouse) {
        this.accel.reset();
        this.accel.addScaled(Vector.subtract(this.desiredPos, this.pos), 10);
        if (mouse) {
            const dmouse = Vector.subtract(mouse, this.pos);
            this.accel.addScaled(dmouse, -10000000000 / Math.max(square(dmouse.mag2), 0.00001) / this.mass);
        }
    }
    /** @param {number} dt */
    updateVel(dt) {
        this.vel.addScaled(this.accel, dt);
        if (this.vel.mag2 > 1000000) this.vel.scale(1000 / this.vel.mag);
        this.vel.scale(0.9);
    }
    /** @param {number} dt */
    updatePos(dt) {
        this.pos.addScaled(this.vel, dt)
    }
    /** @param {Particle} p */
    collide(p) {
        if (this === p) return;
        const d = Vector.subtract(p.pos, this.pos);
        const dv = Vector.subtract(p.vel, this.vel)
        if (d.mag2 > square(this.r + p.r)) return;
        const overlap = (this.r + p.r) - d.mag;
        const normalised = d.clone().norm(overlap / (this.mass + p.mass));
        this.pos.addScaled(normalised, -p.mass);
        p.pos.addScaled(normalised, this.mass);

        const coeff = 2 / (this.mass + p.mass) * dv.dot(d) / d.mag2;
        this.vel.addScaled(d, p.mass * coeff);
        p.vel.addScaled(d, -this.mass * coeff);
    }
}
class System {
    constructor() {
        /** @type {Particle[]} */
        this.particles = [];
    }
    /**
     * @param {number} dt 
     * @param {Vector} mouse 
     */
    update(dt, mouse) {
        this.particles.forEach(p => p.updateAccel(mouse));
        this.particles.forEach(p => p.updateVel(dt));
        this.particles.forEach(p => p.updatePos(dt));
        this.particles.forEach(p0 => this.particles.forEach(p1 => p0.collide(p1)));
    }
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} r 
     */
    addParticle(x, y, r) {
        this.particles.push(new Particle(x, y, r));
    }
}


class Vector {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /** @param {Vector} v */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    /**
     * @param {Vector} v 
     * @param {number} s 
     */
    addScaled(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
    }
    /** @param {number} n */
    scale(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }
    /** @param {number} n */
    norm(n = 1) {
        if (this.mag2 === 0) return (this.x = n, this.y = 0, this);
        return this.scale(n / this.mag);
    }
    /** @param {Vector} v */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    reset() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    get mag() {
        return Math.sqrt(this.mag2);
    }
    get mag2() {
        return square(this.x) + square(this.y);
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    /**
     * @param {Vector} a 
     * @param {Vector} b 
     */
    static subtract(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }
}
function square(x) { return x * x; }