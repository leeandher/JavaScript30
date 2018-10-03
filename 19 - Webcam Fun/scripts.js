const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    //Request access to user's video feed
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(`Please enable access to your webcam!`, err);
        })
}

function drawVideo() {
    //Gather the canvas size
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    //Redraw the canvas every 16ms
    return setInterval(() => {
        //Draw the video image to the canvas
        ctx.drawImage(video, 0, 0, width, height);
        //Gather Image Data
        let pixels = ctx.getImageData(0, 0, width, height);
        //Alter the image data

        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.1;
        pixels = greenScreen(pixels);

        //Replace with altered image data
        ctx.putImageData(pixels, 0, 0);
    }, 16)
}

function takePhoto() {
    // Play the shutter sound
    snap.currentTime = 0;
    snap.play();
    //Collect the image data
    const imageData = canvas.toDataURL('image/png', 1.0);
    //Create the image link
    const imageLink = document.createElement('a');
    imageLink.href = imageData;
    imageLink.setAttribute('download', 'gorgeous')
    imageLink.innerHTML = `<img src="${imageData}" alt="Quite the strapping young lad!" />`
    strip.insertBefore(imageLink, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //BLUE
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 350] = pixels.data[i + 0]; //RED
        pixels.data[i + 100] = pixels.data[i + 1]; //GREEN
        pixels.data[i + 450] = pixels.data[i + 2]; //BLUE
    }
    return pixels;
}

function greenScreen(pixels) {

    const levels = {};

    document.querySelectorAll('.rgb input').forEach(input => {
        levels[input.name] = input.value;
    })

    for (let i = 0; i < pixels.data.length; i += 4) {
        var r, g, b, a;
        [r, g, b, a] = [
            pixels.data[i],
            pixels.data[i + 1],
            pixels.data[i + 2],
            pixels.data[i + 3]
        ];
        if (r >= levels.rmin && r <= levels.rmax &&
            g >= levels.gmin && g <= levels.gmax &&
            b >= levels.bmin && b <= levels.bmax) {
                pixels.data[i + 3] = 0;
            }
    }
    return pixels
}

getVideo();

video.addEventListener('canplay', drawVideo)