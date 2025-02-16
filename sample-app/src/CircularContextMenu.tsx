import { motion } from "framer-motion";
import React from "react";

const MENUITEMS = [
  { icon: "🖼️", label: "Image", onClick: () => console.log("Image") },
  { icon: "🎥", label: "Video", onClick: null },
  { icon: "🎵", label: "Music", onClick: null },
  { icon: "📂", label: "File", onClick: null },
  { icon: "📍", label: "Location", onClick: null },
  { icon: "💻", label: "Code", onClick: null },
];

interface MenuItem {
  icon: string;
  label: string;
  onClick: (() => void) | null;
}

interface CircularContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  componentSize: number;
  itemSize: number;
  itemSpacing: number;
  menuItems?: MenuItem[];
}

const CircularContextMenu = React.forwardRef<HTMLDivElement, CircularContextMenuProps>(
  ({ isOpen, x, y, componentSize, itemSize = 20, itemSpacing = 10, menuItems = MENUITEMS }, ref) => {
    const divSize = componentSize + itemSize + itemSpacing;

    const getPosition = (index: number, total: number) => {
      if (total === 0) return { x: 0, y: 0 };

      const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
      const radius = divSize / 2;

      return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      };
    };

    return (
      <motion.div
        ref={ref}
        style={{
          width: divSize,
          height: divSize,
          left: x - divSize / 2,
          top: y - divSize / 2,
        }}
        className="absolute flex justify-center items-center border-5 border-gray-300 rounded-full"
        animate={{ scale: isOpen ? 1 : 0 }}
        initial={{ scale: 0 }}
      >
        {menuItems.map((item, index) => {
          const { x, y } = getPosition(index, menuItems.length);
          return (
            <motion.button
              key={index}
              style={{ width: itemSize, height: itemSize }}
              className={`absolute flex items-center justify-center bg-white rounded-full shadow-md border border-gray-300 text-gray-600`}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: isOpen ? 1 : 0, x, y }}
              transition={{ delay: index * 0.05 }}
              onClick={item.onClick || (() => {})}
            >
              {item.icon}
            </motion.button>
          );
        })}
      </motion.div>
    );
  }
);

export default CircularContextMenu;