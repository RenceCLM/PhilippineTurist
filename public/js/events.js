import { createTextNode, editTextNode, createImageElement } from './nodes.js';
import { selectNode, deselectNode } from './selection.js';
import { drawLine } from './lines.js';

export function setupEventHandlers(stage, layer, updateZoomLevel, updateCursorPosition, nodesToDrawLineBetween) {
    let clickTimeout;
    let clickCount = 0;

    stage.on('click', (e) => {
        console.log("clicked")
        console.log(nodesToDrawLineBetween)
        if (e.target === stage && nodesToDrawLineBetween.length === 0) {
            deselectNode();
        } else if (nodesToDrawLineBetween.length === 1) {
            if (e.target === stage) {
                const pointerPosition = stage.getPointerPosition();
                const transform = stage.getAbsoluteTransform().copy();
                transform.invert();
                const pos = transform.point(pointerPosition);
                nodesToDrawLineBetween.push(pos);
            } else {
                nodesToDrawLineBetween.push(e.target);
            }
            drawLine(layer, nodesToDrawLineBetween[0], nodesToDrawLineBetween[1]);
            nodesToDrawLineBetween.length = 0;
        }

        // else {
        //     selectNode(e.target);
        //     selectedNodes.push(e.target);

        //     if (selectedNodes.length === 2) {
        //         drawLine(layer, selectedNodes[0], selectedNodes[1]);
        //         selectedNodes.length = 0; // Reset after drawing the line
        //     }
        // }
    });

    stage.on('dblclick', (e) => {
        if (e.target === stage) {
            const pointerPosition = stage.getPointerPosition();
            const transform = stage.getAbsoluteTransform().copy();
            transform.invert();
            const pos = transform.point(pointerPosition);
            createTextNode(layer, 'New Text', pos.x, pos.y);
        }
    });

    stage.on('wheel', (e) => {
        e.evt.preventDefault();
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * 1.1 : oldScale / 1.1;
        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();

        updateZoomLevel(newScale);
    });

    stage.on('mousemove', (e) => {
        const pointerPosition = stage.getPointerPosition();
        const transform = stage.getAbsoluteTransform().copy();
        transform.invert();
        const pos = transform.point(pointerPosition);
        updateCursorPosition(pos.x, pos.y);
    });
}

export function attachNodeEvents(node) {
    let clickTimeout = null;

    node.on('click', (e) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        }

        if (e.evt.detail === 3) {
            createImageElement(node.getLayer(), node);
        } else if (e.evt.detail === 2) {
            clickTimeout = setTimeout(() => {
                editTextNode(node);
            }, 200); // Adjust the delay as needed
        } else if (e.evt.detail === 1) {
            clickTimeout = setTimeout(() => {
                selectNode(node);
            }, 200); // Adjust the delay as needed
        }
    });
}