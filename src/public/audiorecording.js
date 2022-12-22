const player = document.getElementById('player');
const stopbtn = document.querySelector('#stopbtn');
const toggleRecordingBtn = document.querySelector('#toggleRecordingBtn');
const pauseBtn = document.querySelector('#pauseBtn');

class MediaRecordHandler {
    mediaRecorder;
    chunks = [];
    stream;
    setStream(stream) {
        this.stream = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = this.onDataAvailable.bind(this)
        this.mediaRecorder.onstop = this.onstop.bind(this)
    }

    onDataAvailable(e) {
        this.chunks.push(e.data)
    }

    async start() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia supported.");
            try {
                const stream = await navigator.mediaDevices.getUserMedia(contraint);
                console.log('Got user persmission! :D');
                this.setStream(stream)
            } catch (err) {
                console.log('Something went wrong', err)
            }
        }
    }
    async record(e) {
        await this.start()
        this.mediaRecorder.start();
        console.log('Record started status: ', this.mediaRecorder.state)
    }

    toggle(e) {
        if (this.mediaRecorder.state == 'paused') {
            this.mediaRecorder.resume();
        } else if (this.mediaRecorder.state == 'recording') {
            this.mediaRecorder.pause();
        }
        console.log(`Toggle statue: ${this.mediaRecorder.state}`)
        return this.mediaRecorder.state
    }

    
    async onstop(e) {
        console.log('Record stopped status: ', this.mediaRecorder.state)
        console.log('stopped', this.chunks)
        setAudioSrc(this.chunks)
        this.chunks = []
        this.stopStream();
    }

    stop() {
        this.mediaRecorder.stop();
        this.stopStream();
    }
    stopStream() {
        this.stream.getTracks().forEach( track => track.stop() );
    }
}

const mediaRecorderHandler = new MediaRecordHandler();

recordbtn.addEventListener('click', mediaRecorderHandler.record.bind(mediaRecorderHandler));
stopbtn.addEventListener('click', mediaRecorderHandler.stop.bind(mediaRecorderHandler));
toggleRecordingBtn.addEventListener('click', toggleRecording)
const contraint = {
    audio: true
}



function toggleRecording(e) {
    const state = mediaRecorderHandler.toggle()
    if (state == 'recording') e.target.textContent = 'pause'
    else if (state == 'paused') e.target.textContent = 'resume'
}

function setAudioSrc (chunks) {
        const audioBlob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
        const audioUrl = window.URL.createObjectURL(audioBlob)
        player.src = audioUrl
    }