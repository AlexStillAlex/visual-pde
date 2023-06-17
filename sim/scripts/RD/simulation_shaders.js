// simulation_shaders.js

export function RDShaderTop(type) {
  let numInputs = 0;
  switch (type) {
    case "FE":
      numInputs = 2;
      break;
    case "AB2":
      numInputs = 2;
      break;
    case "Mid1":
      numInputs = 1;
      break;
    case "Mid2":
      numInputs = 2;
      break;
    case "RK41":
      numInputs = 1;
      break;
    case "RK42":
      numInputs = 2;
      break;
    case "RK43":
      numInputs = 3;
      break;
    case "RK44":
      numInputs = 4;
      break;
  }
  let parts = [];
  parts[0] = "precision highp float; varying vec2 textureCoords;";
  parts[1] = "uniform sampler2D textureSource;";
  parts[2] = "uniform sampler2D textureSource1;";
  parts[3] = "uniform sampler2D textureSource2;";
  parts[4] = "uniform sampler2D textureSource3;";
  return (
    parts.slice(0, numInputs + 1).join("\n") +
    `
    uniform float dt;
    uniform float dx;
    uniform float dy;
    uniform float L;
    uniform float L_x;
    uniform float L_y;
    uniform float L_min;
    uniform float t;
    uniform sampler2D imageSourceOne;
    uniform sampler2D imageSourceTwo;
    const float pi = 3.141592653589793;

    float H(float val) 
    {
        float res = smoothstep(-0.01, 0.01, val);
        return res;
    }

    float H(float val, float edge) 
    {
        float res = smoothstep(-0.01, 0.01, val - edge);
        return res;
    }

    float safetanh(float val)
    {
        return 1.0 - 2.0/(1.0+exp(2.0*val));
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

    vec4 computeRHS(sampler2D textureSource, vec4 uvwqIn, vec4 uvwqLIn, vec4 uvwqRIn, vec4 uvwqTIn, vec4 uvwqBIn) {

        ivec2 texSize = textureSize(textureSource,0);
        float step_x = 1.0 / float(texSize.x);
        float step_y = 1.0 / float(texSize.y);
        float x = textureCoords.x * float(texSize.x) * dx;
        float y = textureCoords.y * float(texSize.y) * dy;
        vec2 textureCoordsL = textureCoords + vec2(-step_x, 0.0);
        vec2 textureCoordsR = textureCoords + vec2(+step_x, 0.0);
        vec2 textureCoordsT = textureCoords + vec2(0.0, +step_y);
        vec2 textureCoordsB = textureCoords + vec2(0.0, -step_y);

        vec4 Svec = texture2D(imageSourceOne, textureCoords);
        float I_S = (Svec.x + Svec.y + Svec.z) / 3.0;
        float I_SR = Svec.r;
        float I_SG = Svec.g;
        float I_SB = Svec.b;
        float I_SA = Svec.a;
        vec4 Tvec = texture2D(imageSourceTwo, textureCoords);
        float I_T = (Tvec.x + Tvec.y + Tvec.z) / 3.0;
        float I_TR = Tvec.r;
        float I_TG = Tvec.g;
        float I_TB = Tvec.b;
        float I_TA = Tvec.a;

        vec4 uvwq = uvwqIn;
        vec4 uvwqL = uvwqLIn;
        vec4 uvwqR = uvwqRIn;
        vec4 uvwqT = uvwqTIn;
        vec4 uvwqB = uvwqBIn;
    `
  );
}

