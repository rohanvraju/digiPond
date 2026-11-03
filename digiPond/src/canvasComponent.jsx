import React, {useRef, useEffect, useState} from 'react';
import { useFish, updateFish } from './fishComponent';

const drawGrid = (ctx, canvasWidth, canvasHeight, tileSize) =>{
    const tileColors = ['#00A2E8', '#99D9EA'];
    const diagonalColors = [
        '#ffffff', '#000000', '#000000', '#ffffff',
        '#000000', '#ffffff', '#ffffff', '#000000',
    ];
    const vertexSize = 5;
    for(let y = 0; y < canvasHeight; y += tileSize){
        for(let x = 0; x < canvasWidth; x += tileSize){
            const tileX = x / tileSize;
            const tileY = y / tileSize;
            
            ctx.fillStyle = tileColors[(tileX + tileY) % 2];
            ctx.fillRect(x, y, tileSize, tileSize);
        }
    }

    //Marking borders for optical illusion
    //TODO: Revisit to try and implement within initial grid drawing loop
    for(let y = 0; y < canvasHeight; y += tileSize){
        for( let x = 0; x < canvasWidth; x += tileSize){
            const tileX = x / tileSize;
            const tileY = y / tileSize;
            const diagonalIndex = (((tileX + tileY) % diagonalColors.length) + diagonalColors.length) % diagonalColors.length;

            ctx.fillStyle = diagonalColors[diagonalIndex];
            ctx.fillRect(
                x + tileSize - (vertexSize / 2),
                y + tileSize - (vertexSize / 2),
                vertexSize,
                vertexSize
            );
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