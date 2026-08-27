import React, {useRef, useEffect, useState, useCallback} from 'react';
import { debugLog } from './debugSettings';

//Fish segments
import fishHead from './assets/fishHead_test.png';
import fishBody from './assets/fishHead_test.png'; //TODO: Replace with actual body and tail model
import fishTail from './assets/fishHead_test.png';

const detailedLogs = false;

//Helper methods for angle and position calculations
const normalizeAngle = (angle) =>{
    while(angle > Math.PI){
        angle -= Math.PI * 2;
    }
    while(angle < -Math.PI){
        angle += Math.PI * 2;
    }

    return angle;
}
const getPointBehind = (position, angle, distance) =>({
    x: position.x - Math.cos(angle) * distance,
    y: position.y - Math.sin(angle) * distance
});
const followSegment = (segment, target, turnAmount, moveAmount) =>{
    const destX = target.x - segment.position.x;
    const destY = target.y - segment.position.y;

    const targetAngle = Math.atan2(destY, destX);
    const angleDiff = normalizeAngle(targetAngle - segment.angle);
    segment.angle += angleDiff * turnAmount;

    //segment.position.x += Math.cos(segment.angle) * moveAmount;
    //segment.position.y += Math.sin(segment.angle) * moveAmount;
    segment.position.x = target.x;
    segment.position.y = target.y;
}