export function RDShaderMain(type) {
  let update = {};
  update.FE = `uvwq = texture2D(textureSource, textureCoords);
    uvwqL = texture2D(textureSource, textureCoordsL);
    uvwqR = texture2D(textureSource, textureCoordsR);
    uvwqT = texture2D(textureSource, textureCoordsT);
    uvwqB = texture2D(textureSource, textureCoordsB);
    RHS = computeRHS(textureSource, uvwq, uvwqL, uvwqR, uvwqT, uvwqB);
    updated = texture2D(textureSource, textureCoords) + dt * RHS;`;
  update.AB2 = `uvwq = texture2D(textureSource, textureCoords);
    uvwqL = texture2D(textureSource, textureCoordsL);
    uvwqR = texture2D(textureSource, textureCoordsR);
    uvwqT = texture2D(textureSource, textureCoordsT);
    uvwqB = texture2D(textureSource, textureCoordsB);
    RHS1 = computeRHS(textureSource, uvwq, uvwqL, uvwqR, uvwqT, uvwqB);
    uvwq = texture2D(textureSource1, textureCoords);
    uvwqL = texture2D(textureSource1, textureCoordsL);
    uvwqR = texture2D(textureSource1, textureCoordsR);
    uvwqT = texture2D(textureSource1, textureCoordsT);
    uvwqB = texture2D(textureSource1, textureCoordsB);
    RHS2 = computeRHS(textureSource1, uvwq, uvwqL, uvwqR, uvwqT, uvwqB);
    RHS = 1.5 * RHS1 - 0.5 * RHS2;
    updated = texture2D(textureSource, textureCoords) + dt * RHS;`;
  update.Mid1 = `uvwq = texture2D(textureSource, textureCoords);
    uvwqL = texture2D(textureSource, textureCoordsL);
    uvwqR = texture2D(textureSource, textureCoordsR);
    uvwqT = texture2D(textureSource, textureCoordsT);
    uvwqB = texture2D(textureSource, textureCoordsB);
    RHS = computeRHS(textureSource, uvwq, uvwqL, uvwqR, uvwqT, uvwqB);
    updated = RHS`;
  update.Mid2 = `uvwqLast = texture2D(textureSource, textureCoords);
    uvwq = uvwqLast + 0.5*dt*texture2D(textureSource1, textureCoords);
    uvwqL = texture2D(textureSource, textureCoordsL) + 0.5*dt*texture2D(textureSource1, textureCoordsL);
    uvwqR = texture2D(textureSource, textureCoordsR) + 0.5*dt*texture2D(textureSource1, textureCoordsR);
    uvwqT = texture2D(textureSource, textureCoordsT) + 0.5*dt*texture2D(textureSource1, textureCoordsT);
    uvwqB = texture2D(textureSource, textureCoordsB) + 0.5*dt*texture2D(textureSource1, textureCoordsB);
    RHS = computeRHS(textureSource, uvwq, uvwqL, uvwqR, uvwqT, uvwqB);
    updated = uvwqLast + dt * RHS;`;
  update.RK41 = `uvwq = texture2D(textureSource, textureCoords);
    uvwqL = texture2D(textureSource, textureCoordsL);
    uvwqR = texture2D(textureSource, textureCoordsR);
    uvwqT = texture2D(textureSource, textureCoordsT);
    uvwqB = texture2D(textureSource, textureCoordsB);
    RHS = computeRHS(textureSource, uvwq, uvwqL, uvwqR, uvwqT, uvwqB);
    updated = RHS;`;
  update.RK42 = `uvwq = texture2D(textureSource, textureCoords) + 0.5*dt*texture2D(textureSource1, textureCoords);
    uvwqL = texture2D(textureSource, textureCoordsL) + 0.5*dt*texture2D(textureSource1, textureCoordsL);
    uvwqR = texture2D(textureSource, textureCoordsR) + 0.5*dt*texture2D(textureSource1, textureCoordsR);
    uvwqT = texture2D(textureSource, textureCoordsT) + 0.5*dt*texture2D(textureSource1, textureCoordsT);
    uvwqB = texture2D(textureSource, textureCoordsB) + 0.5*dt*texture2D(textureSource1, textureCoordsB);
    RHS = computeRHS(textureSource, uvwq, uvwqL, uvwqR, uvwqT, uvwqB);
    updated = RHS;`;
  update.RK43 = `uvwq = texture2D(textureSource, textureCoords) + 0.5*dt*texture2D(textureSource2, textureCoords);
    uvwqL = texture2D(textureSource, textureCoordsL) + 0.5*dt*texture2D(textureSource2, textureCoordsL);
    uvwqR = texture2D(textureSource, textureCoordsR) + 0.5*dt*texture2D(textureSource2, textureCoordsR);
    uvwqT = texture2D(textureSource, textureCoordsT) + 0.5*dt*texture2D(textureSource2, textureCoordsT);
    uvwqB = texture2D(textureSource, textureCoordsB) + 0.5*dt*texture2D(textureSource2, textureCoordsB);
    RHS = computeRHS(textureSource, uvwq, uvwqL, uvwqR, uvwqT, uvwqB);
    updated = RHS;`;
  update.RK44 = `uvwqLast = texture2D(textureSource, textureCoords);
    uvwq = uvwqLast + dt*texture2D(textureSource3, textureCoords);
    uvwqL = texture2D(textureSource, textureCoordsL) + dt*texture2D(textureSource3, textureCoordsL);
    uvwqR = texture2D(textureSource, textureCoordsR) + dt*texture2D(textureSource3, textureCoordsR);
    uvwqT = texture2D(textureSource, textureCoordsT) + dt*texture2D(textureSource3, textureCoordsT);
    uvwqB = texture2D(textureSource, textureCoordsB) + dt*texture2D(textureSource3, textureCoordsB);
    RHS1 = computeRHS(textureSource, uvwq, uvwqL, uvwqR, uvwqT, uvwqB);
    RHS = (texture2D(textureSource1, textureCoords) + 2.0*(texture2D(textureSource2, textureCoords) + texture2D(textureSource3, textureCoords)) + RHS1) / 6.0;
    updated = uvwqLast + dt * RHS;`;
  return (
    `
  void main()
  {
      ivec2 texSize = textureSize(textureSource,0);
      float step_x = 1.0 / float(texSize.x);
      float step_y = 1.0 / float(texSize.y);
      float x = textureCoords.x * float(texSize.x) * dx;
      float y = textureCoords.y * float(texSize.y) * dy;
      vec4 Svec = texture2D(imageSourceOne, textureCoords);
      float I_S = (Svec.x + Svec.y + Svec.z) / 3.0;
      float I_SR = Svec.r;
      float I_SG = Svec.g;
      float I_SB = Svec.b;
      float I_SA = Svec.a;
      vec4 Tvec = texture2D(imageSourceTwo, textureCoords);
      float I_T = (Tvec.x + Tvec.y + Tvec.z) / 3.0;
      float I_TR = Tvec.r;
      float I_TG = Tvec.g;
      float I_TB = Tvec.b;
      float I_TA = Tvec.a;

      vec2 textureCoordsL = textureCoords + vec2(-step_x, 0.0);
      vec2 textureCoordsR = textureCoords + vec2(+step_x, 0.0);
      vec2 textureCoordsT = textureCoords + vec2(0.0, +step_y);
      vec2 textureCoordsB = textureCoords + vec2(0.0, -step_y);

      vec4 RHS;
      vec4 RHS1;
      vec4 RHS2;
      vec4 updated;
      vec4 uvwq;
      vec4 uvwqL;
      vec4 uvwqR;
      vec4 uvwqT;
      vec4 uvwqB;
      vec4 uvwqLast;
  ` + update[type]
  );
}

