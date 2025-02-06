import { BufferAttribute, BufferGeometry, DoubleSide, FrontSide, Mesh, MeshPhongMaterial } from 'three';
import { drawCanvasTexture } from './canvas';
import { randomInt } from './functions';

export class Terrain {
    private mesh: Mesh;
    private heightMap: number[][];
    private texture = drawCanvasTexture(32, 32, 1, 1, ctx => {
        ctx.fillStyle = "#22ff00";
        ctx.fillRect(0, 0, 32, 32);

        ctx.fillStyle = "#22dd00";
        for (let i = 0; i < 10; i++)
            ctx.fillRect(randomInt(0, 31), randomInt(0, 31), 1, 1);

        ctx.fillStyle = "#44ff22";
        for (let i = 0; i < 10; i++)
            ctx.fillRect(randomInt(0, 31), randomInt(0, 31), 1, 1);
    });

    getMesh() { return this.mesh; }
    getHeightMap() { return this.heightMap; }
    getWidth() { return this.width; }
    getHeight() { return this.height; }
    getSize() { return this.size; }

    constructor(private width: number, private height: number, private size: number) {
        // const hm1 = this.generateHeightmap(width + 1, height + 1);
        // const hm2 = this.generatePerlinMap(4);

        // this.heightMap = [];
        // for (let y = 0; y < height + 1; y++) {
        //     const line: number[] = [];
        //     for (let x = 0; x < width + 1; x++)
        //         line.push(hm1[y][x] + (hm2[y][x] / 10));
        //     this.heightMap.push(line);
        // }

        this.heightMap = this.generateHeightmap(width + 1, height + 1);
        this.mesh = this.createMesh(width, height, this.heightMap);
    }

    private createMesh(width: number, depth: number, heightMap: number[][]) {
        const material = new MeshPhongMaterial({
            side: FrontSide,
            shadowSide: DoubleSide,
            map: this.texture
        });

        const mesh = new Mesh(this.generateGeometry(width, depth, heightMap), material);
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        return mesh;
    }

    private generateGeometry(width: number, depth: number, heightMap: number[][]) {
        let points: number[] = [];
        for (let z = 0; z < depth; z++) {
            for (let x = 0; x < width; x++) {
                points = points.concat([
                    x + 0, heightMap[z + 1][x], z + 1,
                    x + 0, heightMap[z][x], z + 0,
                    x + 1, heightMap[z + 1][x + 1], z + 1,
                    x + 1, heightMap[z][x + 1], z + 0,
                ]);
            }
        }
        points = points.map(x => x * this.size);

        let indices: number[] = [];
        for (let i = 0; i < width * depth; i++) {
            indices = indices.concat([
                0, 3, 1, 3, 0, 2
            ].map(x => x + (i * 4)));
        }

        let uvs: number[] = [];
        for (let i = 0; i < width * depth; i++)
            uvs = uvs.concat(
                0, 0,
                1, 0,
                0, 1,
                1, 1,);

        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(new Float32Array(points), 3));
        geometry.setIndex(new BufferAttribute(new Uint32Array(indices), 1));
        geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));

        geometry.computeVertexNormals();

        return geometry;
    }

    private generateHeightmap(width: number, depth: number) {
        const heightmap: number[][] = [];
        for (let z = 0; z < depth; z++) {
            const line: number[] = [];
            for (let x = 0; x < width; x++)
                line.push(this.generateRandomNumber(x, z, width, depth));
            heightmap.push(line);
        }

        let smoothedMap = heightmap;
        for (let i = 0; i < 4; i++)
            smoothedMap = this.smoothMap(smoothedMap, width, depth);

        return smoothedMap;
    }

    private generateRandomNumber(x: number, z: number, width: number, depth: number) {
        const vectorX = width / 2 - x;
        const vectorZ = depth / 2 - z;
        const dist = Math.sqrt(vectorX * vectorX + vectorZ * vectorZ);
        return (Math.random() - 0.3) * 0.5 * Math.pow(dist, 1.2);
    }

    private smoothMap(map: number[][], width: number, depth: number) {
        const smoothedMap: number[][] = [];
        for (let z = 0; z < depth; z++) {
            const line: number[] = [];
            for (let x = 0; x < width; x++) {
                const surrounding = [
                    this.getNumberAt(map, z - 1, x - 1),
                    this.getNumberAt(map, z - 1, x),
                    this.getNumberAt(map, z - 1, x + 1),
                    this.getNumberAt(map, z, x - 1),
                    this.getNumberAt(map, z, x),
                    this.getNumberAt(map, z, x + 1),
                    this.getNumberAt(map, z + 1, x - 1),
                    this.getNumberAt(map, z + 1, x),
                    this.getNumberAt(map, z + 1, x + 1),
                ].filter(x => x != null);
                line.push(surrounding.reduce((a, b) => a + b) / surrounding.length);
            }
            smoothedMap.push(line);
        }

        return smoothedMap;
    }

    private getNumberAt(map: number[][], x: number, z: number) {
        if (map[z] == null || map[z][x] == null)
            return null;

        return map[z][x];
    }

    private generatePerlinMap(size: number) {
        const maps: number[][][] = [];
        const base = 4;

        for (let i = 0; i < size + 1; i++) {
            const map: number[][] = [];
            const curSize = Math.pow(2, i) * base;

            for (let y = 0; y < curSize; y++) {
                const line: number[] = [];
                for (let x = 0; x < curSize; x++)
                    line.push(Math.random());
                map.push(line);
            }
            maps.push(map);
        }

        const mapSize = Math.pow(2, size) * base;
        const perlinMap: number[][] = [];
        for (let y = 0; y < mapSize; y++) {
            const line: number[] = [];
            for (let x = 0; x < mapSize; x++) {
                line.push(0);
            }
            perlinMap.push(line);
        }

        for (let i = 0; i < size + 1; i++) {
            const curSize = Math.pow(2, i) * base;
            const repeatSize = mapSize / curSize;
            for (let y = 0; y < curSize; y++)
                for (let x = 0; x < curSize; x++)
                    for (let y2 = 0; y2 < repeatSize; y2++)
                        for (let x2 = 0; x2 < repeatSize; x2++)
                            perlinMap[y * repeatSize + y2][x * repeatSize + x2] += maps[i][y][x] * (size - i);
        }

        return perlinMap;
    }
}
