
var currentBackground;

function changeBackground(background)
{

    for(m=0;m<=3;m++)
    {
        if(background==m){
            document.body.style.backgroundImage = "url('images/container-bg"+m+".jpg')";
            $("#wallpaper").modal('hide');
        }
    }
}

//Remembers background at start up
changeBackground(window.localStorage.getItem('background'));