export const useFish = () =>{
    const [fishDestination, setFishDestination] = useState({x: 200, y: 200});
    const positionRef = useRef({x: 100, y: 100}); //To keep track of fishPos through updates, resolves jittering issue
    const [fishPosition, setFishPosition] = useState(positionRef.current);
    const destinationRef = useRef({x: 200, y: 200});
    const directionRef = useRef(0);
    const wiggleSpeed = useRef(0);

    //Storing loaded fish model images
    const imagesRef = useRef({
        head: null,
        body: null,
        tail: null
    });
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const fishDimensions = {
        head: {width: 10, height: 5},
        body: {width: 12, height: 4},
        tail: {width: 8, height: 3}
    };

    //Fish segment refs
    const bodyStartPoint = getPointBehind(
        positionRef.current,
        directionRef.current,
       ((fishDimensions.head.width / 2) + (fishDimensions.body.width / 2))
    )
    const bodyRef = useRef({
        position: bodyStartPoint,
        angle: 0
    });
    const tailStartPoint = getPointBehind(
        bodyStartPoint,
        0,
       ((fishDimensions.body.width / 2) + (fishDimensions.tail.width / 2))
    )
    const tailRef = useRef({
        position: tailStartPoint,
        angle: 0
    });

    //Load fish model images
    useEffect(() =>{
        let imagesLoaded = 0;
        const totalImages = 3;

        const headImage = new Image();
        headImage.src = fishHead;
        headImage.onload = () =>{
            imagesRef.current.head = headImage;
            imagesLoaded++;
            debugLog(`Head image loaded`);
            if(imagesLoaded === totalImages){
                setImagesLoaded(true);
                debugLog(`All model images loaded`);
            }
        };
        headImage.onerror = () =>{
            debugLog(`ERROR: Head image failed to load: ${fishHead}`);
        }

        const bodyImage = new Image();
        bodyImage.src = fishBody;
        bodyImage.onload = () =>{
            imagesRef.current.body = bodyImage;
            imagesLoaded++;
            debugLog(`Body image loaded`);
            if(imagesLoaded === totalImages){
                setImagesLoaded(true);
                debugLog(`All model images loaded`);
            }
        };
        bodyImage.onerror = () =>{
            debugLog(`ERROR: Body image failed to load: ${fishBody}`);
        }

        const tailImage = new Image();
        tailImage.src = fishTail;
        tailImage.onload = () =>{
            imagesRef.current.tail = tailImage;
            imagesLoaded++;
            debugLog(`Tail image loaded`);
            if(imagesLoaded === totalImages){
                setImagesLoaded(true);
                debugLog(`All model images loaded`);
            }
        };
        tailImage.onerror = () =>{
            debugLog(`ERROR: Tail image failed to load: ${fishTail}`);
        }

    }, []);

    //Reworking of drawFish for direction change
    const drawSegment = (ctx, image, segment, dimensions) =>{
        ctx.save();
        ctx.translate(segment.position.x, segment.position.y);
        ctx.rotate(segment.angle);

        ctx.drawImage(
            image,
            -dimensions.width / 2,
            -dimensions.height / 2,
            dimensions.width,
            dimensions.height
        );

        ctx.restore();
    }
    const drawFish = useCallback((ctx) =>{
        if(!imagesLoaded){
            debugLog(`Waiting on model images to load`);
            return;
        }

        drawSegment(
            ctx,
            imagesRef.current.head,
            {
                position: positionRef.current,
                angle: directionRef.current
            },
            fishDimensions.head
        );
        drawSegment(
            ctx,
            imagesRef.current.body,
            bodyRef.current,
            fishDimensions.body
        );
        drawSegment(
            ctx,
            imagesRef.current.tail,
            tailRef.current,
            fishDimensions.tail
        )

        /*
        const pos = positionRef.current;
        const angle = directionRef.current;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        //Head
        if(imagesRef.current.head){
            ctx.drawImage(
                imagesRef.current.head,
                0,
                -fishDimensions.head.height/2,
                fishDimensions.head.width,
                fishDimensions.head.height
            );
        }

        //Body
        if(imagesRef.current.body){
            ctx.drawImage(
                imagesRef.current.body,
                -fishDimensions.body.width,
                -fishDimensions.body.height/2,
                fishDimensions.body.width,
                fishDimensions.body.height
            );
        }

        //Tail
        if(imagesRef.current.tail){
            ctx.drawImage(
                imagesRef.current.tail,
                -(fishDimensions.body.width + fishDimensions.tail.width),
                -fishDimensions.tail.height/2,
                fishDimensions.tail.width,
                fishDimensions.tail.height
            );
        }

        ctx.restore();
        */
    }, [imagesLoaded]);

    //Animation logic incorporating directional movement
    useEffect(() =>{
        const interval = setInterval(() =>{
            const pos = positionRef.current;
            const destX = fishDestination.x - pos.x;
            const destY = fishDestination.y - pos.y;
            const angle = Math.atan2(destY, destX);

            //turns towards destination
            const turnAmount = 0.12;
            const delta = normalizeAngle(angle - directionRef.current);
            const wiggleAngle = 0.05;
            directionRef.current += (delta * turnAmount) + (wiggleAngle * Math.sin(wiggleSpeed.current));
            /*
            Wiggle math: sin produces value b/w -1 and 1. wiggleAngle scales that range.
            So directionRef is altered by -wiggleAngle to wiggleAngle
            */
            if(detailedLogs){debugLog(`Turn angle: ${directionRef.current}`);}

            //move in direction of destination
            if(detailedLogs){debugLog(`Moving towards destination`);}
            const speed = 1.4;
            const nextX = pos.x + Math.cos(directionRef.current) * speed;
            const nextY = pos.y + Math.sin(directionRef.current) * speed;

            positionRef.current = {x: nextX, y: nextY};

            //set new destination once target destination reached
            if(Math.hypot(fishDestination.x - nextX, fishDestination.y - nextY) < 5){
                debugLog(`Reached destination, setting new destination`);
                setFishDestination({
                    x: Math.floor(Math.random() * window.innerWidth), 
                    y: Math.floor(Math.random() * window.innerHeight)
                });
                if(detailedLogs){debugLog(`Destination set: ${fishDestination.x}, ${fishDestination.y}`);}
            }

            //Body and tail positioning relative to head
            const bodyTarget = getPointBehind(
                positionRef.current, //head position
                directionRef.current,
                (fishDimensions.head.width / 2) + (fishDimensions.body.width / 2)
            );
            followSegment(bodyRef.current, bodyTarget, 0.3, 1.47);

            const tailTarget = getPointBehind(
                bodyRef.current.position,
                bodyRef.current.angle,
                (fishDimensions.body.width / 2) + (fishDimensions.tail.width / 2)
            )
            followSegment(tailRef.current, tailTarget, 0.12, 1.5)
        }, 30);

        return () => clearInterval(interval);
    }, [fishDestination]);

    useEffect(() =>{
        const interval = setInterval(() =>{
            wiggleSpeed.current += 0.15;
        }, 30);

        return () => clearInterval(interval);
    }, []);


    return {fishPosition, setFishPosition, fishDestination, setFishDestination, drawFish}
}

const FishComponent = () =>{
    //Use to manage multiple fish later
    return null;
}

export default FishComponent;