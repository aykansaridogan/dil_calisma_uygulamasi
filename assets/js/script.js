var card_face = "front";
var clickable = true;
var english_word = document.getElementById("english_word");
var english_alt_word = document.getElementById("english_alt_word");
var turkish_word = document.getElementById("turkish_word");
var turkish_alt_word = document.getElementById("turkish_alt_word");

$(".s_round").click(function () {
    if (clickable) {
        card_flip();
    }
});

function voiceMute(value) {
    song.gainNode.gain.value = value;
    song.source.connect(song.gainNode);
}

function card_flip() {
    $('.flip_box').toggleClass('flipped');
    $(this).addClass('s_round_click');
    $('.s_arrow').toggleClass('s_arrow_rotate');
    $('.b_round').toggleClass('b_round_back_hover');
    if (card_face == "front") {
        card_face = "back";
    } else {
        card_face = "front";
    }
    return false;
}

function card_opacity(type = true, time = 1000) {
    card_box = document.getElementById("card_box");
    if (type) {
        setTimeout(function () {
            card_box.classList.remove("not_chang");
            card_box.classList.add("chang");
        }, time);
    } else {
        setTimeout(function () {
            card_box.classList.remove("chang");
            card_box.classList.add("not_chang");
        }, time);
    }
}

function next_word() {
    clickable = false;
    change_time = 600;
    animation_time = 500;
    random = Math.floor(Math.random() * language_list.length);
    if (card_face == "back") {
        card_flip();
    }
    card_opacity(true, 0);
    setTimeout(function () {
        english_word.innerText = '"' + language_list[random].en_word + '"';
        english_alt_word.innerText = language_list[random].en_alt;
        turkish_word.innerText = '"' + language_list[random].tr_word + '"';
        turkish_alt_word.innerText = language_list[random].tr_alt;
    }, change_time - 100);
    card_opacity(false, change_time);
    setTimeout(function () {
        clickable = true;
    }, change_time + animation_time);
}
    

//incele
var song = tester("assets/sounds/sariyor.mp3");
song.start(0);

var volume_slider = document.getElementById("volume_slider");

function fns(value) {
    song.gainNode.gain.value = value.value / 100; // setting it to 10%
}

function tester(local = null) {
    if (local == null) {
        local = "assets/sounds/aglamalik.mp3";
    }
    const aCtx = new AudioContext();

    const gainNode = aCtx.createGain();
    gainNode.gain.value = 0.4; // setting it to 10%
    gainNode.connect(aCtx.destination);

    let source = aCtx.createBufferSource();
    source.gainNode = gainNode;
    let buf;
    fetch(local) // can be XHR as well
        .then(resp => resp.arrayBuffer())
        .then(buf => aCtx.decodeAudioData(buf)) // can be callback as well
        .then(decoded => {
            source.buffer = buf = decoded;
            source.loop = true;
            source.connect(gainNode);
        });

    return source;
}

var val = 0;
var bgs = document.getElementsByClassName("bgs")[0];
setInterval(() => {
    val = val + 1;
    if (val > 999) {
        val = 0;
    }
    bgs.style.backgroundPosition = val + "px";
}, 100);

function createSpeechSound(sound_url) {
    var audioCtx = new AudioContext();

    var url = sound_url;
    var source;
    var created_audio = new Audio(url);
    var processor = audioCtx.createScriptProcessor(2048, 1, 1);
    var meter = document.getElementById('meter');

    created_audio.addEventListener('canplaythrough', function () {
        source = audioCtx.createMediaElementSource(created_audio);
        source.connect(processor);
        source.connect(audioCtx.destination);
        processor.connect(audioCtx.destination);
    }, false);

    processor.onaudioprocess = function (evt) {
        var input = evt.inputBuffer.getChannelData(0),
            len = input.length,
            total = i = 0,
            rms;
        while (i < len) total += Math.abs(input[i++]);
        rms = Math.sqrt(total / len);
        average = (rms * 100);
    };

    return created_audio;
}