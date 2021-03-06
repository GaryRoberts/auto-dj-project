var input = 0;
var crossFadeValue = 10;

var counter = 0;
var interval;
var adjustVolume;
var time = 30000;
var children = "";
var dynamicList;


setTimeout(function() {
    recorder.stop();

}, 40000)

function confirmBackground() {
    for (m = 0; m <= 3; m++) {
        if (document.getElementById('image' + m).checked) {
            window.localStorage.setItem('background', m);
            changeBackground(m); //updates to new background instantly
            alertBox("Background updated");
        }
    }

}

document.getElementById("range1").value = 10;

function handleFiles(event) {
    input = event.target.files;

    var output = document.getElementById('fileList');
    var itemId = 0;


    Array.from(input).forEach(file => {
        const reader = new FileReader();

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
        clearInterval(interval);
        hide1();
        hide2();
        counter = 0;
        document.getElementById("uploadImage").style.display = "";
        document.getElementById("uploadLabel").style.display = "";
    }
});

function loadDeck1(input, index) {
    var audio1 = document.getElementById("audio1");

    $("#src1").attr("src", URL.createObjectURL(input[index]));
    audio1.load();

    audio1.addEventListener('canplaythrough', function() {

        this.play();
        document.getElementById("music" + index).style.color = 'red';
        document.getElementById("range1").value = 1;
        //soundEffect(1);
        document.getElementById("track1").innerHTML = input[index].name.substring(0, 30) + "...";
        show1();

    });

    setTimeout(function() {
        document.getElementById("audio1").pause();

    }, 36000)
}

function loadDeck2(input, index) {
    var audio2 = document.getElementById("audio2");

    $("#src2").attr("src", URL.createObjectURL(input[index]));
    audio2.load();

    audio2.addEventListener('canplaythrough', function() {
        this.play();

        document.getElementById("music" + index).style.color = 'red';
        document.getElementById("range1").value = 20;
        //soundEffect(1);
        document.getElementById("track2").innerHTML = input[index].name.substring(0, 30) + "...";
        show2();
    });
    setTimeout(function() {
        document.getElementById("audio2").pause();


    }, 36000)

}



function launcher() {


    if (input != 0) {

        document.getElementById("uploadImage").style.display = "none";
        document.getElementById("uploadLabel").style.display = "none";
        initializeVisuals();

        loadDeck1(input, counter);

        counter++;
        automixer();
    } else {
        alertBox("Please load some tracks in the system");
        checkbox.checked = false;
    }
}



function automixer() {

   // https://stackoverflow.com/questions/21277900/how-can-i-pause-setinterval-functions
    interval = setInterval(function() {
        if (counter == input.length) {
            clearInterval(interval);

            hide1();
            hide2();
            
            document.getElementById("range1").value = 10;
            checkbox.checked = false;
            //input=NULL;
        }
        if (counter <= input.length && counter == 1) {
            loadDeck2(input, counter);

        }

        if (counter <= input.length && counter % 2 == 0) {
            loadDeck1(input, counter);

        }

        if (counter <= input.length && counter % 2 != 0 && counter > 1) {
            loadDeck2(input, counter);

        }


        counter++;

    }, time);

}




function volumeAdjuster1() {
    adjustVolume = setInterval(function() {
        for (var m = 1; m <= 20; m++) {
            document.getElementById("range1").value = crossFadeValue++;
            if (m == 20) {
                document.getElementById("audio1").pause();
            }

            setInterval(function() {
                if (m >= 10) {
                    document.getElementById("audio2").volume += 0.1;

                    document.getElementById("audio1").volume -= 0.1;
                }


            }, 3000);
        }
    }, 6000);
}



function volumeAdjuster2() {
    adjustVolume = setInterval(function() {
        for (var m = 1; m <= 20; m++) {
            document.getElementById("range1").value = crossFadeValue--;
            if (m == 20) {
                document.getElementById("audio2").pause();
            }

            setInterval(function() {
                if (m >= 10) {
                    document.getElementById("audio2").volume -= 0.1;

                    document.getElementById("audio1").volume += 0.1;
                }


            }, 3000);
        }
    }, 6000);
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




var getRandomEffect = Math.floor(Math.random() * 5); //from 0 to 5
var getRandomPullup = Math.floor(Math.random() * 1);


function soundEffect(effectType) {
    var effectsList = ["effect", "transition", "horn", "guns", "bounty"];

    var effect = new Audio('sound_effects/' + effectsList[effectType] + '.mp3');
    effect.play();


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