import React, {useRef, useEffect, useState, useCallback} from 'react';
import { debugLog } from './debugSettings';

const normalizeAngle = (angle) =>{
    while(angle > Math.PI){
        angle -= Math.PI * 2;
    }
    while(angle < -Math.PI){
        angle += Math.PI * 2;
    }

    return angle;
}

export const useFish = () =>{
    const [fishDestination, setFishDestination] = useState({x: 200, y: 200});
    const positionRef = useRef({x: 100, y: 100}); //To keep track of fishPos through updates, resolves jittering issue
    const [fishPosition, setFishPosition] = useState(positionRef.current);
    const destinationRef = useRef({x: 200, y: 200});
    const directionRef = useRef(0);

    const fishDimensions = {
        head: {width: 10, height: 5},
        body: {width: 12, height: 4},
        tail: {width: 8, height: 3}
    };

    //Reworking of drawFish for direction change
    const drawFish = useCallback((ctx) =>{
        const pos = positionRef.current;
        const angle = directionRef.current;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        //Head
        ctx.fillStyle = 'red';
        ctx.fillRect(0, -fishDimensions.head.height/2, fishDimensions.head.width, fishDimensions.head.height);

        //Body
        ctx.fillStyle = 'yellow';
        ctx.fillRect(
            -fishDimensions.body.width,
            -fishDimensions.body.height/2,
            fishDimensions.body.width,
            fishDimensions.body.height
        );

        //Tail
        ctx.fillStyle = 'green';
        ctx.fillRect(
            -(fishDimensions.body.width + fishDimensions.tail.width),
            -fishDimensions.tail.height/2,
            fishDimensions.tail.width,
            fishDimensions.tail.height
        );

        ctx.restore();
    }, []);

    //Animation logic incorporating directional movement
    useEffect(() =>{
        const interval = setInterval(() =>{
            const pos = positionRef.current;
            const destX = fishDestination.x - pos.x;
            const destY = fishDestination.y - pos.y;
            const angle = Math.atan2(destY, destX);

            //turns towards destination
            debugLog(`Setting turn angle`);
            const turnAmount = 0.12;
            const delta = normalizeAngle(angle - directionRef.current);
            directionRef.current += delta * turnAmount;
            debugLog(`Turn angle: ${delta}`);

            //move in direction of destination
            debugLog(`Moving towards destination`);
            const speed = 1.4;
            const nextX = pos.x + Math.cos(directionRef.current) * speed;
            const nextY = pos.y + Math.sin(directionRef.current) * speed;

            positionRef.current = {x: nextX, y: nextY};

            //set new destination once target destination reached
            if(Math.hypot(fishDestination.x - nextX, fishDestination.y - nextY) < 5){
                debugLog(`Reached destination, setting new destination`);
                setFishDestination({
                    x: Math.floor(Math.random() * 200), 
                    y: Math.floor(Math.random() * 200)
                });
                debugLog(`Destination set: ${fishDestination.x}, ${fishDestination.y}`);
            }
        }, 30);

        return () => clearInterval(interval);
    }), [fishDestination];


    /*const drawFish = useCallback((ctx) =>{
        const pos = positionRef.current;
        //Head
        ctx.fillStyle = 'red';
        ctx.fillRect(pos.x, pos.y, fishDimensions.head.width, fishDimensions.head.height);

        //Body
        ctx.fillStyle = 'yellow';
        ctx.fillRect(
            pos.x + fishDimensions.head.width, 
            pos.y + 0.5, 
            fishDimensions.body.width, 
            fishDimensions.body.height);

        //Tail
        ctx.fillStyle = 'green';
        ctx.fillRect(
            pos.x + fishDimensions.head.width + fishDimensions.body.width, 
            pos.y + 1, 
            fishDimensions.tail.width, 
            fishDimensions.tail.height)
    }, []);*/

    /*
    //Animation and movement logic
    const approach = useCallback(() =>{
        const newPosition = {
            x: positionRef.current.x < fishDestination.x ? positionRef.current.x + 1 : positionRef.current.x - 1,
            y: positionRef.current.y < fishDestination.y ? positionRef.current.y + 1 : positionRef.current.y - 1
        }
        positionRef.current = newPosition;
        setFishPosition(newPosition);

        // setFishPosition(prevPos =>({
        //     x: prevPos.x < fishDestination.x ? prevPos.x + 1 : prevPos.x - 1,
        //     y: prevPos.y < fishDestination.y ? prevPos.y + 1 : prevPos.y - 1
        // }))
    }, [fishDestination])
    useEffect(() =>{
        const interval = setInterval(() =>{
            if(positionRef.current.x !== destinationRef.current.x || positionRef.current.y !== destinationRef.current.y){
                console.log(`Approaching destination: ${destinationRef.current.x}, ${destinationRef.current.y}`);
                //approach();
                const newPosition = {
                    x: positionRef.current.x < destinationRef.current.x ? positionRef.current.x + 1 : positionRef.current.x - 1,
                    y: positionRef.current.y < destinationRef.current.y ? positionRef.current.y + 1 : positionRef.current.y - 1
                }
                positionRef.current = newPosition;
                setFishPosition(newPosition);
            } else{
                console.log(`Reached destination, setting new destination`);
                destinationRef.current = {x: Math.floor(Math.random() * 200), y: Math.floor(Math.random() * 200)};
                setFishDestination(destinationRef.current);
            }
        }, 50) //Call approach() every 50ms
        
        return () => clearInterval(interval);
    }, [])
    */


    return {fishPosition, setFishPosition, fishDestination, setFishDestination, drawFish}
}

const FishComponent = () =>{
    //Use to manage multiple fish later
    return null;
}

export default FishComponent;