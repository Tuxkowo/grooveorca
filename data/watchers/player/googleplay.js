(function () {
    if (typeof ConditionalLoading !== 'undefined') {
        if (!ConditionalLoading.check('data/watchers/player/googleplay.js')) {
            return;
        }
    }

    if (typeof MusicBridge !== 'undefined') {
        var mb = new MusicBridge('googleplay');
        if (mb.scriptReloaded) {
            return;
        }
    }

    var bridgeWatcher = new BridgeWatcher();
    var updateData = bridgeWatcher.updateData.bind(bridgeWatcher);

    var repeatModes = {
        'none': 'NO_REPEAT',
        'all': 'LIST_REPEAT',
        'song': 'SINGLE_REPEAT'
    };

    var clickSlider = function (elt, x, y) {
        console.log(['clickSlider', x, y ]);
            var event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                offsetX: x,
                layerX: x,
                clientY: y,
                offsetY: y,
                layerY: y,
            });
            elt.dispatchEvent(event);

    };

    var updateTrack =  function (force) {
        if (!document.querySelector('#playerSongInfo').textContent) {
            return;
        }

        updateData('song', {
            artist: document
                .querySelector('#playerSongInfo [data-type="artist"]')
                .textContent,
            track: document.querySelector('#currently-playing-title')
                .textContent,
            album: document
                .querySelector('#playerSongInfo [data-type="album"]')
                .textContent,
            album_id: document
                .querySelector('#playerSongInfo [data-type="album"]')
                .getAttribute('data-id'),
            artist_id: document
                .querySelector('#playerSongInfo [data-type="artist"]')
                .getAttribute('data-id'),
            duration: parseInt(document.querySelector('#sliderBar')
                .getAttribute('aria-valuemax') / 1000, 10),
            album_art: document
                .querySelector('#playerBarArt').getAttribute('src'),
            // Missing information:
            track_id: '',
            disk_number: 0,
            track_number: 0,
        }, force);
    };

    var updatePosition = function (force) {
        updateData('position', parseInt(document.querySelector('#sliderBar')
            .getAttribute('aria-valuenow') / 1000, 10), force);
    };

    var updateVolume = function (force) {
        updateData('volume',
            parseInt(document.querySelector('#material-vslider')
                .getAttribute('aria-valuenow'), 10) /
            parseInt(document.querySelector('#material-vslider')
                .getAttribute('aria-valuemax'), 10),
            force);
    };

    var updateState = function (force) {
        var playPause = document.querySelector('[data-id="play-pause"]');
        state = 'stopped';

        if (playPause.getAttribute('class').indexOf('playing') !== -1) {
            state = 'playing';
        } else if (playPause.getAttribute('disabled') !== '') {
            state = 'paused';
        }

        return updateData('state', state, force);
    };

    var updateShuffle = function (force) {
        updateData('shuffle', document
            .querySelector('#player [data-id="shuffle"]')
            .getAttribute('class').indexOf('active') !== -1, force);
    };

    var updateRepeat = function (force) {
        var repeat = 'none';
        var currRepeatMode = document
            .querySelector('#player [data-id="repeat"]').value;

        for (var i in repeatModes) {
            if (repeatModes.hasOwnProperty(i)) {
                if (repeatModes[i] === currRepeatMode) {
                    repeat = i;
                }
            }
        }

        updateData('repeat', repeat, force);
    };

    var eltsToWatch = [
        updatePosition,
        updateTrack,
        updateVolume,
        updateState,
        updateShuffle,
        updateRepeat,
    ];

    var actions = {
        'playpause': function () {
            document.querySelector('#player [data-id="play-pause"]').click();
        },
        'next': function () {
            document.querySelector('#player [data-id="forward"]').click();
        },
        'previous': function () {
            document.querySelector('#player [data-id="rewind"]').click();
        },
        'volume': function (param) {
            var elt = document.querySelector('#vslider');

            var posX = elt.offsetLeft;
            var sizX = elt.offsetWidth;

            var x = posX + parseInt(param.volume * sizX, 10);

            clickSlider(elt, x, 0);
        },
        'play': function () {
            var playPause = document.querySelector('[data-id="play-pause"]');

            if (playPause.getAttribute('class').indexOf('playing') === -1) {
                playPause.click();
            }
        },
        'pause': function () {
            var playPause = document.querySelector('[data-id="play-pause"]');

            if (playPause.getAttribute('class').indexOf('playing') !== -1) {
                playPause.click();
            }
        },
        'seek': function (param) {
            var elt = document.querySelector('#sliderBar');
            var max = parseInt(elt.getAttribute("aria-valuemax") / 1000, 10);

            var posX = 90; // size of album art
            var sizX = elt.offsetWidth;

            var x = posX + parseInt((param.position / max) * sizX, 10);

            clickSlider(elt, x, 0);
        },
        'repeat': function (param) {
            document.querySelector('#player [data-id="repeat"]').click();
        },
        'update_track': function() { updateTrack(true); },
        'shuffle': function (param) {
            document.querySelector('#player [data-id="shuffle"]').click();
        },
    };

    bridgeWatcher.registerActions(actions);
    bridgeWatcher.registerElementsToWatch(eltsToWatch);
})();
