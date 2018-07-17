# grafx

#### A 3D graphics framework for WebGL.

_See this in use at [levi.codes/space-debris][demo]!_

This framework only defines graphics logic. If you also need a 3D physics engine, checkout 
[physx][physx]. Or checkout [gamex][gamex], a game engine that ties the grafx and physx frameworks
together.

TODO: Add some sort of getting set up and understanding the code docs.

## Notable Features

- **TODO: Copy some notable feature explanations to the docs in the corresponding code. And to understanding-the-code.md?**
- A system for defining 3D shapes, models, and controllers.
- A system for configuring and drawing multiple simultaneous [WebGL programs][webgl-program].
- A system for loading and compiling WebGL shaders and programs.
- Support for both per-model and post-processing shaders. 
- A system for loading textures.
- An animation framework.
- First-person and third-person cameras.
- A collection of basic shape definitions, each with vertex position, normal, texture coordinate,
  and vertex indices configurations.
- Algorithms for converting to and from a vertex indexing array.
- An algorithm for polygon [tesselation][tesselation].
  - This is used for subdividing all faces of a polygon into a parameterized number of triangles.
  - All of the resulting vertices can then be pushed out to a given radius in order to render a
    smoother sphere.
- An algorithm for mapping spherical lat-long textures onto an icosahedron.
  - This involves careful consideration of the texture coordinates around the un-even seam of the
    icosahedron.

## Acknowledgements / Technology Stack

The technologies used in this library include:

- [ES2015][es2015]
- [WebGL][webgl]
- [gulp.js][gulp]
- [Babel][babel]
- [Browserify][browserify]
- [SASS][sass]
- [animation][animation]
- [lsl-gulp-tasks][lsl-gulp-tasks]
- Numerous other packages that are available via [NPM][npm] (these are listed within the
  [`package.json`](./package.json) file)

Many online resources influenced the design of this library. Some of these include:

- [MDN tutorial][mdn-tutorial]
- [webglfundamentals.org][webglfundamentals]

## License

MIT

[demo]: http://levi.codes/space-debris

[physx]: https://github.com/levilindsey/physx
[gamex]: https://github.com/levilindsey/gamex
[animatex]: https://github.com/levilindsey/animatex
[lsl-gulp-tasks]: https://github.com/levilindsey/lsl-gulp-tasks

[es2015]: http://www.ecma-international.org/ecma-262/6.0/
[webgl]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
[node]: http://nodejs.org/
[babel]: https://babeljs.io/
[browserify]: http://browserify.org/
[gulp]: http://gulpjs.com/
[sass]: http://sass-lang.com/
[jasmine]: http://jasmine.github.io/
[karma]: https://karma-runner.github.io/1.0/index.html
[npm]: http://npmjs.org/
[mdn-tutorial]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
[camera-example]: http://www.dhpoware.com/demos/glCamera3.html
[webglfundamentals]: http://webglfundamentals.org/

[webgl-program]: https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram
[tesselation]: https://en.wikipedia.org/wiki/Tessellation
