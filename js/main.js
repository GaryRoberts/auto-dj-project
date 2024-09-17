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

var currentDeckNumber = 1;
var nextDeckNumber = 2;

function launcher() {
    if (input && input.length > 0) {
        document.getElementById("uploadImage").style.display = "none";
        document.getElementById("uploadLabel").style.display = "none";
        initializeVisuals(); // Assuming this function exists
        counter = 0;
        currentDeckNumber = 1;
        nextDeckNumber = 2;
        playCurrentTrack();
    } else {
        alertBox("Please load some tracks in the system");
        checkbox.checked = false;
    }
}

function playCurrentTrack() {
    if (counter >= input.length) {
        // No more tracks to play
        stopPlayback();
        return;
    }

    var currentAudio = document.getElementById("audio" + currentDeckNumber);
    var trackIndex = counter;
    var trackFile = input[trackIndex];

    // Set the source and load the audio
    $("#src" + currentDeckNumber).attr("src", URL.createObjectURL(trackFile));
    currentAudio.load();

    currentAudio.addEventListener('canplaythrough', function() {
        currentAudio.play();
        currentAudio.volume = 1; // Start at full volume
        document.getElementById("music" + trackIndex).style.color = 'red';
        document.getElementById("track" + currentDeckNumber).innerHTML = trackFile.name.substring(0, 30) + "...";
        if (currentDeckNumber === 1) {
            show1();
        } else {
            show2();
        }
        // Move the crossfader to the current deck
        document.getElementById("range1").value = currentDeckNumber === 1 ? 0 : 20;

        // Schedule the crossfade
        setTimeout(function() {
            counter++;
            playNextTrack();
        }, time - crossfadeDuration);
    }, { once: true });
}

function playNextTrack() {
    if (counter >= input.length) {
        // No more tracks to play, fade out current track
        fadeOutCurrentTrack();
        return;
    }

    var nextAudio = document.getElementById("audio" + nextDeckNumber);
    var trackIndex = counter;
    var trackFile = input[trackIndex];

    // Set the source and load the audio
    $("#src" + nextDeckNumber).attr("src", URL.createObjectURL(trackFile));
    nextAudio.load();

    nextAudio.addEventListener('canplaythrough', function() {
        nextAudio.play();
        nextAudio.volume = 0; // Start at 0 volume
        document.getElementById("music" + trackIndex).style.color = 'red';
        document.getElementById("track" + nextDeckNumber).innerHTML = trackFile.name.substring(0, 30) + "...";
        if (nextDeckNumber === 1) {
            show1();
        } else {
            show2();
        }
        // Start crossfade
        performCrossfade();
    }, { once: true });
}

function performCrossfade() {
    var startTime = Date.now();
    var currentAudio = document.getElementById("audio" + currentDeckNumber);
    var nextAudio = document.getElementById("audio" + nextDeckNumber);

    function updateVolumes() {
        var now = Date.now();
        var elapsed = now - startTime;
        var fraction = elapsed / crossfadeDuration;
        if (fraction > 1) {
            fraction = 1;
        }

        currentAudio.volume = 1 - fraction;
        nextAudio.volume = fraction;

        // Move crossfader accordingly
        var crossfaderValue = currentDeckNumber === 1 ? fraction * 20 : 20 - (fraction * 20);
        document.getElementById("range1").value = crossfaderValue;

        if (fraction < 1) {
            requestAnimationFrame(updateVolumes);
        } else {
            // Crossfade complete
            currentAudio.pause();
            currentAudio.currentTime = 0;
            // Swap decks
            var temp = currentDeckNumber;
            currentDeckNumber = nextDeckNumber;
            nextDeckNumber = temp;

            // Schedule next track
            setTimeout(function() {
                counter++;
                playNextTrack();
            }, time - crossfadeDuration);
        }
    }

    updateVolumes();
}

function fadeOutCurrentTrack() {
    var currentAudio = document.getElementById("audio" + currentDeckNumber);
    var startTime = Date.now();

    function updateVolume() {
        var now = Date.now();
        var elapsed = now - startTime;
        var fraction = elapsed / crossfadeDuration;
        if (fraction > 1) {
            fraction = 1;
        }

        currentAudio.volume = 1 - fraction;

        // Move crossfader to center
        document.getElementById("range1").value = currentDeckNumber === 1 ? (1 - fraction) * 20 : fraction * 20;

        if (fraction < 1) {
            requestAnimationFrame(updateVolume);
        } else {
            // Fade out complete
            currentAudio.pause();
            currentAudio.currentTime = 0;
            stopPlayback();
        }
    }

    updateVolume();
}

function stopPlayback() {
    hide1();
    hide2();
    counter = 0;
    document.getElementById("uploadImage").style.display = "";
    document.getElementById("uploadLabel").style.display = "";
    var audio1 = document.getElementById("audio1");
    var audio2 = document.getElementById("audio2");
    audio1.pause();
    audio2.pause();
    audio1.currentTime = 0;
    audio2.currentTime = 0;
    // Reset crossfader to center
    document.getElementById("range1").value = 10;
    checkbox.checked = false;
}

function show1() {
    document.getElementById("play1").style.display = "";
}

function show2() {
    document.getElementById("play2").style.display = "";
}

function hide1() {
    document.getElementById("play1").style.display = "none";
    var audio1 = document.getElementById("audio1");
    audio1.pause();
}

function hide2() {
    document.getElementById("play2").style.display = "none";
    var audio2 = document.getElementById("audio2");
    audio2.pause();
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