export function RDShaderPeriodic() {
  return ``;
}

export function RDShaderGhostX(LR) {
  const L = `
    if (textureCoords.x - step_x < 0.0) {
        uvwqL.SPECIES = GHOSTSPECIES;
    }
    `;
  const R = `
    if (textureCoords.x + step_x > 1.0) {
        uvwqR.SPECIES = GHOSTSPECIES;
    }
    `;
  if (LR == undefined) return L + R;
  if (LR == "L") return L;
  if (LR == "R") return R;
  return "";
}

export function RDShaderGhostY(TB) {
  const T = `
    if (textureCoords.y + step_y > 1.0){
        uvwqT.SPECIES = GHOSTSPECIES;
    }
    `;
  const B = `
    if (textureCoords.y - step_y < 0.0) {
        uvwqB.SPECIES = GHOSTSPECIES;
    }
    `;
  if (TB == undefined) return T + B;
  if (TB == "T") return T;
  if (TB == "B") return B;
  return "";
}

export function RDShaderRobinX(LR) {
  const L = `
    if (textureCoords.x - step_x < 0.0) {
        uvwqL.SPECIES = uvwqR.SPECIES + 2.0 * dx * robinRHSSPECIESL;
    }
    `;
  const R = `
    if (textureCoords.x + step_x > 1.0) {
        uvwqR.SPECIES = uvwqL.SPECIES + 2.0 * dx * robinRHSSPECIESR;
    }
    `;
  if (LR == undefined) return L + R;
  if (LR == "L") return L;
  if (LR == "R") return R;
  return "";
}

