import * as Input from "./input";
import { CylinderGeometry, Mesh, PerspectiveCamera, Vector3 } from "three";
import { Terrain } from "./terrain";

export class Player {
    constructor(position: Vector3) {
        //Player mesh
        this.mesh = new Mesh(new CylinderGeometry(1, 1, 1), undefined);
        this.mesh.position.copy(position);

        //Camera
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.mesh.add(this.camera);
    }

    private camera: PerspectiveCamera;
    private mesh: Mesh;
    private stepAccumulator: number = 0;

    update(terrain: Terrain) {
        this.setHeightFromTerrain(terrain);
        this.movement();
    }

    private movement() {
        const speed = Input.isKeyDown("ShiftLeft") ? 0.04 : 0.01;
        let stepX = 0;
        let stepZ = 0;

        if (Input.isKeyDown("KeyW")) {
            this.mesh.translateZ(-speed);
            stepZ -= 1;
        }
        if (Input.isKeyDown("KeyS")) {
            this.mesh.translateZ(speed);
            stepZ += 1;
        }
        if (Input.isKeyDown("KeyA")) {
            this.mesh.translateX(-speed);
            stepX -= 1;
        }
        if (Input.isKeyDown("KeyD")) {
            this.mesh.translateX(speed);
            stepX += 1;
        }
        // if (Input.isKeyDown("Space"))
        //     this.mesh.translateY(speed);
        // if (Input.isKeyDown("ControlLeft"))
        //     this.mesh.translateY(-speed);

        if (Math.abs(stepX) + Math.abs(stepZ) > 0)
            this.stepAccumulator += speed;

        this.mesh.translateY(0.9 + Math.sin(this.stepAccumulator * 3) / 30);

        if (!Input.isMouseLocked())
            return;

        const mouseMovement = Input.getMouseMovement();

        this.mesh.rotateY(-mouseMovement.x / 100);
        this.camera.rotateX(-mouseMovement.y / 100);

        if (this.camera.rotation.x > Math.PI / 2)
            this.camera.rotation.x = Math.PI / 2;
        if (this.camera.rotation.x < -Math.PI / 2)
            this.camera.rotation.x = -Math.PI / 2;
    }

    private setHeightFromTerrain(terrain: Terrain) {
        const width = terrain.getWidth();
        const height = terrain.getHeight();
        const size = terrain.getSize();

        if (
            this.mesh.position.x < 0 ||
            this.mesh.position.z < 0 ||
            this.mesh.position.x > width * size ||
            this.mesh.position.z > height * size
        ) {
            this.mesh.position.setY(0);
            return;
        }

        const map = terrain.getHeightMap();

        const arrX = Math.floor(this.mesh.position.x / size);
        const arrZ = Math.floor(this.mesh.position.z / size);
        const modX = (this.mesh.position.x / size) % 1;
        const modZ = (this.mesh.position.z / size) % 1;

        const lerp1 = (map[arrZ][arrX] * (1 - modX)) + (map[arrZ][arrX + 1] * modX);
        const lerp2 = (map[arrZ + 1][arrX] * (1 - modX)) + (map[arrZ + 1][arrX + 1] * modX);
        const lerp3 = (lerp1 * (1 - modZ)) + (lerp2 * modZ);

        this.mesh.position.setY(lerp3 * size);
    }

    getMesh() { return this.mesh; }
    getCamera() { return this.camera; }
}
