var levelBriefDuration = 8000;
var gameSpeed = 20;
var name;
//var map  = new mapManager();
var sprite  = new spriteManager();
var events  = new eventsManager();
var physic  = new physicManager();
var game  = new gameManager();
//var hud  = new hudManager();
//var audio  = new audioManager();
//var score = new scoreManager();

function getCurrentContext() { return context; }
function getCurrentCanvas() { return canvas; }
function getEventsManager() { return events; }
function getSpriteManager() { return sprite; }
function getGameManager() { return game; }
function getPhysicManager() { return physic; }
function getMapManager() { return map; }
//function getHudManager() { return hud; }
//function getAudioManager() { return audio; }
//function getScoreManager() { return score; }

function completedLevel(l) {
    startLevel(l + 1);
}

function startLevel(lvl) {

    var ctx = getCurrentContext(),
        pic = new Image();
    pic.src = gameScenes[lvl].img;
    pic.onload = function () {
        ctx.drawImage(pic,150,70,300,200)
    };

    setTimeout( () => {
        getGameManager().loadScene(gameScenes[lvl]);
    }, levelBriefDuration);

}

// Загрузка ресурсов игры
function resourcesLoaded() {

    // Начало игры
    setTimeout( () => { startLevel(getScoreManager().currentLevel) }, 100 );

    console.log('loaded all');
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&

            storage.length !== 0;
    }
}

function div(val, by){
    return (val - val % by) / by;
}


function launch() {
    //getScoreManager().load();
    getGameManager().loadResources();
    name = document.getElementById("name").value;
    console.log(name);
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('pause').style.display = 'block';
    document.getElementById('quit').style.display = 'block';
}

