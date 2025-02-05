import { setupStage } from './stageSetup.js';
import { attachTextEvents, attachImageObjectEvent, setupEventHandlers } from './events.js';
import { state } from './state.js'; // Import the shared state
import { deleteItem } from './deleteItem.js';

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
                    attachTextEvents(node);
                } else if (element.type === 'Image') {
                    const imageObj = new Image();
                    imageObj.src = element.attrs.imageSrc;
                    node = new Konva.Image({
                        ...element.attrs,
                        image: imageObj
                    });
                    attachImageObjectEvent(node)
                } else if (element.type === 'Line') {
                    node = new Konva.Line(element.attrs);
                }
                layer.add(node);
            });
            layer.draw();
            showStatus('Elements loaded successfully');
        })
        .catch(error => {
            console.error('Error loading elements:', error);
            showStatus('Error loading elements');
        });
}
const { stage, layer } = setupStage('container');

setupEventHandlers(stage, layer, updateZoomLevel, updateCursorPosition, state.nodesToDrawLineBetween);

document.getElementById('saveButton').addEventListener('click', saveElements);
document.getElementById('loadButton').addEventListener('click', loadElements);
document.getElementById('deleteButton').addEventListener('click', deleteItem);
// Auto-save every 5 seconds
// setInterval(saveElements, 5000);

// Load elements when the page loads
window.onload = loadElements;