export function RDShaderRobinY(TB) {
  const T = `
    if (textureCoords.y + step_y > 1.0){
        uvwqT.SPECIES = uvwqB.SPECIES + 2.0 * dy * robinRHSSPECIEST;
    }
    `;
  const B = `
    if (textureCoords.y - step_y < 0.0) {
        uvwqB.SPECIES = uvwqT.SPECIES + 2.0 * dy * robinRHSSPECIESB;
    }
    `;
  if (TB == undefined) return T + B;
  if (TB == "T") return T;
  if (TB == "B") return B;
  return "";
}

export function RDShaderAdvectionPreBC() {
  return `
    vec4 uvwqX = (uvwqR - uvwqL) / (2.0*dx);
    vec4 uvwqY = (uvwqT - uvwqB) / (2.0*dy);
    `;
}

export function RDShaderAdvectionPostBC() {
  return `
    uvwqX = (uvwqR - uvwqL) / (2.0*dx);
    uvwqY = (uvwqT - uvwqB) / (2.0*dy);
    `;
}

export function RDShaderDiffusionPreBC() {
  return `
    vec4 uvwqXX = (uvwqR - 2.0*uvwq + uvwqL) / (dx*dx);
    vec4 uvwqYY = (uvwqT - 2.0*uvwq + uvwqB) / (dy*dy);
    `;
}

export function RDShaderDiffusionPostBC() {
  return `
    uvwqXX = (uvwqR - 2.0*uvwq + uvwqL) / (dx*dx);
    uvwqYY = (uvwqT - 2.0*uvwq + uvwqB) / (dy*dy);
    `;
}

export function RDShaderUpdateNormal() {
  return `
    float LDuuU = 0.5*((Duu*(uvwqR.r + uvwqL.r - 2.0*uvwq.r) + DuuR*(uvwqR.r - uvwq.r) + DuuL*(uvwqL.r - uvwq.r)) / dx) / dx +  0.5*((Duu*(uvwqT.r + uvwqB.r - 2.0*uvwq.r) + DuuT*(uvwqT.r - uvwq.r) + DuuB*(uvwqB.r - uvwq.r)) / dy) / dy;
    float LDvvV = 0.5*((Dvv*(uvwqR.g + uvwqL.g - 2.0*uvwq.g) + DvvR*(uvwqR.g - uvwq.g) + DvvL*(uvwqL.g - uvwq.g)) / dx) / dx +  0.5*((Dvv*(uvwqT.g + uvwqB.g - 2.0*uvwq.g) + DvvT*(uvwqT.g - uvwq.g) + DvvB*(uvwqB.g - uvwq.g)) / dy) / dy;
    float LDwwW = 0.5*((Dww*(uvwqR.b + uvwqL.b - 2.0*uvwq.b) + DwwR*(uvwqR.b - uvwq.b) + DwwL*(uvwqL.b - uvwq.b)) / dx) / dx +  0.5*((Dww*(uvwqT.b + uvwqB.b - 2.0*uvwq.b) + DwwT*(uvwqT.b - uvwq.b) + DwwB*(uvwqB.b - uvwq.b)) / dy) / dy;
    float LDqqQ = 0.5*((Dqq*(uvwqR.a + uvwqL.a - 2.0*uvwq.a) + DqqR*(uvwqR.a - uvwq.a) + DqqL*(uvwqL.a - uvwq.a)) / dx) / dx +  0.5*((Dqq*(uvwqT.a + uvwqB.a - 2.0*uvwq.a) + DqqT*(uvwqT.a - uvwq.a) + DqqB*(uvwqB.a - uvwq.a)) / dy) / dy;

    float du = LDuuU + UFUN;
    float dv = LDvvV + VFUN;
    float dw = LDwwW + WFUN;
    float dq = LDqqQ + QFUN;
    return vec4(du, dv, dw, dq);
  }`;
}

