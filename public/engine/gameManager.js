class gameManager {
    constructor() {
        this.entities = []; // объекты
        this.player = null;
        this.worldUpdateTimer = null;
    }

    initPlayer(obj) {
        this.player = obj;
    }

    update() {
        if(this.player === null) {
            return;
        }

            this.player.moveX = 0;
            this.player.moveY = 0;

            if(getEventsManager().action['up']) this.player.moveY = -1;
            if(getEventsManager().action['down']) this.player.moveY = 1;
            if(getEventsManager().action['left']) this.player.moveX = -1;
            if(getEventsManager().action['right']) this.player.moveX = 1;

            for(let entity of this.entities) {
                try { entity.update(); } catch(ex) { console.log(`Не обновилось ${entity.name}`); }
            }


            this.draw(getCurrentContext());


    }

    entity(name) {
        for(let i = 0; i < this.entities.length; i++) {
            if(this.entities[i].name === name) {
                return this.entities[i];
            }
        }
        return null;
    }

    draw() {
        if(this.player !== null) {
            getMapManager().centerAt(this.player.posX, this.player.posY);

            getMapManager().draw(getCurrentContext());


            for(let entity of this.entities) {
                entity.draw(getCurrentContext());
            }

            //getHudManager().drawGameHud();
        }


    }

    loadScene(sc = 0) {
        this.clearScreen();

        getMapManager().jsonLoaded = false;
        getMapManager().imagesLoaded = false;
        getMapManager().imgLoadCounter = 0;
        getMapManager().view = {x: 0, y: 0, w: 800, h: 600};
        getMapManager().loadMap('resource/maps/first_level.json');
        setTimeout(this.loadSceneFinish, 10);

    }

    clearScreen() {
        getCurrentContext().fillStyle = "#EDDEDE";
        getCurrentContext().fillRect(0, 0, getCurrentCanvas().width, getCurrentCanvas().height);
    }

    stopScene() {
        clearInterval(this.worldUpdateTimer);
        this.entities = [];
        this.player = null;
        this.clearScreen();
    }

    //levelCompleted() {

//        if( getEventsManager().action['fire'] ) {
  //          completedLevel(getScoreManager().currentLevel);

        //} else {
         //   getGameManager().stopScene();
            //getAudioManager().frequencyRamp(getAudioManager().lowFrequency, 1);
            //getHudManager().drawHero('endlevel');
            //getHudManager().drawEndLevel();
            //setTimeout( getGameManager().levelCompleted, 20 );
        //}

   // }

    reloadScene() {
        this.stopScene();
        //getScoreManager().clearCurrentRecording();

        getMapManager().parseMap(JSON.stringify(getMapManager().mapData));
        getMapManager().parseEntities();

        //getScoreManager().startTimer();
        getGameManager().play();

    }

    playerPosOnScreen() {
        var scaleX = getCurrentCanvas().getBoundingClientRect().width / getCurrentCanvas().offsetWidth;
        var scaleY = getCurrentCanvas().getBoundingClientRect().height / getCurrentCanvas().offsetHeight;

        let x = getCurrentCanvas().getBoundingClientRect().left +
            (getGameManager().player.posX + Math.floor(getGameManager().player.sizeX / 2.0) - getMapManager().view.x) * scaleX;
        let y = getCurrentCanvas().getBoundingClientRect().top +
            (getGameManager().player.posY + Math.floor(getGameManager().player.sizeY / 2.0) - getMapManager().view.y) * scaleY;

        return { x, y };
    }

    loadSceneFinish(sc=0){
        let jobs = 2;
        if( getMapManager().jsonLoaded ) {
            jobs--;
        }
        if( getMapManager().imagesLoaded ) {
            jobs--;
        }
        if( jobs === 0 ) {
            getGameManager().reloadScene();
        } else {
            setTimeout(getGameManager().loadSceneFinish, 50);
        }

    }


    // загрузка ресурсов
    loadResources() {
        getSpriteManager().loadAtlas('resource/images/spritesheet.png', 'resource/images/sprites.json');
        getEventsManager().setup(getCurrentCanvas());
        //getAudioManager().init();
        //getAudioManager().loadArray([
        //    'resource/sounds/1stlvl.mp3',
        //    'resource/sounds/2ndlvl.mp3',
        //    'resource/sounds/death.mp3',
        //    'resource/sounds/miss.mp3',
        //    'resource/sounds/miss2.mp3',
        //    'resource/sounds/shot.mp3'
        //]);
        setTimeout(this.loadResourcesFinish, 10);
    }

    //загрузка завершена
    loadResourcesFinish() {
        //console.log(`Loading resources:`);
         let jobs = 3;

        if( getSpriteManager().jsonLoaded ) {
            jobs--;
        }

        if( getSpriteManager().imageLoaded ) {
            jobs--;
        }

        /*if( getAudioManager().loaded ) {
            jobs--;
        }*/

        // Перезагрузка процессов
        if( jobs === 0 ) {
            resourcesLoaded();
        } else {
            setTimeout(getGameManager().loadResourcesFinish, 10);
        }

    }

    play() {
        this.worldUpdateTimer = setInterval(updateWorld, gameSpeed);
    }
}

function updateWorld() {
    getGameManager().update();
}
