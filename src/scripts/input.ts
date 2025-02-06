export function update() {
    mouseMovement.x = 0;
    mouseMovement.y = 0;
}

//Keyboard
const keysDown = {} as Record<string, boolean>;
document.body.addEventListener("keydown", event => keysDown[event.code] = true);
document.body.addEventListener("keyup", event => keysDown[event.code] = false);

export function isKeyDown(key: string) {
    return keysDown[key] == true;
}

//Mouse
const mouseMovement = { x: 0, y: 0 };
document.body.addEventListener("mousemove", event => {
    mouseMovement.x = event.movementX;
    mouseMovement.y = event.movementY;
}, false);
document.body.addEventListener("click", async () => {
    await document.body.requestPointerLock();
});

export function isMouseLocked() {
    return document.pointerLockElement == document.body;
}

export function getMouseMovement() {
    return mouseMovement;
}