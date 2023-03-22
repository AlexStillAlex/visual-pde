// simulation_shaders.js

export function RDShaderTop() {
    return `precision highp float;
    varying vec2 textureCoords;
    uniform sampler2D textureSource;
    uniform float dt;
    uniform float dx;
    uniform float dy;
    uniform float L;
    uniform float t;
    uniform vec2 boundaryValues;
    uniform sampler2D imageSource;
    const float pi = 3.141592653589793;

    float H(float val, float edge) 
    {
        float res = smoothstep(-0.01, 0.01, val - edge);
        return res;
    }

    float safepow(float x, float y) {
        if (x >= 0.0) {
            return pow(x,y);
        }
        if (mod(round(y),2.0) == 0.0) {
            return pow(-x,y);
        }
        return -pow(-x,y);
    }

    void main()
    {
        ivec2 texSize = textureSize(textureSource,0);
        float step_x = 1.0 / float(texSize.x);
        float step_y = 1.0 / float(texSize.y);
        float x = textureCoords.x * float(texSize.x) * dx;
        float y = textureCoords.y * float(texSize.y) * dy;

        vec3 uvw = texture2D(textureSource, textureCoords).rgb;
        vec3 uvwL = texture2D(textureSource, textureCoords + vec2(-step_x, 0.0)).rgb;
        vec3 uvwR = texture2D(textureSource, textureCoords + vec2(+step_x, 0.0)).rgb;
        vec3 uvwT = texture2D(textureSource, textureCoords + vec2(0.0, +step_y)).rgb;
        vec3 uvwB = texture2D(textureSource, textureCoords + vec2(0.0, -step_y)).rgb;

        vec3 Tvec = texture2D(imageSource, textureCoords).rgb;
        float T = (Tvec.x + Tvec.y + Tvec.z) / 3.0;
    `;
}

export function RDShaderPeriodic() {
    return ``;
}

export function RDShaderRobinX() {
    return `
    if (textureCoords.x - step_x < 0.0) {
        uvwL.SPECIES = uvwR.SPECIES - dx * robinRHSSPECIES;
    }
    if (textureCoords.x + step_x > 1.0) {
        uvwR.SPECIES = uvwL.SPECIES + dx * robinRHSSPECIES;
    }
    `;
}

export function RDShaderRobinY() {
    return `
    if (textureCoords.y + step_y > 1.0){
        uvwT.SPECIES = uvwB.SPECIES + dy * robinRHSSPECIES;
    }
    if (textureCoords.y - step_y < 0.0) {
        uvwB.SPECIES = uvwT.SPECIES - dy * robinRHSSPECIES;
    }
    `;
}

export function RDShaderUpdateNormal() {
    return `
    float LDuuU = 0.5*(Duu*(uvwR.r + uvwL.r - 2.0*uvw.r) + DuuR*(uvwR.r - uvw.r) + DuuL*(uvwL.r - uvw.r)) / dx / dx +  0.5*(Duu*(uvwT.r + uvwB.r - 2.0*uvw.r) + DuuT*(uvwT.r - uvw.r) + DuuB*(uvwB.r - uvw.r)) / dy / dy;
    float LDvvV = 0.5*(Dvv*(uvwR.g + uvwL.g - 2.0*uvw.g) + DvvR*(uvwR.g - uvw.g) + DvvL*(uvwL.g - uvw.g)) / dx / dx +  0.5*(Dvv*(uvwT.g + uvwB.g - 2.0*uvw.g) + DvvT*(uvwT.g - uvw.g) + DvvB*(uvwB.g - uvw.g)) / dy / dy;
    float LDwwW = 0.5*(Dww*(uvwR.b + uvwL.b - 2.0*uvw.b) + DwwR*(uvwR.b - uvw.b) + DwwL*(uvwL.b - uvw.b)) / dx / dx +  0.5*(Dww*(uvwT.b + uvwB.b - 2.0*uvw.b) + DwwT*(uvwT.b - uvw.b) + DwwB*(uvwB.b - uvw.b)) / dy / dy;

    float du = LDuuU + f;
    float dv = LDvvV + g;
    float dw = LDwwW + h;
    vec3 updated = uvw + dt * vec3(du, dv, dw);
    `;
}

