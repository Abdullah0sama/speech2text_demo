const player = document.getElementById('player');
const stopbtn = document.querySelector('#stopbtn');
const toggleRecordingBtn = document.querySelector('#toggleRecordingBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const submitBtn = document.querySelector('#submitBtn');

class MediaRecordHandler {
    mediaRecorder;
    chunks = [];
    stream;
    mimeType;
    canSend = false;
    audioBlob;
    setStream(stream) {
        this.stream = stream;
        console.log(this.stream, this.stream.getAudioTracks(), this.stream.getAudioTracks()[0].getConstraints())
        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm"
        });
        this.mediaRecorder.ondataavailable = this.onDataAvailable.bind(this)
        this.mediaRecorder.onstop = this.onstop.bind(this)
        this.mimeType = this.mediaRecorder.mimeType
    }

    onDataAvailable(e) {
        this.chunks.push(e.data)
    }

    async start() {
        this.canSend = false;
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
        this.canSend = true;
        this.audioBlob = new Blob(this.chunks, { type: "audio/webm" })
        setAudioSrc(this.audioBlob)
        this.chunks = []
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
submitBtn.addEventListener('click', sendAudioToServer);


function toggleRecording(e) {
    const state = mediaRecorderHandler.toggle()
    if (state == 'recording') e.target.textContent = 'pause'
    else if (state == 'paused') e.target.textContent = 'resume'
}

function setAudioSrc (audioBlob) {
    const audioUrl = window.URL.createObjectURL(audioBlob)
    const download = document.querySelector('#download')
    download.href = audioUrl
    download.download = "output"
    player.src = audioUrl
}

async function sendAudioToServer(e) {
    const audioBlob = mediaRecorderHandler.audioBlob
    const mimeType = mediaRecorderHandler.mimeType
    const base64 = await blobToBase64(audioBlob)
    fetch('/speech2textQ/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            audio: base64,
            mimeType: mimeType
        })
    })
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })
}  

function sendData(e) {
    sendAudioToServer(mediaRecorderHandler.audioBlob, mediaRecorderHandler.mimeType)
}

const blobToBase64 = blob => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
        reader.onloadend = () => {
            console.log(reader.result)
            // console.log(reader.result.split(',')[1])
        resolve(reader.result.split(',')[1]);
        };
    });
};
  