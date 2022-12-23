import express from 'express'
import path from 'path'
import { SpeechClient } from '@google-cloud/speech'
import s from './speech2text-demo-372421-fb213717a34a.json'
const app = express();

app.use(express.json({
    limit: '10mb'
}))

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile('views/main.html', { root: __dirname });
})

app.post('/speech2textQ/check', (req, res) => {
    transcriptSpeech(req.body)
    res.status(200).end();

})
app.listen(3000, () => {
    console.log('Server Has started!!!')
})


async function transcriptSpeech(data: audioRequest) {
    console.log(data)
    const speech = new SpeechClient({
        credentials: s
    })

    const audio = {
        content: data.audio
    }
    const config: any = {
        languageCode: 'en-US',
        encoding: "OGG_OPUS",
        sampleRateHertz: '48000'
    }
    const request = {
        audio,
        config
    }

    const [response] = await speech.recognize(request)
    if (!response.results) return;
    console.log(response)
    const transcription = response.results
    .map(result => result.alternatives![0].transcript)
    .join('\n');
    console.log(`Transcription: ${transcription}`);
        

}


interface audioRequest {
    audio: string,
    mimeType: string
}