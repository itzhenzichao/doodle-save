import {
  DribbbleOutlined,
  BorderOutlined,
  UpOutlined,
  BlockOutlined
} from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './index.scss';

interface ShapeSelectorProps {
  onSelect: (shape: 'circle' | 'rectangle' | 'triangle') => void;
  isActive: boolean;
}

const ShapeSelector = ({ onSelect, isActive }: ShapeSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, ready: false });
  const buttonRef = useRef<HTMLDivElement>(null);

  const shapes = [
    { icon: DribbbleOutlined, label: '圆形', value: 'circle' as const },
    { icon: BorderOutlined, label: '方形', value: 'rectangle' as const },
    { icon: UpOutlined, label: '三角形', value: 'triangle' as const },
  ];

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isExpanded) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.top + rect.height / 2,
          left: rect.right + 2, // 减少间隙
          ready: true,
        });
      }
    };

    if (isExpanded) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isExpanded]);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const handleShapeSelect = (shape: 'circle' | 'rectangle' | 'triangle') => {
    onSelect(shape);
    setIsExpanded(false);
  };

  const dropdownContent = (
    <div 
      className={`shape-dropdown-portal ${isExpanded ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        transform: 'translateY(-50%)',
        zIndex: 1000,
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className='shape-dropdown-content'>
        {shapes.map((shape) => (
          <div
            className='shape-option'
            key={shape.value}
            onClick={() => handleShapeSelect(shape.value)}
          >
            <shape.icon className='shape-option-icon' />
            <div className='shape-option-label'>{shape.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div 
        ref={buttonRef}
        className={`shape-selector ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`shape-main-button ${isActive ? 'active' : ''}`}>
          <BlockOutlined className='toolbar-icon' />
          <div className='toolbar-icon-label'>图形</div>
        </div>
      </div>
      
      {isExpanded && createPortal(dropdownContent, document.body)}
    </>
  );
};

export default ShapeSelector;
