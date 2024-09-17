var input = 0;
var crossFadeValue = 10;

var counter = 0;
var time = 30000; // Duration of each track playback
var crossfadeDuration = 10000; // Duration of crossfade (10 seconds)
var children = "";

document.getElementById("range1").value = 10;

function handleFiles(event) {
    input = event.target.files;

    var output = document.getElementById('fileList');
    var itemId = 0;

    children = ""; // Reset the list

    Array.from(input).forEach(file => {
        children += '<li id="music' + itemId + '" class="list-group-item" style="color:black;">' + file.name + '</li>';
        itemId++;
    });

    output.innerHTML = '<ul class="list-group">' + children + '</ul>';
}

document.getElementById("file").addEventListener("change", handleFiles, false);

var checkbox = document.querySelector("input[name=checkbox]");

checkbox.addEventListener('change', function() {
    if (this.checked) {
        launcher();
    } else {
        stopPlayback();
    }
});

function launcher() {
    if (input && input.length > 0) {
        document.getElementById("uploadImage").style.display = "none";
        document.getElementById("uploadLabel").style.display = "none";
        initializeVisuals(); // Assuming this function exists
        counter = 0;
        playTrack(1, input, counter);
        counter++;
    } else {
        alertBox("Please load some tracks in the system");
        checkbox.checked = false;
    }
}

function playTrack(deckNumber, input, index) {
    var audioElement = document.getElementById("audio" + deckNumber);
    var otherDeckNumber = deckNumber === 1 ? 2 : 1;
    var otherAudioElement = document.getElementById("audio" + otherDeckNumber);

    // Set the source and load the audio
    $("#src" + deckNumber).attr("src", URL.createObjectURL(input[index]));
    audioElement.load();

    audioElement.addEventListener('canplaythrough', function() {
        audioElement.play();
        audioElement.volume = 1; // Start at full volume
        document.getElementById("music" + index).style.color = 'red';
        document.getElementById("track" + deckNumber).innerHTML = input[index].name.substring(0, 30) + "...";
        if (deckNumber === 1) {
            show1();
        } else {
            show2();
        }
        // Schedule the crossfade
        setTimeout(function() {
            startCrossfade(deckNumber, otherDeckNumber);
        }, time - crossfadeDuration);
    }, { once: true });
}

function startCrossfade(outgoingDeckNumber, incomingDeckNumber) {
    var outgoingAudio = document.getElementById("audio" + outgoingDeckNumber);
    var incomingAudio = document.getElementById("audio" + incomingDeckNumber);

    if (counter < input.length) {
        $("#src" + incomingDeckNumber).attr("src", URL.createObjectURL(input[counter]));
        incomingAudio.load();
        incomingAudio.addEventListener('canplaythrough', function() {
            incomingAudio.play();
            incomingAudio.volume = 0; // Start at 0 volume
            document.getElementById("music" + counter).style.color = 'red';
            document.getElementById("track" + incomingDeckNumber).innerHTML = input[counter].name.substring(0, 30) + "...";
            if (incomingDeckNumber === 1) {
                show1();
            } else {
                show2();
            }
            crossfadeVolumes(outgoingAudio, incomingAudio, crossfadeDuration, function() {
                // After crossfade is complete, schedule the next crossfade
                setTimeout(function() {
                    startCrossfade(incomingDeckNumber, outgoingDeckNumber);
                }, time - crossfadeDuration);
            });
            counter++;
        }, { once: true });
    } else {
        // No more tracks, fade out the outgoing track
        fadeOut(outgoingAudio, crossfadeDuration);
        checkbox.checked = false; // Stop the automixer
    }
}

function crossfadeVolumes(outgoingAudio, incomingAudio, duration, callback) {
    var startTime = Date.now();

    function updateVolumes() {
        var now = Date.now();
        var elapsed = now - startTime;
        var fraction = elapsed / duration;
        if (fraction > 1) {
            fraction = 1;
        }

        outgoingAudio.volume = 1 - fraction;
        incomingAudio.volume = fraction;

        if (fraction < 1) {
            requestAnimationFrame(updateVolumes);
        } else {
            // Crossfade complete
            outgoingAudio.pause();
            outgoingAudio.currentTime = 0;
            if (callback) {
                callback();
            }
        }
    }

    updateVolumes();
}

function fadeOut(audioElement, duration) {
    var startTime = Date.now();

    function updateVolume() {
        var now = Date.now();
        var elapsed = now - startTime;
        var fraction = elapsed / duration;
        if (fraction > 1) {
            fraction = 1;
        }

        audioElement.volume = 1 - fraction;

        if (fraction < 1) {
            requestAnimationFrame(updateVolume);
        } else {
            // Fade out complete
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    }

    updateVolume();
}

function stopPlayback() {
    clearInterval(interval);
    hide1();
    hide2();
    counter = 0;
    document.getElementById("uploadImage").style.display = "";
    document.getElementById("uploadLabel").style.display = "";
    document.getElementById("audio1").pause();
    document.getElementById("audio2").pause();
    document.getElementById("audio1").currentTime = 0;
    document.getElementById("audio2").currentTime = 0;
}

function show1() {
    document.getElementById("play1").style.display = "";
}

function show2() {
    document.getElementById("play2").style.display = "";
}

function hide1() {
    document.getElementById("play1").style.display = "none";
    document.getElementById("audio1").pause();
}

function hide2() {
    document.getElementById("play2").style.display = "none";
    document.getElementById("audio2").pause();
}

$(document).ready(function() {
    $('.hover_bkgr_fricc').click(function() {
        $('.hover_bkgr_fricc').hide();
    });
    $('.popupCloseButton').click(function() {
        $('.hover_bkgr_fricc').hide();
    });
});

function alertBox(message) {
    $(document).ready(function() {
        document.getElementById("alertContent").innerHTML = message;
        $('.hover_bkgr_fricc').show();
    });
}