export function RDShaderUpdateCross() {
  return `
    float LDuuU = 0.5*((Duu*(uvwqR.r + uvwqL.r - 2.0*uvwq.r) + DuuR*(uvwqR.r - uvwq.r) + DuuL*(uvwqL.r - uvwq.r)) / dx) / dx +  0.5*((Duu*(uvwqT.r + uvwqB.r - 2.0*uvwq.r) + DuuT*(uvwqT.r - uvwq.r) + DuuB*(uvwqB.r - uvwq.r)) / dy) / dy;
    float LDuvV = 0.5*((Duv*(uvwqR.g + uvwqL.g - 2.0*uvwq.g) + DuvR*(uvwqR.g - uvwq.g) + DuvL*(uvwqL.g - uvwq.g)) / dx) / dx +  0.5*((Duv*(uvwqT.g + uvwqB.g - 2.0*uvwq.g) + DuvT*(uvwqT.g - uvwq.g) + DuvB*(uvwqB.g - uvwq.g)) / dy) / dy;
    float LDuwW = 0.5*((Duw*(uvwqR.b + uvwqL.b - 2.0*uvwq.b) + DuwR*(uvwqR.b - uvwq.b) + DuwL*(uvwqL.b - uvwq.b)) / dx) / dx +  0.5*((Duw*(uvwqT.b + uvwqB.b - 2.0*uvwq.b) + DuwT*(uvwqT.b - uvwq.b) + DuwB*(uvwqB.b - uvwq.b)) / dy) / dy;
    float LDuqQ = 0.5*((Duq*(uvwqR.a + uvwqL.a - 2.0*uvwq.a) + DuqR*(uvwqR.a - uvwq.a) + DuqL*(uvwqL.a - uvwq.a)) / dx) / dx +  0.5*((Duq*(uvwqT.a + uvwqB.a - 2.0*uvwq.a) + DuqT*(uvwqT.a - uvwq.a) + DuqB*(uvwqB.a - uvwq.a)) / dy) / dy;
    float LDvuU = 0.5*((Dvu*(uvwqR.r + uvwqL.r - 2.0*uvwq.r) + DvuR*(uvwqR.r - uvwq.r) + DvuL*(uvwqL.r - uvwq.r)) / dx) / dx +  0.5*((Dvu*(uvwqT.r + uvwqB.r - 2.0*uvwq.r) + DvuT*(uvwqT.r - uvwq.r) + DvuB*(uvwqB.r - uvwq.r)) / dy) / dy;
    float LDvvV = 0.5*((Dvv*(uvwqR.g + uvwqL.g - 2.0*uvwq.g) + DvvR*(uvwqR.g - uvwq.g) + DvvL*(uvwqL.g - uvwq.g)) / dx) / dx +  0.5*((Dvv*(uvwqT.g + uvwqB.g - 2.0*uvwq.g) + DvvT*(uvwqT.g - uvwq.g) + DvvB*(uvwqB.g - uvwq.g)) / dy) / dy;
    float LDvwW = 0.5*((Dvw*(uvwqR.b + uvwqL.b - 2.0*uvwq.b) + DvwR*(uvwqR.b - uvwq.b) + DvwL*(uvwqL.b - uvwq.b)) / dx) / dx +  0.5*((Dvw*(uvwqT.b + uvwqB.b - 2.0*uvwq.b) + DvwT*(uvwqT.b - uvwq.b) + DvwB*(uvwqB.b - uvwq.b)) / dy) / dy;
    float LDvqQ = 0.5*((Dvq*(uvwqR.a + uvwqL.a - 2.0*uvwq.a) + DvqR*(uvwqR.a - uvwq.a) + DvqL*(uvwqL.a - uvwq.a)) / dx) / dx +  0.5*((Dvq*(uvwqT.a + uvwqB.a - 2.0*uvwq.a) + DvqT*(uvwqT.a - uvwq.a) + DvqB*(uvwqB.a - uvwq.a)) / dy) / dy;
    float LDwuU = 0.5*((Dwu*(uvwqR.r + uvwqL.r - 2.0*uvwq.r) + DwuR*(uvwqR.r - uvwq.r) + DwuL*(uvwqL.r - uvwq.r)) / dx) / dx +  0.5*((Dwu*(uvwqT.r + uvwqB.r - 2.0*uvwq.r) + DwuT*(uvwqT.r - uvwq.r) + DwuB*(uvwqB.r - uvwq.r)) / dy) / dy;
    float LDwvV = 0.5*((Dwv*(uvwqR.g + uvwqL.g - 2.0*uvwq.g) + DwvR*(uvwqR.g - uvwq.g) + DwvL*(uvwqL.g - uvwq.g)) / dx) / dx +  0.5*((Dwv*(uvwqT.g + uvwqB.g - 2.0*uvwq.g) + DwvT*(uvwqT.g - uvwq.g) + DwvB*(uvwqB.g - uvwq.g)) / dy) / dy;
    float LDwwW = 0.5*((Dww*(uvwqR.b + uvwqL.b - 2.0*uvwq.b) + DwwR*(uvwqR.b - uvwq.b) + DwwL*(uvwqL.b - uvwq.b)) / dx) / dx +  0.5*((Dww*(uvwqT.b + uvwqB.b - 2.0*uvwq.b) + DwwT*(uvwqT.b - uvwq.b) + DwwB*(uvwqB.b - uvwq.b)) / dy) / dy;
    float LDwqQ = 0.5*((Dwq*(uvwqR.a + uvwqL.a - 2.0*uvwq.a) + DwqR*(uvwqR.a - uvwq.a) + DwqL*(uvwqL.a - uvwq.a)) / dx) / dx +  0.5*((Dwq*(uvwqT.a + uvwqB.a - 2.0*uvwq.a) + DwqT*(uvwqT.a - uvwq.a) + DwqB*(uvwqB.a - uvwq.a)) / dy) / dy;
    float LDquU = 0.5*((Dqu*(uvwqR.r + uvwqL.r - 2.0*uvwq.r) + DquR*(uvwqR.r - uvwq.r) + DquL*(uvwqL.r - uvwq.r)) / dx) / dx +  0.5*((Dqu*(uvwqT.r + uvwqB.r - 2.0*uvwq.r) + DquT*(uvwqT.r - uvwq.r) + DquB*(uvwqB.r - uvwq.r)) / dy) / dy;
    float LDqvV = 0.5*((Dqv*(uvwqR.g + uvwqL.g - 2.0*uvwq.g) + DqvR*(uvwqR.g - uvwq.g) + DqvL*(uvwqL.g - uvwq.g)) / dx) / dx +  0.5*((Dqv*(uvwqT.g + uvwqB.g - 2.0*uvwq.g) + DqvT*(uvwqT.g - uvwq.g) + DqvB*(uvwqB.g - uvwq.g)) / dy) / dy;
    float LDqwW = 0.5*((Dqw*(uvwqR.b + uvwqL.b - 2.0*uvwq.b) + DqwR*(uvwqR.b - uvwq.b) + DqwL*(uvwqL.b - uvwq.b)) / dx) / dx +  0.5*((Dqw*(uvwqT.b + uvwqB.b - 2.0*uvwq.b) + DqwT*(uvwqT.b - uvwq.b) + DqwB*(uvwqB.b - uvwq.b)) / dy) / dy;
    float LDqqQ = 0.5*((Dqq*(uvwqR.a + uvwqL.a - 2.0*uvwq.a) + DqqR*(uvwqR.a - uvwq.a) + DqqL*(uvwqL.a - uvwq.a)) / dx) / dx +  0.5*((Dqq*(uvwqT.a + uvwqB.a - 2.0*uvwq.a) + DqqT*(uvwqT.a - uvwq.a) + DqqB*(uvwqB.a - uvwq.a)) / dy) / dy;

    float du = LDuuU + LDuvV + LDuwW + LDuqQ + UFUN;
    float dv = LDvuU + LDvvV + LDvwW + LDvqQ + VFUN;
    float dw = LDwuU + LDwvV + LDwwW + LDwqQ + WFUN;
    float dq = LDquU + LDqvV + LDqwW + LDqqQ + QFUN;
    return vec4(du, dv, dw, dq);
  }
    `;
}

