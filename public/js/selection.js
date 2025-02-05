import { startDrawLineNode } from "./lines";

let selectedNode = null;
let selectionRect = null;

export function selectNode(node) {
    if (selectedNode) {
        deselectNode();
    }
    selectedNode = node;
    selectionRect = createRectForNode(node);
    const layer = node.getLayer();
    layer.add(selectionRect);
    selectionRect.moveToBottom();
    layer.draw();
}

export function deselectNode() {
    if (selectedNode) {
        selectedNode.stroke(null); // Remove highlight
        selectedNode.strokeWidth(0);
        selectedNode.draw();
        selectedNode = null;
    }
    if (selectionRect) {
        selectionRect.remove();
        selectionRect = null;
    }
}

export function getSelectedNode() {
    return selectedNode;
}

function createRectForNode(node) {
    console.log('Creating rect for text', node.width(), node.height(), node.x(), node.y(), node.getLayer());
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
        console.log("Clicked on rect");
        const shape = evt.target;
        const pos = {
            x: evt.evt.clientX,
            y: evt.evt.clientY
        };
        if (is_on_border(shape, pos)) {
            statr(shape)
        }
    })

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