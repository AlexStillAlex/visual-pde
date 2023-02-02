// post_shaders.js

export function computeDisplayFunShader() {
    return `varying vec2 textureCoords;
    uniform sampler2D textureSource;

    void main()
    {
        vec4 uvw = texture2D(textureSource, textureCoords);
        float value = FUN;
        gl_FragColor = vec4(value, 0.0, 0.0, 1.0);

    }`
}

export function computeMaxSpeciesShader() {
    return `varying vec2 textureCoords;
    uniform sampler2D textureSource;

    void main()
    {
        vec4 uvw = texture2D(textureSource, textureCoords);
        if (uvw.r >= uvw.g && uvw.r >= uvw.b) {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        else if (uvw.g >= uvw.r && uvw.g >= uvw.b) {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
        else if (uvw.b >= uvw.r && uvw.b >= uvw.g) {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }

    }`
}