const DEBUG = import.meta.env.VITE_DEBUG === 'true';

export const debugLog = (...args) =>{
    if(DEBUG){
        console.log(...args);
    }
}