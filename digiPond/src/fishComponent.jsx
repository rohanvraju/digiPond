import React, {useRef, useEffect, useState, useCallback} from 'react';

export const useFish = () =>{
    const [fishPosition, setFishPosition] = useState({x: 100, y: 100});
    const [fishDestination, setFishDestination] = useState({x: 200, y: 200});

    const fishDimensions = {width: 10, height: 5};

    const drawFish = useCallback((ctx) =>{
        ctx.fillStyle = 'red';
        ctx.fillRect(fishPosition.x, fishPosition.y, fishDimensions.width, fishDimensions.height)
    }, [fishPosition])

    //Animation and movement logic
    useEffect(() =>{

    }, [])

    return {fishPosition, setFishPosition, drawFish}
}

const FishComponent = () =>{
    //Use to manage multiple fish later
    return null;
}

export default FishComponent;