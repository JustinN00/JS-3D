const BACKGROUND = "#000000"
const FOREGROUND = "#50FF50"



console.log(game)
game.width = 800
game.height = 800
const ctx = game.getContext("2d")
console.log(ctx)

function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}


function point({x, y}){
    const size = 20
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - size/2, y - size/2, size, size)
}

function line(p1, p2) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}


function sortFaces(faces) {
    function maxZ(vi) {
        let maxZ = 0
        for (i of vi) {
            const calculated_z = translate_z(rotate_xy(rotate_xz(vs[i], angle), angle), dz).z
            if (calculated_z > maxZ){
                maxZ = calculated_z
            }
        }
        return maxZ
    }
    return faces.sort((a, b) => maxZ(b.vs) - maxZ(a.vs))
}


function face(ps, c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(ps[0].x, ps[0].y);
    for (let i = 1; i < ps.length; ++i) {
        ctx.lineTo(ps[i].x, ps[i].y);
    }
    ctx.lineTo(ps[0].x, ps[0].y);
    ctx.closePath();
    ctx.fill();
}

function screen(cords) {
    return {
        x: (cords.x + 1)/2*game.width,
        y: (1 - (cords.y + 1)/2)*game.height,
    }
}

function project({x, y, z}) {
    return {
        x: x/z,
        y: y/z,
    }
}



const FPS = 60
let dz = 1
let angle = 0

const vs = [
    {x:  0.25, y: -0.25, z:  0.25},
    {x:  0.25, y:  0.25, z:  0.25},
    {x: -0.25, y:  0.25, z:  0.25},
    {x: -0.25, y: -0.25, z:  0.25},

    {x:  0.25, y: -0.25, z: -0.25},
    {x:  0.25, y:  0.25, z: -0.25},
    {x: -0.25, y:  0.25, z: -0.25},
    {x: -0.25, y: -0.25, z: -0.25},
]

const ls = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

const fs = [
    {vs: [0, 1, 2, 3], c: "#921515ff"},
    {vs: [4, 5, 6, 7], c: "#58a146ff"},
    {vs: [1, 5, 4, 0], c: "#d4cb4cff"},
    {vs: [2, 3, 7, 6], c: "#209294ff"},
]

function translate_z({x, y, z}, dz) {
    return {x: x, y: y, z: z + dz};
}

function rotate_xz({x, y, z}, angle){
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c-z*s,
        y,
        z: x*s+z*c,
    }
}

function rotate_xy({x, y, z}, angle){
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c-y*s,
        y: x*s+y*c,
        z: z,
    }
}

function frame() {
    const dt = 1/FPS;
    // dz += 1*dt
    angle += Math.PI*dt
    clear()

    //Vertices
    // for (const v of vs) {
    //     point(screen(project(translate_z(rotate_xy(rotate_xz(v, angle), angle), dz))))
    // }



    //Wireframe
    for (const l of ls) {
        for (let i = 0; i < l.length; ++i) {
            const a = vs[l[i]]
            const b = vs[l[(i + 1)%l.length]]
            line(
                screen(project(translate_z(rotate_xy(rotate_xz(a, angle), angle), dz))),
                screen(project(translate_z(rotate_xy(rotate_xz(b, angle), angle), dz))),
            )
        }
    }
    
    //Faces
    sfs = sortFaces(fs)
    for (const f of sfs) {
        fz = []
        for (i of f.vs){
            fz.push(
                screen(project(translate_z(rotate_xy(rotate_xz(vs[i], angle), angle), dz))),
            )

        }
        face(fz, f.c)

    }
    setTimeout(frame, 1000/FPS);
}
setTimeout(frame, 1000/FPS);