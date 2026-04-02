import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    }, []);

    // Snappier spring configuration for the magnetic trailing effect
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);

    useEffect(() => {
        if (isTouchDevice) return;
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            setMousePosition({ x: clientX, y: clientY });
            cursorX.set(clientX - 16);
            cursorY.set(clientY - 16);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable = 
                target.tagName === 'BUTTON' || 
                target.tagName === 'A' || 
                target.closest('.glass-hover') ||
                target.closest('.nav-link') ||
                window.getComputedStyle(target).cursor === 'pointer';
            
            if (isClickable) setIsHovering(true);
            else setIsHovering(false);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [cursorX, cursorY]);

    if (isTouchDevice) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
            {/* The Precision Dot */}
            <motion.div
                animate={{
                    x: mousePosition.x - 3,
                    y: mousePosition.y - 3,
                    scale: isClicking ? 0.5 : 1
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
                style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    boxShadow: '0 0 10px var(--accent-primary)',
                }}
            />

            {/* The Magnetic Ring */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--accent-primary)',
                    x: cursorX,
                    y: cursorY,
                    opacity: 0.5
                }}
                animate={{
                    scale: isHovering ? 2.5 : isClicking ? 0.8 : 1,
                    backgroundColor: isHovering ? 'rgba(0, 245, 160, 0.1)' : 'transparent',
                    borderColor: isHovering ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                    borderWidth: isHovering ? '1px' : '1.5px',
                }}
            />
        </div>
    );
};

export default CustomCursor;
