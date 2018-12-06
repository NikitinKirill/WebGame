class eventsManager {
    constructor() {
        this.bind = [];
        this.action = [];
    }

    setup(canvas) {
        this.bind[87] = 'up';
        this.bind[65] = 'left';
        this.bind[83] = 'down';
        this.bind[68] = 'right';
        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
    }


    onKeyDown(event) {
        let action = getEventsManager().bind[event.keyCode];

        if(action) {
            getEventsManager().action[action] = true;
        }
    }

    onKeyUp(event) {
        let action = getEventsManager().bind[event.keyCode];

        if(action) {
            getEventsManager().action[action] = false;

        }
    }
}