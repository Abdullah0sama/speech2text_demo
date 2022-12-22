import express from 'express'
import path from 'path'

const app = express();
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile('views/main.html', { root: __dirname });
})

app.listen(3000, () => {
    console.log('Server Has started!!!')
})