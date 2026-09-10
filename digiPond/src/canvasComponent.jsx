import React, {useRef, useEffect, useState} from 'react';
import { useFish, updateFish } from './fishComponent';

const CanvasComponent = () =>{
    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const {fishRef, drawFish} = useFish();

    useEffect(() =>{
        const handleResize = () =>{
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() =>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        let previousTime = performance.now();
        const animate = (time) =>{
            const deltaTime = Math.min((time - previousTime) / 16.67, 3);
            previousTime = time;

            fishRef.current.forEach((fish) =>{
                updateFish(fish, deltaTime, dimensions.width, dimensions.height);
            });

            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 0, dimensions.width, dimensions.height);
            drawFish(ctx);

            animationId = requestAnimationFrame(animate);
        }

        /*const animate = () =>{
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 0, dimensions.width, dimensions.height);

            drawFish(ctx);
            
            animationId = requestAnimationFrame(animate);
        };*/

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [drawFish, dimensions.width, dimensions.height]);

    return <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} style={{display: 'block'}}/>;
};

export default CanvasComponent;