export function RDShaderAlgebraicSpecies() {
  return `
    updated.SPECIES = RHS.SPECIES;
    `;
}

export function RDShaderAlgebraicV() {
  return `
    updated.SPECIES = LDvuU + VFUN;`;
}

export function RDShaderAlgebraicW() {
  return `
    updated.SPECIES = LDwuU + LDwvV + WFUN;`;
}

export function RDShaderAlgebraicQ() {
  return `
    updated.SPECIES = LDquU + LDqvV + LDqwW + QFUN;`;
}

export function RDShaderDirichletX(LR) {
  const L = `
    if (textureCoords.x - step_x < 0.0) {
        updated.SPECIES = dirichletRHSSPECIESL;
    }
    `;
  const R = `
    if (textureCoords.x + step_x > 1.0) {
        updated.SPECIES = dirichletRHSSPECIESR;
    }
    `;
  if (LR == undefined) return L + R;
  if (LR == "L") return L;
  if (LR == "R") return R;
  return "";
}

export function RDShaderDirichletY(TB) {
  const T = `
    if (textureCoords.y + step_y > 1.0) {
        updated.SPECIES = dirichletRHSSPECIEST;
    }
    `;
  const B = `
    if (textureCoords.y - step_y < 0.0) {
        updated.SPECIES = dirichletRHSSPECIESB;
    }
    `;
  if (TB == undefined) return T + B;
  if (TB == "T") return T;
  if (TB == "B") return B;
  return "";
}

