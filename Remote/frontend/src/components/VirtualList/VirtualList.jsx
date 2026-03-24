import { useState, useEffect, useRef, useMemo } from 'react';
import './VirtualList.css';

const VirtualList = ({ 
  items, 
  itemHeight = 100, 
  containerHeight = 400, 
  renderItem,
  overscan = 5 
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push({
        index: i,
        item: items[i],
        offsetY: i * itemHeight
      });
    }

    return visibleItems;
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  const totalHeight = items.length * itemHeight;

  return (
    <div 
      ref={containerRef}
      className="virtual-list-container"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div 
        className="virtual-list-content"
        style={{ height: totalHeight }}
      >
        {visibleItems.map(({ index, item, offsetY }) => (
          <div
            key={index}
            className="virtual-list-item"
            style={{
              position: 'absolute',
              top: offsetY,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;
