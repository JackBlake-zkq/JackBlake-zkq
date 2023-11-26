import OpenAI from "openai"
import fs from "fs"
import axios from "axios"

const start = "<!-- start prompt -->"
const end = "<!-- end prompt -->"

const raw = fs.readFileSync("./README.md").toString()

const prompt = raw.slice(raw.indexOf(start) + start.length, raw.indexOf(end)).trim()

const openai = new OpenAI()

const url = (await openai.images.generate({ 
    prompt,
    model: "dall-e-3",
})).data[0].url

axios({ url, responseType: 'stream' }).then(response =>
    new Promise((resolve, reject) => {
        response.data
            .pipe(fs.createWriteStream("dalle-vis.png"))
            .on('finish', () => resolve())
            .on('error', e => reject(e));
    }),
);

