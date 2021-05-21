
var currentBackground;
document.cookie = "background=3";

//currentBackground=

function changeBackground(background)
{
    if(background==0)
    document.body.style.backgroundImage = "url('images/container-bg.jpg')";
    if(background==1)
    document.body.style.backgroundImage = "url('images/container-bg1.jpg')";
    if(background==2)
    document.body.style.backgroundImage = "url('images/container-bg2.jpg')";
    if(background==3)
    document.body.style.backgroundImage = "url('images/container-bg3.jpg')";
}

function read_cookie(key)
{
    var result;
    return (result = new RegExp('(^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? result[2] : null;
}


changeBackground(window.localStorage.getItem('background'));
//alert(getCookie("bg"));