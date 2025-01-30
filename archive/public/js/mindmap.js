class MindMap {
    constructor(containerId, unsplashAccessKey) {
        console.log('Initializing MindMap')
        this.stage = new Konva.Stage({
            container: containerId,
            width: window.innerWidth,
            height: window.innerHeight,
            draggable: false
        })

        // Separate layers for better organization
        this.canvasLayer = new Konva.Layer()
        this.elementsLayer = new Konva.Layer()
        this.stage.add(this.canvasLayer)
        this.stage.add(this.elementsLayer)

        this.unsplashAccessKey = unsplashAccessKey
        this.contextMenuVisible = false
        this.images = []
        this.currentImageIndex = 0
        this.initEventListeners()
    }

    initEventListeners() {
        console.log('Initializing event listeners')
        this.stage.on('dblclick', (e) => {
            if (e.target === this.stage) {
                this.addTextbox(e)
            }
        })

        this.stage.on('mousedown touchstart', (e) => {
            this.stage.draggable(e.target === this.stage)
        })

        this.stage.on('dragstart', (e) => this.toggleStageDraggable(e))
        this.stage.on('wheel', (e) => this.zoomStage(e))
    }

    addTextbox(event) {
        console.log('Adding textbox');
        const pointer = this.stage.getPointerPosition();
        const stageContainer = this.stage.container().getBoundingClientRect();
        const offsetX = stageContainer.left;
        const offsetY = stageContainer.top;
    
        const textarea = document.createElement('textarea');
        textarea.className = 'textbox genie-in';
        document.body.appendChild(textarea);
    
        const textareaWidth = 200;
        const textareaHeight = 40;
    
        textarea.style.position = 'absolute';
        textarea.style.top = `${pointer.y + offsetY - textareaHeight / 2}px`;
        textarea.style.left = `${pointer.x + offsetX - textareaWidth / 2}px`;
        textarea.style.width = `${textareaWidth}px`;
        textarea.style.height = `${textareaHeight}px`;
        textarea.style.fontSize = '16px';
        textarea.style.fontFamily = 'Calibri';
        textarea.style.textAlign = 'center';
        textarea.style.color = 'black';
        textarea.style.background = 'transparent'; // Make background transparent
        textarea.style.border = '1px solid black';
        textarea.style.padding = '10px';
        textarea.style.outline = '2px solid blue';
        textarea.style.zIndex = 1000;
    
        textarea.focus();
        textarea.select();
    
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                textarea.blur();
            }
        });
    
        textarea.addEventListener('dblclick', () => {
            this.addImageToTextbox(textarea);
        });
    }

    addImageToTextbox(textarea) {
        console.log('Adding image to textbox');
        this.searchImages('random').then(() => {
            const imageObj = new Image();
            imageObj.onload = () => {
                const pointer = {
                    x: parseInt(textarea.style.left) + parseInt(textarea.style.width) / 2,
                    y: parseInt(textarea.style.top) + parseInt(textarea.style.height) / 2
                };
                
                const container = new Konva.Group({
                    x: pointer.x,
                    y: pointer.y,
                    draggable: true
                });
    
                const image = new Konva.Image({
                    image: imageObj,
                    x: -50,
                    y: 30,
                    width: 100,
                    height: 100,
                    stroke: 'green',
                    strokeWidth: 2,
                });
    
                container.add(image);
                this.elementsLayer.add(container);
                this.elementsLayer.draw();
    
                container.on('dragmove', () => {
                    textarea.style.left = `${container.x() - parseInt(textarea.style.width) / 2}px`;
                    textarea.style.top = `${container.y() - parseInt(textarea.style.height) / 2}px`;
                });
            };
            imageObj.src = this.images[this.currentImageIndex].urls.small;
        });
    }

    searchImages(query) {
        console.log('Searching images')
        return fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${this.unsplashAccessKey}`)
            .then(response => response.json())
            .then(data => {
                this.images = data.results.length > 0 ? data.results : this.getFallbackImages()
                this.currentImageIndex = 0
            })
            .catch(error => {
                console.error('Error fetching images:', error)
                this.images = this.getFallbackImages()
                this.currentImageIndex = 0
            })
    }

    getFallbackImages() {
        console.log('Getting fallback images')
        return [
            { urls: { small: '/images/image1.webp' } },
            { urls: { small: '/images/image2.jpg' } },
            { urls: { small: '/images/image3.jpg' } }
        ]
    }

    toggleStageDraggable(e) {
        console.log('Toggling stage draggable')
        this.stage.draggable(e.target === this.stage)
    }

    zoomStage(e) {
        console.log('Zooming stage')
        e.evt.preventDefault()
        const oldScale = this.stage.scaleX()
        const pointer = this.stage.getPointerPosition()

        const mousePointTo = {
            x: (pointer.x - this.stage.x()) / oldScale,
            y: (pointer.y - this.stage.y()) / oldScale,
        }

        const newScale = e.evt.deltaY > 0 ? oldScale / 1.1 : oldScale * 1.1
        this.stage.scale({ x: newScale, y: newScale })

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        }
        this.stage.position(newPos)
        this.stage.batchDraw()
    }
}

// Initialize the MindMap
const mindMap = new MindMap('container', 'YOUR_UNSPLASH_ACCESS_KEY')