export function RDShaderDirichletIndicatorFun() {
  return `
    if (float(indicatorFun) <= 0.0) {
        updated.SPECIES = `;
}

export function RDShaderBot() {
  return ` 
    gl_FragColor = updated;
}`;
}

export function RDShaderEnforceDirichletTop() {
  return `precision highp float;
    varying vec2 textureCoords;
    uniform sampler2D textureSource;
    uniform float dx;
    uniform float dy;
    uniform float L;
    uniform float L_x;
    uniform float L_y;
    uniform float L_min;
    uniform float t;
    uniform sampler2D imageSourceOne;
    uniform sampler2D imageSourceTwo;
    const float pi = 3.141592653589793;

    float H(float val) 
    {
        float res = smoothstep(-0.01, 0.01, val);
        return res;
    }

    float H(float val, float edge) 
    {
        float res = smoothstep(-0.01, 0.01, val - edge);
        return res;
    }

    float safetanh(float val)
    {
        return 1.0 - 2.0/(1.0+exp(2.0*val));
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

        vec4 uvwq = texture2D(textureSource, textureCoords);
        gl_FragColor = uvwq;

        vec4 Svec = texture2D(imageSourceOne, textureCoords);
        float I_S = (Svec.x + Svec.y + Svec.z) / 3.0;
        float I_SR = Svec.r;
        float I_SG = Svec.g;
        float I_SB = Svec.b;
        float I_SA = Svec.a;
        vec4 Tvec = texture2D(imageSourceTwo, textureCoords);
        float I_T = (Tvec.x + Tvec.y + Tvec.z) / 3.0;
        float I_TR = Tvec.r;
        float I_TG = Tvec.g;
        float I_TB = Tvec.b;
        float I_TA = Tvec.a;
    `;
}
