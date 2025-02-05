import { setupStage } from './stageSetup.js';
import { createTextNode, editTextNode, createImageElement } from './nodes.js';
import { setupEventHandlers, attachNodeEvents } from './events.js';
import { selectNode, deselectNode, getSelectedNode } from './selection.js';
import { drawLine } from './lines.js';
import { state } from './state.js'; // Import the shared state

function updateZoomLevel(scale) {
    const zoomLevelDiv = document.getElementById('zoomLevel');
    zoomLevelDiv.innerText = `Zoom: ${(scale * 100).toFixed(2)}%`;
}

function updateCursorPosition(x, y) {
    const cursorPositionDiv = document.getElementById('cursorPosition');
    cursorPositionDiv.innerText = `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`;
}

function showStatus(message) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = message;
    statusDiv.style.display = 'block';
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

function saveElements() {
    const elements = layer.getChildren().map(node => {
        const attrs = node.getAttrs();
        if (node.getClassName() === 'Image') {
            attrs.imageSrc = node.getAttr('imageSrc');
        }
        return {
            type: node.getClassName(),
            attrs: attrs
        };
    });

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ elements })
    }).then(response => response.json())
      .then(data => {
          showStatus('Elements saved successfully');
      });
}

function loadElements() {
    fetch('/load')
        .then(response => response.json())
        .then(data => {
            layer.destroyChildren();
            data.elements.forEach(element => {
                let node;
                if (element.type === 'Text') {
                    node = new Konva.Text(element.attrs);
                } else if (element.type === 'Image') {
                    const imageObj = new Image();
                    imageObj.src = element.attrs.imageSrc;
                    node = new Konva.Image({
                        ...element.attrs,
                        image: imageObj
                    });
                } else if (element.type === 'Line') {
                    node = new Konva.Line(element.attrs);
                }
                attachNodeEvents(node, layer);
                layer.add(node);
            });
            layer.draw();
            showStatus('Elements loaded successfully');
        });
}
const { stage, layer } = setupStage('container');

setupEventHandlers(stage, layer, updateZoomLevel, updateCursorPosition, state.nodesToDrawLineBetween);

document.getElementById('saveButton').addEventListener('click', saveElements);
document.getElementById('loadButton').addEventListener('click', loadElements);

// Auto-save every 5 seconds
setInterval(saveElements, 5000);

// Load elements when the page loads
window.onload = loadElements;