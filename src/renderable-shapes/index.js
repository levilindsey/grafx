import {renderableShapeFactory} from './src/renderable-shape-factory';

import {capsuleRenderableShapeFactory} from './src/shape-configs/capsule-renderable-shape';
import {cubeRenderableShapeFactory} from './src/shape-configs/cube-renderable-shape';
import {icosahedronRenderableShapeFactory} from './src/shape-configs/icosahedron-renderable-shape';
import {icosphereRenderableShapeFactory} from './src/shape-configs/icosphere-renderable-shape';
import {latLongSphereRenderableShapeFactory} from './src/shape-configs/lat-long-sphere-renderable-shape';
import {tetrahedronRenderableShapeFactory} from './src/shape-configs/tetrahedron-renderable-shape';

[
  capsuleRenderableShapeFactory,
  cubeRenderableShapeFactory,
  icosahedronRenderableShapeFactory,
  icosphereRenderableShapeFactory,
  latLongSphereRenderableShapeFactory,
  tetrahedronRenderableShapeFactory
].forEach(renderableShapeFactory.registerRenderableShapeFactory);

export * from './src/shape-configs/capsule-renderable-shape';
export * from './src/shape-configs/cube-renderable-shape';
export * from './src/shape-configs/icosahedron-renderable-shape';
export * from './src/shape-configs/icosphere-renderable-shape';
export * from './src/shape-configs/lat-long-sphere-renderable-shape';
export * from './src/shape-configs/tetrahedron-renderable-shape';

export * from './src/renderable-shape-factory';
export * from './src/renderable-shape-store';
