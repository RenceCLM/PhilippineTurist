import { state } from './state.js';
import { deselectNode } from './selection.js';

export function drawLine(layer, startNode, endNodeOrCoord) {
    let startX, startY, endX, endY;

    startX = startNode.x() + startNode.width() / 2;
    startY = startNode.y() + startNode.height() / 2;

    if (endNodeOrCoord instanceof Konva.Node) {
        endX = endNodeOrCoord.x() + endNodeOrCoord.width() / 2;
        endY = endNodeOrCoord.y() + endNodeOrCoord.height() / 2;
    } else {
        endX = endNodeOrCoord.x;
        endY = endNodeOrCoord.y;
    }

    const line = new Konva.Line({
        points: [startX, startY, endX, endY],
        stroke: 'black',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round'
    });

    deselectNode()
    layer.add(line);
    layer.draw();
    return line;
}

export function startDrawLineNode(node) {
    console.log("startDrawLineNode has RUN")
    console.log(node)
    state.nodesToDrawLineBetween.push(node);
}