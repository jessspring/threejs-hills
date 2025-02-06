import * as THREE from "three";
import { drawCanvasTexture } from "./canvas";

export function createSkybox() {
    const topColor = "#1F56DF";
    const middleColor1 = "#2766EB";
    const middleColor2 = "#3A77EF";
    const bottomColor = "#A8C8F2";

    const topTexture = drawCanvasTexture(128, 128, 1, 1, context => {
        context.fillStyle = topColor;
        context.fillRect(0, 0, 128, 128);
    });
    const bottomTexture = drawCanvasTexture(128, 128, 1, 1, context => {
        context.fillStyle = bottomColor;
        context.fillRect(0, 0, 128, 128);
    });
    const middleTexture = drawCanvasTexture(128, 128, 1, 1, context => {
        const grad1 = context.createLinearGradient(0, 0, 0, 21);
        grad1.addColorStop(0, topColor);
        grad1.addColorStop(1, middleColor1);
        context.fillStyle = grad1;
        context.fillRect(0, 0, 128, 21);

        const grad2 = context.createLinearGradient(0, 21, 0, 42);
        grad2.addColorStop(0, middleColor1);
        grad2.addColorStop(1, middleColor2);
        context.fillStyle = grad2;
        context.fillRect(0, 21, 128, 21);

        const grad3 = context.createLinearGradient(0, 42, 0, 64);
        grad3.addColorStop(0, middleColor2);
        grad3.addColorStop(1, bottomColor);
        context.fillStyle = grad3;
        context.fillRect(0, 42, 128, 22);

        context.fillStyle = bottomColor;
        context.fillRect(0, 64, 128, 64);
    });

    const textures = [
        middleTexture,
        middleTexture,
        topTexture,
        bottomTexture,
        middleTexture,
        middleTexture
    ].map(x => x.image);

    const cubeTexture = new THREE.CubeTexture(textures);
    cubeTexture.needsUpdate = true;
    cubeTexture.magFilter = THREE.NearestFilter;

    return cubeTexture;
}
