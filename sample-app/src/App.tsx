import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import CircularContextMenu from './CircularContextMenu';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface ImageData {
  id: number;
  x: number;
  y: number;
}

function ImageComponent({ id, x, y }: { id: number; x: number; y: number }) {
  const nodeRef = useRef(null);

  return (
    <motion.div style={{ position: 'absolute', left: x, top: y }}>
      <div ref={nodeRef}>
          <img
            src="https://placehold.co/60x40"
            className="logo"
            alt={`Draggable ${id}`}
            draggable={false}
          />
        </div>
    </motion.div> 
  );
}

export default function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [, setRender] = useState(0);
  const [menuPostion, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSize, setMenuSize] = useState(0);
  const [zoomState, setZoomState] = useState(1);
  const [targetContextMenu, setTargetContextMenu] = useState<HTMLElement | null>(null);
  const [contextMenuClicked, setContextMenuClicked] = useState({ x: 0, y: 0 });

  const panningOptions = { excluded: ["whiteboard-element"] };
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const forceRender = () => setRender((prev) => prev+ 1)

  const addImage = () => {
    setImages((prevImages) => [...prevImages, { id: Date.now(), x: contextMenuClicked.x, y: contextMenuClicked.y }]);
  };

  const MENUITEMS = [
    { icon: "🖼️", label: "Image", onClick: addImage },
    { icon: "🎥", label: "Video", onClick: null },
    { icon: "🎵", label: "Music", onClick: null },
    { icon: "📂", label: "File", onClick: null },
    { icon: "📍", label: "Location", onClick: null },
    { icon: "💻", label: "Code", onClick: null },
  ];

  const updateAll = () => {
    forceRender();
    updateMenuPosition();
  }

  const updateMenuPosition = () => {
    if (!targetContextMenu) return;
    else if (targetContextMenu === whiteboardRef.current) return

    const targetSize = targetContextMenu?.getBoundingClientRect();
    setMenuPosition({ x: targetSize?.x + targetSize?.width/2, y: targetSize?.y + targetSize?.height/2 }) // framer-motion is weird when using setState it gives the wrong getBoundingClientRect, always the rect of the parent instead of the target
  }

  const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = whiteboardRef.current?.getBoundingClientRect();
      const target = e.target as HTMLElement; // this sucks, typescript says it's because it's a "EventTarget", not a HTMLElement
      const targetSize = target.getBoundingClientRect();
      let menuSize = Math.max(targetSize.width, targetSize.height)

      if (!rect) return;
      let position;


      if (target === whiteboardRef.current) {
        position = { 
          x: (e.clientX),
          y: (e.clientY)}
          menuSize = 50 / zoomState
      } else {
        position = { 
          x: (targetSize.x + targetSize.width/2), 
          y: (targetSize.y + targetSize.height/2) 
        }
      }

      setContextMenuClicked({ x: e.clientX, y: e.clientY });
      setIsMenuOpen(true); 
      setMenuSize(menuSize);
      setMenuPosition(position);
      setTargetContextMenu(target);

      console.log(contextMenuClicked)
    }

  return (
    <>
        <TransformWrapper 
        initialScale={0.95}
          minScale={0.01}
          maxScale={1000}
          onPanning={forceRender}
          panning={panningOptions}
          onTransformed={(ref: ReactZoomPanPinchRef) => {
            setZoomState(ref.state.scale) 
            updateAll()
          }}
        >
          {({ resetTransform }) => (
            <>
              <div className="absolute bottom-4 right-4 space-x-2 z-10"> 
                  <motion.button drag onClick={() => resetTransform()} className="p-2 bg-gray-500 text-white rounded">{zoomState}</motion.button>    
              </div>
              <TransformComponent>
                <div ref={whiteboardRef} className="relative w-[100vw] h-[100vh] bg-blue shadow-lg border border-gray-300" onContextMenu={handleContextMenu} onClick={() => setIsMenuOpen(false)}>                  
                  
                  <motion.div drag onUpdate={updateAll} id="square" className="whiteboard-element absolute w-24 h-24 bg-blue-300 flex justify-center items-center cursor-grab">Square</motion.div>
                  
                  {images.map((image) => (<motion.div drag dragConstraints={whiteboardRef} className="whiteboard-element"><ImageComponent key={image.id} id={image.id} x={image.x} y={image.y}/></motion.div>))}
                </div>
              </TransformComponent>
              <CircularContextMenu ref={contextMenuRef} x={menuPostion.x} y={menuPostion.y} isOpen={isMenuOpen} menuItems={MENUITEMS} componentSize={menuSize} itemSize={window.innerHeight/10} itemSpacing={10} />
            </>
          )}
        </TransformWrapper>
    </>
    
  )
}
