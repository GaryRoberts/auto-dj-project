var ctx, ctx2;
var audio, audio2;
var dataArray, dataArray2;
var WIDTH, WIDTH2;
var HEIGHT, HEIGHT2;
var canvas, canvas2;

var barWidth, barWidth2;
var barHeight, barHeight2;
var bufferLength, bufferLength2;
var x, x2;
var context, context2;
var src, src2;
var analyser, analyser2;


function initializeVisuals() {

    audio = document.getElementById("audio1");


    context = new AudioContext();
    src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();

    canvas = document.getElementById("canvas1");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    dataArray = new Uint8Array(bufferLength);

    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    barWidth = (WIDTH / bufferLength) * 4;
    barHeight;
    x = 0;



    audio2 = document.getElementById("audio2");

    context2 = new AudioContext();
    src2 = context2.createMediaElementSource(audio2);
    analyser2 = context2.createAnalyser();

    canvas2 = document.getElementById("canvas2");
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    ctx2 = canvas2.getContext("2d");

    src2.connect(analyser2);
    analyser2.connect(context2.destination);

    analyser2.fftSize = 256;

    bufferLength2 = analyser2.frequencyBinCount;
    console.log(bufferLength2);

    dataArray2 = new Uint8Array(bufferLength2);

    WIDTH2 = canvas2.width;
    HEIGHT2 = canvas2.height;

    barWidth2 = (WIDTH2 / bufferLength2) * 4;
    barHeight2;
    x2 = 0;

    renderFrame1();
    renderFrame2();

}





function renderFrame1() {
    requestAnimationFrame(renderFrame1);

    x = 0;

    analyser.getByteFrequencyData(dataArray);
   
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        var r = barHeight + (50 * (i / bufferLength));
        var g = 100 * (i / bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }

}


function renderFrame2() {
    requestAnimationFrame(renderFrame2);

    x2 = 0;

    analyser2.getByteFrequencyData(dataArray2);

    ctx2.fillStyle = "#000";
    ctx2.fillRect(0, 0, WIDTH2, HEIGHT2);

    for (var i = 0; i < bufferLength2; i++) {
        barHeight2 = dataArray2[i];

        var r = barHeight2 + (50 * (i / bufferLength2));
        var g = 100 * (i / bufferLength2);
        var b = 50;

        ctx2.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx2.fillRect(x2, HEIGHT2 - barHeight2, barWidth2, barHeight2);

        x2 += barWidth2 + 1;
    }
}