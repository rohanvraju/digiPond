import React, {useRef, useEffect, useState, useCallback} from 'react';

export const useFish = () =>{
    const [fishPosition, setFishPosition] = useState({x: 100, y: 100});
    const [fishDestination, setFishDestination] = useState({x: 200, y: 200});

    const fishDimensions = {
        head: {width: 10, height: 5},
        body: {width: 12, height: 4},
        tail: {width: 8, height: 3}
    };

    const drawFish = useCallback((ctx) =>{
        //Head
        ctx.fillStyle = 'red';
        ctx.fillRect(fishPosition.x, fishPosition.y, fishDimensions.head.width, fishDimensions.head.height);

        //Body
        ctx.fillStyle = 'yellow';
        ctx.fillRect(
            fishPosition.x + fishDimensions.head.width, 
            fishPosition.y + 0.5, 
            fishDimensions.body.width, 
            fishDimensions.body.height);

        //Tail
        ctx.fillStyle = 'green';
        ctx.fillRect(
            fishPosition.x + fishDimensions.head.width + fishDimensions.body.width, 
            fishPosition.y + 1, 
            fishDimensions.tail.width, 
            fishDimensions.tail.height)
    }, [fishPosition])

    //Animation and movement logic
    const approach = useCallback(() =>{
        setFishPosition(prevPos =>({
            x: prevPos.x < fishDestination.x ? prevPos.x + 1 : prevPos.x - 1,
            y: prevPos.y < fishDestination.y ? prevPos.y + 1 : prevPos.y - 1
        }))
    }, [fishDestination])
    useEffect(() =>{
        const interval = setInterval(() =>{
            if(fishPosition.x !== fishDestination.x || fishPosition.y !== fishDestination.y){
                console.log(`Approaching destination: ${fishDestination.x}, ${fishDestination.y}`);
                approach();
            } else{
                console.log(`Reached destination, setting new destination`);
                setFishDestination({x: Math.random() * 200, y: Math.random() * 200})
            }
        }, 50) //Call approach() every 50ms

        return () => clearInterval(interval);
    }, [fishPosition, fishDestination, approach])


    return {fishPosition, setFishPosition, fishDestination, setFishDestination, drawFish}
}

const FishComponent = () =>{
    //Use to manage multiple fish later
    return null;
}

export default FishComponent;