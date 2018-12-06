class spriteManager {
    constructor() {
        this.image = new Image(); // рисунок с объектами
        this.sprites = new Array(); // массив объектов для отображения
        this.imageLoaded = false; // изображения загружены
        this.jsonLoaded = false; //JSON
    }

    loadAtlas(atlasImage, atlasJson) { // подготовить запрос на разбор атласа
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if(request.readyState === 4 && request.status === 200) {
                this.parseAtlas(request.responseText); // успешно получили атлас
            }
        };

        request.open('GET', atlasJson, true);// асинхронный запрос на разбор атласа
        request.send(); // отправили запрос
        this.loadImg(atlasImage); // загрузка изображения
    }

    loadImg(atlasImage) {
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.src = atlasImage; // загрузим изображение
    }

    // разобрать атлас с объектами
    parseAtlas(atlasJson) {
        let atlas = JSON.parse(atlasJson);

        for(let fr of atlas.frames) { // проход по всем именам frames
            this.sprites.push({
                name: fr.filename,
                x: fr.frame.x, y: fr.frame.y,
                w: fr.frame.w, h: fr.frame.h
            });
        }

        this.jsonLoaded = true;
    }

    drawSprite(ctx, name, x, y, angle = 0) {
        if(!this.imageLoaded || !this.jsonLoaded) {
            return false;
        } else {
            let sprite = this.getSprite(name);
            if(!getMapManager().isVisible(x, y, sprite.w, sprite.h))
                return;

            ctx.drawImage(this.image,
                sprite.x, sprite.y,
                sprite.w, sprite.h,
                x, y,
                sprite.w, sprite.h
            );
        }
    }
    getSprite(name) {
        for(let sprite of this.sprites) {
            if(sprite.name === name) {
                return sprite;
            }
        }

        return null;
    }
}