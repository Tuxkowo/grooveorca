var nowplaying = {	status: false,	lastNotification: null,	init: function(source) {		if(settings.lite == true) {			nowplaying.status = false;			return false;		}		if(localStorage.getItem('activateNowPlaying') == 'false')			nowplaying.status = false;		else 			nowplaying.status = true;				if(navigator.platform != "Win32") {			nowplaying.status = false;		}				if(source == 'options') {				document.getElementById("activateNowPlaying").checked = nowplaying.status;		} else if (source == 'background') {			// Si on est sous Windows on ajoute au DOM le plugin pour MSN			// (même si l'utilisateur ne veux pas activer le changement, il le fera peut-être par la suite)			if(navigator.platform == "Win32") {				document.write('<object id="nowPlayingPlugin" type="application/x-deezerplusmsn" width="300" height="300">' +				'<param name="onload" value="pluginLoaded" />' +				'</object>');			}		}	},	toggleStatus: function() {		localStorage.setItem("activateNowPlaying", document.getElementById("activateNowPlaying").checked);	},	pushInformations: function() {		if(nowplaying.lastNotification != songData.songInf.firstSeen && songData.songInf.paused == false) {			nowplaying.lastNotification = songData.songInf.firstSeen;			document.getElementById('nowPlayingPlugin').nowPlaying(songData.songInf.currentArtist , songData.songInf.currentSong, songData.songInf.currentAlbum, true);		} else if (songData.songInf.paused == true) {			document.getElementById('nowPlayingPlugin').nowPlaying("", "", "", false);			nowplaying.lastNotification = null;		}	},	unload: function() {		lastNotification = null;		document.getElementById('nowPlayingPlugin').nowPlaying("", "", "", false);	}}