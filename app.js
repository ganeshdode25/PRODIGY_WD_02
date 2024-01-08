let seconds = 0;
let minutes = 0;
let hours = 0;


let displaySeconds = 0;
let displayMinutes = 0;
let displayHours = 0;


let interval = null;


let status = "stopped";


function stopWatch(){

    seconds++;

    
    if(seconds / 60 === 1){
        seconds = 0;
        minutes++;

        if(minutes / 60 === 1){
            minutes = 0;
            hours++;
        }

    }

    
    if(seconds < 10){
        displaySeconds = "0" + seconds.toString();
    }
    else{
        displaySeconds = seconds;
    }

    if(minutes < 10){
        displayMinutes = "0" + minutes.toString();
    }
    else{
        displayMinutes = minutes;
    }

    if(hours < 10){
        displayHours = "0" + hours.toString();
    }
    else{
        displayHours = hours;
    }

    
    document.getElementById("display").innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;

}



function startStop(){

    if(status === "stopped"){

        
        interval = window.setInterval(stopWatch, 1000);
        document.getElementById("startStop").innerHTML = "Stop";
        status = "started";

    }
    else{

        window.clearInterval(interval);
        document.getElementById("startStop").innerHTML = "Start";
        status = "stopped";

    }

}


function reset(){

    window.clearInterval(interval);
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.getElementById("display").innerHTML = "00:00:00";
    document.getElementById("startStop").innerHTML = "Start";

}


document.querySelectorAll('.button').forEach((elem) => {

    const canvas = elem.querySelector('.button__canvas')
    const ctx = canvas.getContext('2d')
    
    const offset = 32
    const background = '#eef'
    const foreground = '#7551e9'

    let points = []
    let position
    
    const distance = new Ola({
        value: offset
    })

    const size = () => {

        canvas.width = canvas.getBoundingClientRect().width
        canvas.height = canvas.getBoundingClientRect().height
        
        position = new Ola({
            x: canvas.width / 2,
            y: canvas.height / 2
        })
        
        const pixelsWidth = canvas.width - offset * 2
        const pixelsHeight = canvas.height - offset * 2
        
        const leftTop = [ offset, offset ]
        const rightTop = [ canvas.width - offset, offset ]
        const rightBottom = [ canvas.width - offset, canvas.height - offset ]
        const leftBottom = [ offset, canvas.height - offset ]
        
        points = []

        Array(pixelsWidth).fill().forEach((_, index) => {
            points.push([
                leftTop[0] + index,
                leftTop[1]
            ])
        })
        
        Array(pixelsHeight).fill().forEach((_, index) => {
            points.push([
                rightTop[0],
                rightTop[1] + index
            ])
        })
        
        Array(pixelsWidth).fill().forEach((_, index) => {
            points.push([
                rightBottom[0] - index,
                rightBottom[1]
            ])
        })
        
        Array(pixelsHeight).fill().forEach((_, index) => {
            points.push([
                leftBottom[0],
                leftBottom[1] - index
            ])
        })
        
    }

    size()
    
    const reset = () => {

        ctx.fillStyle = background
        ctx.fillRect(0, 0, canvas.width, canvas.height)

    }

    const draw = () => {

        ctx.fillStyle = foreground
        ctx.beginPath()
        
        points.forEach((point, index) => {
            
            const [ vx, vy ] = attract(point)
                        
            if (index === 0) ctx.moveTo(vx, vy)
            else ctx.lineTo(vx, vy)
                        
        })
        
        ctx.closePath()
        ctx.fill()

    }
    
    const attract = (point) => {
                
        const [ x, y ] = point

        const dx = x - position.x
        const dy = y - position.y
        
        const dist = Math.sqrt(dx * dx + dy * dy)
        const dist2 = Math.max(1, dist)
        
        const d = Math.min(dist2, Math.max(12, (dist2 / 4) - dist2))
        const D = dist2 * distance.value
        
        return [
            x + (d / D) * (position.x - x),
            y + (d / D) * (position.y - y)
        ]

    }

    const loop = () => {
        reset()
        draw()
        requestAnimationFrame(loop)
    }

    window.onresize = size

    canvas.onmousemove = (e) => {

        position.set({
            x: e.clientX - e.target.getBoundingClientRect().left,
            y: e.clientY - e.target.getBoundingClientRect().top
        }, 200)
    
    }
    
    canvas.onmouseenter = () => {
        
        distance.set({
            value: 1
        }, 200)
        
    }
    
    canvas.onmouseleave = () => {
        
        position.set({
            x: canvas.width / 2,
            y: canvas.height / 2
        }, 2000)
        
        distance.set({
            value: offset
        }, 12000)
        
    }

    loop()

})