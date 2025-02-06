import * as THREE from "three";

export function drawCanvasTexture(w: number, h: number, repeatX: number, repeatY: number, drawFunction: (context: CanvasRenderingContext2D) => void) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    drawFunction(canvas.getContext("2d") as CanvasRenderingContext2D);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);

    return texture;
}
