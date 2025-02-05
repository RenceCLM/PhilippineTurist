import { selectNode, updateSelectionBox } from './selection.js';
import { state } from "./state.js";

export function createTextNode(layer, text, x, y) {
    const textNode = new Konva.Text({
        text: text,
        x: x - 10, // Adjust x to center the text node
        y: y - 10, // Adjust y to center the text node
        fontSize: 20,
        draggable: true,
    });

    layer.add(textNode);
    layer.draw();

    let clickTimeout = null;

    textNode.on('click', (e) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        }

        if (e.evt.detail === 3) {
            createImageElement(layer, textNode);
        } else if (e.evt.detail === 2) {
            clickTimeout = setTimeout(() => {
                editTextNode(textNode);
            }, 200); // Adjust the delay as needed
        } else if (e.evt.detail === 1) {
            clickTimeout = setTimeout(() => {
                selectNode(textNode);
            }, 200); // Adjust the delay as needed
        }
    });

    textNode.on('dragmove', () => {
        if (state.selectedNode === textNode) {
            updateSelectionBox(textNode);
            layer.batchDraw();
        }
    });

    return textNode;
}

export function editTextNode(textNode) {
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = textNode.getStage().container().getBoundingClientRect();
    const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
    };

    const textarea = document.createElement('textarea');
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
    textNode.getLayer().draw();
    textarea.focus();

    textarea.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            textNode.text(textarea.value);
            document.body.removeChild(textarea);
            textNode.show();
            textNode.getLayer().draw();
        }
    });

    textarea.addEventListener('blur', function () {
        textNode.text(textarea.value);
        if (textarea.value.trim() === '') {
            textNode.destroy();
        }
        document.body.removeChild(textarea);
        textNode.show();
        textNode.getLayer().draw();
    });

}

export function createImageElement(layer, textNode) {
    fetchImageFromUnsplash(textNode.text()).then(imageUrl => {
        const imageObj = new Image();
        imageObj.onload = function () {
            const image = new Konva.Image({
                x: textNode.x() - 50,
                y: textNode.y() - 50,
                image: imageObj,
                width: 100,
                height: 100,
                draggable: true,
            });

            let clickTimeout;

            image.on('click', (e) => {
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                }

                if (e.evt.detail === 1) {
                    clickTimeout = setTimeout(() => {
                        selectNode(image);
                    }, 300); // Adjust the delay as needed
                }
            });

            image.on('dragmove', () => {   
                if (state.selectedNode === image) {
                    updateSelectionBox(image);
                    layer.batchDraw();
                }
            });

            // Save the image source URL in the node attributes
            image.setAttr('imageSrc', imageUrl);

            layer.add(image);
            layer.draw();

            // Adjust the text node position to center it above the image
            textNode.y(textNode.y() - image.height() / 2);
            layer.draw();
        };
        imageObj.src = imageUrl;
    });
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

function getFallbackImages() {
    return [
        { urls: { small: '/images/image1.webp' } },
        { urls: { small: '/images/image2.jpg' } },
        { urls: { small: '/images/image3.jpg' } }
    ];
}