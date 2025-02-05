import { startDrawLineNode } from "./lines.js";
import { state } from "./state.js";

let selectionRect = null;

export function selectNode(node) {
    if (state.selectedNode) {
        deselectNode();
    }
    state.selectedNode = node;
    selectionRect = createRectForNode(node);
    const layer = node.getLayer();
    layer.add(selectionRect);
    selectionRect.moveToBottom();
    layer.draw();

    document.getElementById('deleteButton').style.display = 'block';

}

export function deselectNode() {
    if (state.selectedNode) {
        state.selectedNode.stroke(null); // Remove highlight
        state.selectedNode.strokeWidth(0);
        state.selectedNode.draw();
        state.selectedNode = null;
    }
    if (selectionRect) {
        selectionRect.remove();
        selectionRect = null;
    }

    document.getElementById('deleteButton').style.display = 'none';
}

function createRectForNode(node) {
    const strokeWidth = 20;
    const nodeWidth = node.width();
    const nodeHeight = node.height();
    const nodeX = node.x();
    const nodeY = node.y();

    const rect = new Konva.Rect({
        x: nodeX - strokeWidth / 2,
        y: nodeY - strokeWidth / 2,
        width: nodeWidth + strokeWidth,
        height: nodeHeight + strokeWidth,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: strokeWidth
    });

    // Add mousemove event listener
    rect.on('mousemove', function (evt) {
        const shape = evt.target;
        const pos = {
            x: evt.evt.clientX,
            y: evt.evt.clientY
        };
        if (is_on_border(shape, pos)) {
            shape.stroke('red');
        } else {
            shape.stroke('black');
        }
        node.getLayer().draw();
    });

    rect.on('mouseout', function () {
        rect.stroke('black');
        node.getLayer().draw();
    });

    rect.on('click', function (evt) {
        // Prevent other elements from running their click event
        evt.cancelBubble = true; // or evt.stopPropagation();
    
        const shape = evt.target;
        const pos = {
            x: evt.evt.clientX,
            y: evt.evt.clientY
        };
        if (is_on_border(shape, pos)) {
            startDrawLineNode(shape);
        }
    });
    return rect;
}

function is_on_border(shape, pos) {
    const buffer = shape.strokeWidth() / 10;
    const x = pos.x;
    const y = pos.y;
    const shapeX = shape.x();
    const shapeY = shape.y();
    const shapeWidth = shape.width();
    const shapeHeight = shape.height();
    const strokeWidth = shape.strokeWidth();

    const isOnLeftBorder = x >= shapeX - buffer && x <= shapeX + strokeWidth + buffer;
    const isOnRightBorder = x >= shapeX + shapeWidth - strokeWidth - buffer && x <= shapeX + shapeWidth + buffer;
    const isOnTopBorder = y >= shapeY - buffer && y <= shapeY + strokeWidth + buffer;
    const isOnBottomBorder = y >= shapeY + shapeHeight - strokeWidth - buffer && y <= shapeY + shapeHeight + buffer;

    return isOnLeftBorder || isOnRightBorder || isOnTopBorder || isOnBottomBorder;
}