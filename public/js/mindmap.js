var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true,
});

var layer = new Konva.Layer();
stage.add(layer);

var clickTimeout;

function createTextNode(text, x, y) {
    var textNode = new Konva.Text({
        text: text,
        x: x,
        y: y,
        fontSize: 20,
        draggable: true,
    });

    // Center the text node
    textNode.offsetX(textNode.width() / 2);
    textNode.offsetY(textNode.height() / 2);

    layer.add(textNode);
    layer.draw();

    textNode.on('dblclick dbltap', () => {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
            editTextNode(textNode);
        }, 300);
    });

    textNode.on('click', (e) => {
        if (e.evt.detail === 3) {
            clearTimeout(clickTimeout);
            createImageElement(textNode);
        }
    });
}

function editTextNode(textNode) {
    var textPosition = textNode.getAbsolutePosition();
    var stageBox = stage.container().getBoundingClientRect();
    var areaPosition = {
        x: stageBox.left + textPosition.x - textNode.width() / 2,
        y: stageBox.top + textPosition.y - textNode.height() / 2,
    };

    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width();
    textarea.style.height = textNode.height();
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();

    textNode.hide();
    layer.draw();

    textarea.focus();

    textarea.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            textNode.text(textarea.value);
            document.body.removeChild(textarea);
            textNode.show();
            layer.draw();
        }
    });

    textarea.addEventListener('blur', function () {
        textNode.text(textarea.value);
        if (textarea.value.trim() === '') {
            textNode.destroy();
        }
        document.body.removeChild(textarea);
        textNode.show();
        layer.draw();
    });
}

function getFallbackImages() {
    console.log('Getting fallback images');
    return [
        { urls: { small: '/images/image1.webp' } },
        { urls: { small: '/images/image2.jpg' } },
        { urls: { small: '/images/image3.jpg' } }
    ];
}

function fetchImageFromUnsplash(query) {
    const accessKey = 'YOUR_UNSPLASH_ACCESS_KEY';
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                return data.results[0].urls.small;
            } else {
                throw new Error('No images found');
            }
        })
        .catch(() => {
            const fallbackImages = getFallbackImages();
            return fallbackImages[Math.floor(Math.random() * fallbackImages.length)].urls.small;
        });
}

function createImageElement(textNode) {
    fetchImageFromUnsplash(textNode.text()).then(imageUrl => {
        var imageObj = new Image();
        imageObj.onload = function () {
            var image = new Konva.Image({
                x: textNode.x() - 50,
                y: textNode.y() - 50,
                image: imageObj,
                width: 100,
                height: 100,
                draggable: true,
            });

            // Save the image source URL in the node attributes
            image.setAttr('imageSrc', imageUrl);

            layer.add(image);
            layer.draw();

            textNode.y(textNode.y() - image.height() / 2);
            layer.draw();
        };
        imageObj.src = imageUrl;
    });
}

stage.on('dblclick', (e) => {
    if (e.target === stage) {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
            var pointerPosition = stage.getPointerPosition();
            var transform = stage.getAbsoluteTransform().copy();
            transform.invert();
            var pos = transform.point(pointerPosition);
            createTextNode('New Text', pos.x, pos.y);
        }, 300);
    }
});

stage.on('wheel', (e) => {
    e.evt.preventDefault();
    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();

    var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    var newScale = e.evt.deltaY > 0 ? oldScale * 1.1 : oldScale / 1.1;
    stage.scale({ x: newScale, y: newScale });

    var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();

    updateZoomLevel(newScale);
});

stage.on('mousemove', (e) => {
    var pointerPosition = stage.getPointerPosition();
    var transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    var pos = transform.point(pointerPosition);
    updateCursorPosition(pos.x, pos.y);
});

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
          console.log(data);
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
                    node.on('dblclick dbltap', () => {
                        clearTimeout(clickTimeout);
                        clickTimeout = setTimeout(() => {
                            editTextNode(node);
                        }, 300);
                    });

                    node.on('click', (e) => {
                        if (e.evt.detail === 3) {
                            clearTimeout(clickTimeout);
                            createImageElement(node);
                        }
                    });
                } else if (element.type === 'Image') {
                    const imageObj = new Image();
                    imageObj.src = element.attrs.imageSrc;
                    node = new Konva.Image({
                        ...element.attrs,
                        image: imageObj
                    });
                }
                layer.add(node);
            });
            layer.draw();
            showStatus('Elements loaded successfully');
        });
}

document.getElementById('saveButton').addEventListener('click', saveElements);
document.getElementById('loadButton').addEventListener('click', loadElements);

// Auto-save every 5 seconds
setInterval(saveElements, 5000);

// Load elements when the page loads
window.onload = loadElements;

// Initial text node
// createTextNode('Some text here', 50, 50);