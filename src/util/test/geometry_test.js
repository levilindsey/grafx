import {
  degToRad,
  radToDeg,
  areClose,
  areVec3sEqual,
  vec3ToString,
  createRandomVec3,
  addRandomRotationToVector,
} from '../src/geometry';

describe('geometry', () => {
  describe('angle unit conversion', () => {
    const degRadPairs = [
        [0, 0],
        [-180, -Math.PI],
        [360, 2 * Math.PI],
        [270, 1.5 * Math.PI],
        [720, 4 * Math.PI],
    ];

    it('degToRad', () => {
      degRadPairs.forEach(pair => expect(degToRad(pair[0])).toEqual(pair[1]));
    });

    it('radToDeg', () => {
      degRadPairs.forEach(pair => expect(radToDeg(pair[1])).toEqual(pair[0]));
    });
  });

  it('areClose', () => {
    expect(areClose(0.000000001, -0.000000001)).toBe(true);
    expect(areClose(70.000000001, 70)).toBe(true);
    expect(areClose(70.1, 70)).toBe(false);
  });

  it('areVec3sEqual', () => {
    const v1 = vec3.fromValues(1, 2.5, -3);
    const v2 = vec3.fromValues(1, 2.5, -3);
    const v3 = vec3.fromValues(1, 2, 3);
    expect(areVec3sEqual(v1, v2)).toBe(true);
    expect(areVec3sEqual(v1, v3)).toBe(false);
  });

  it('vec3ToString', () => {
    expect(vec3ToString(vec3.fromValues(1, 2, 3))).toEqual('(1,2,3)');
  });

  it('createRandomVec3', () => {
    for (let i = 0; i < 20; i++) {
      const v = createRandomVec3(3);
      expect(vec3.length(v)).toBeCloseTo(3, 6);
    }
  });

  it('addRandomRotationToVector', () => {
    for (let i = 0; i < 20; i++) {
      const v = vec3.fromValues(0, 0, 3);
      addRandomRotationToVector(v, 0, Math.PI / 2);
      expect(vec3.length(v)).toBeCloseTo(3, 6);
    }
  });
});
