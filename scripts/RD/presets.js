// presets.js

export function getPreset(id) {
  let options;
  switch (id) {
    case "subcriticalGS":
      options = {
        boundaryConditionsU: "periodic",
        boundaryConditionsV: "periodic",
        brushValue: 1,
        brushRadius: 1 / 20,
        clearValueU: 0.0,
        clearValueV: 0.0,
        colourmap: "turbo",
        dirichletU: 0,
        dirichletV: 0,
        domainScale: 1,
        dt: 0.1,
        diffusionU: 0.000004,
        diffusionV: 0.000002,
        maxColourValueU: 1.0,
        maxColourValueV: 1.0,
        minColourValueU: 0.0,
        minColourValueV: 0.0,
        numSpecies: 2,
        numTimestepsPerFrame: 100,
        preset: "subcriticalGS",
        renderSize: 256,
        reactionStrU: "-u*v^2 + 0.037*(1.0 - u)",
        reactionStrV: "u*v^2 - (0.037+0.06)*v",
        robinStrU: "0",
        robinStrV: "0",
        setTimestepForStability: false,
        spatialStep: 1 / 200,
        squareCanvas: false,
        typeOfBrush: "circle",
        whatToPlot: "v",
      };
      break;
    default:
      options = {
        boundaryConditionsU: "periodic",
        boundaryConditionsV: "periodic",
        brushValue: 1,
        brushRadius: 1 / 20,
        clearValueU: 0.0,
        clearValueV: 0.0,
        colourmap: "viridis",
        dirichletU: 0,
        dirichletV: 0,
        domainScale: 1,
        dt: 0.1,
        diffusionU: 0.000004,
        diffusionV: 0.000002,
        maxColourValueU: 1.0,
        maxColourValueV: 1.0,
        minColourValueU: 0.0,
        minColourValueV: 0.0,
        numSpecies: 2,
        numTimestepsPerFrame: 100,
        preset: "default",
        renderSize: 256,
        reactionStrU: "-u*v^2 + 0.037*(1.0 - u)",
        reactionStrV: "u*v^2 - (0.037+0.06)*v",
        robinStrU: "0",
        robinStrV: "0",
        setTimestepForStability: false,
        spatialStep: 1 / 200,
        squareCanvas: false,
        typeOfBrush: "circle",
        whatToPlot: "v",
      };
  }
  return options;
}
