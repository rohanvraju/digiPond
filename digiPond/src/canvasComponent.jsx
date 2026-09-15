import React, {useRef, useEffect, useState} from 'react';
import { useFish, updateFish } from './fishComponent';

const drawGrid = (ctx, canvasWidth, canvasHeight, tileSize) =>{
    const tileColors = ['#00A2E8', '#99D9EA'];
    const vertexColors = ['#000000', '#ffffff']
    for(let y = 0; y < canvasHeight; y += tileSize){
        for(let x = 0; x < canvasWidth; x += tileSize){
            const tileX = x / tileSize;
            const tileY = y / tileSize;
            
            ctx.fillStyle = tileColors[(tileX + tileY) % 2];
            ctx.fillRect(x, y, tileSize, tileSize);

            const vertexOriginX = ((tileX + tileY) % 2 == 0) ? (x + tileSize) - 10 : x;
            const vertexOriginY = ((tileX + tileY) % 2 == 0) ? (y + tileSize) - 10 : (y + tileSize) - 10;
            ctx.fillStyle = vertexColors[0];
            ctx.fillRect(vertexOriginX, vertexOriginY, (10), (10));
        }
    }
}

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

            // ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            // ctx.fillStyle = 'blue';
            // ctx.fillRect(0, 0, dimensions.width, dimensions.height);
            drawGrid(ctx, dimensions.width, dimensions.height, 40);
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