export function setupStage(containerId) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const stage = new Konva.Stage({
        container: containerId,
        width: width,
        height: height,
        draggable: true,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    return { stage, layer };
}