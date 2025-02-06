const loadedImages = {} as Record<string, HTMLImageElement>
export async function getImage(imageName: string) {
    if (loadedImages[imageName] != null)
        return loadedImages[imageName];

    const img = document.createElement("img");
    loadedImages[imageName] = img;
    img.src = "/images/" + imageName + ".png";
    document.body.appendChild(img);
    img.style.cssText = "display: none";
    await new Promise(resolve => { img.onload = resolve; });

    return img;
}