export function RDShaderUpdateCross() {
    return `
    float LDuuU = 0.5*(Duu*(uvwR.r + uvwL.r - 2.0*uvw.r) + DuuR*(uvwR.r - uvw.r) + DuuL*(uvwL.r - uvw.r)) / dx / dx +  0.5*(Duu*(uvwT.r + uvwB.r - 2.0*uvw.r) + DuuT*(uvwT.r - uvw.r) + DuuB*(uvwB.r - uvw.r)) / dy / dy;
    float LDuvV = 0.5*(Duv*(uvwR.g + uvwL.g - 2.0*uvw.g) + DuvR*(uvwR.g - uvw.g) + DuvL*(uvwL.g - uvw.g)) / dx / dx +  0.5*(Duv*(uvwT.g + uvwB.g - 2.0*uvw.g) + DuvT*(uvwT.g - uvw.g) + DuvB*(uvwB.g - uvw.g)) / dy / dy;
    float LDuwW = 0.5*(Duw*(uvwR.b + uvwL.b - 2.0*uvw.b) + DuwR*(uvwR.b - uvw.b) + DuwL*(uvwL.b - uvw.b)) / dx / dx +  0.5*(Duw*(uvwT.b + uvwB.b - 2.0*uvw.b) + DuwT*(uvwT.b - uvw.b) + DuwB*(uvwB.b - uvw.b)) / dy / dy;
    float LDvuU = 0.5*(Dvu*(uvwR.r + uvwL.r - 2.0*uvw.r) + DvuR*(uvwR.r - uvw.r) + DvuL*(uvwL.r - uvw.r)) / dx / dx +  0.5*(Dvu*(uvwT.r + uvwB.r - 2.0*uvw.r) + DvuT*(uvwT.r - uvw.r) + DvuB*(uvwB.r - uvw.r)) / dy / dy;
    float LDvvV = 0.5*(Dvv*(uvwR.g + uvwL.g - 2.0*uvw.g) + DvvR*(uvwR.g - uvw.g) + DvvL*(uvwL.g - uvw.g)) / dx / dx +  0.5*(Dvv*(uvwT.g + uvwB.g - 2.0*uvw.g) + DvvT*(uvwT.g - uvw.g) + DvvB*(uvwB.g - uvw.g)) / dy / dy;
    float LDvwW = 0.5*(Dvw*(uvwR.b + uvwL.b - 2.0*uvw.b) + DvwR*(uvwR.b - uvw.b) + DvwL*(uvwL.b - uvw.b)) / dx / dx +  0.5*(Dvw*(uvwT.b + uvwB.b - 2.0*uvw.b) + DvwT*(uvwT.b - uvw.b) + DvwB*(uvwB.b - uvw.b)) / dy / dy;
    float LDwuU = 0.5*(Dwu*(uvwR.r + uvwL.r - 2.0*uvw.r) + DwuR*(uvwR.r - uvw.r) + DwuL*(uvwL.r - uvw.r)) / dx / dx +  0.5*(Dwu*(uvwT.r + uvwB.r - 2.0*uvw.r) + DwuT*(uvwT.r - uvw.r) + DwuB*(uvwB.r - uvw.r)) / dy / dy;
    float LDwvV = 0.5*(Dwv*(uvwR.g + uvwL.g - 2.0*uvw.g) + DwvR*(uvwR.g - uvw.g) + DwvL*(uvwL.g - uvw.g)) / dx / dx +  0.5*(Dwv*(uvwT.g + uvwB.g - 2.0*uvw.g) + DwvT*(uvwT.g - uvw.g) + DwvB*(uvwB.g - uvw.g)) / dy / dy;
    float LDwwW = 0.5*(Dww*(uvwR.b + uvwL.b - 2.0*uvw.b) + DwwR*(uvwR.b - uvw.b) + DwwL*(uvwL.b - uvw.b)) / dx / dx +  0.5*(Dww*(uvwT.b + uvwB.b - 2.0*uvw.b) + DwwT*(uvwT.b - uvw.b) + DwwB*(uvwB.b - uvw.b)) / dy / dy;

    float du = LDuuU + LDuvV + LDuwW + f;
    float dv = LDvuU + LDvvV + LDvwW + g;
    float dw = LDwuU + LDwvV + LDwwW + h;
    vec3 updated = uvw + dt * vec3(du, dv, dw);
    `;
}

export function RDShaderAlgebraicV() {
    return `
    updated.SPECIES = LDvuU + g;`;
}

export function RDShaderAlgebraicW() {
    return `
    updated.SPECIES = LDwuU + LDwvV + h;`;
}

export function RDShaderDirichletX() {
    return `
    if ((textureCoords.x - step_x < 0.0) || (textureCoords.x + step_x > 1.0)) {
        updated.SPECIES = `;
}

export function RDShaderDirichletY() {
    return `
    if ((textureCoords.y + step_y > 1.0) || (textureCoords.y - step_y < 0.0)) {
        updated.SPECIES = `;
}

export function RDShaderDirichletIndicatorFun() {
    return `
    if (float(indicatorFun) <= 0.0) {
        updated.SPECIES = `;
}

export function RDShaderBot() {
    return ` 
    gl_FragColor = vec4(updated.r, updated.g, updated.b, 1.0);
}`;
}