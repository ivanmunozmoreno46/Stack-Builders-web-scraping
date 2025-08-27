const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://news.ycombinator.com/";

async function scrape() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const entries = [];
        // Every entry is located in a row <tr class="athing">
        $("tr.athing").slice(0, 30).each((i, el) => {
            const title = $(el).find(".titleline").text().trim();
            // Access the next row for the score with .next()
            const subtextRow = $(el).next();
            const scoreText = subtextRow.find(".score").text();
            const score = scoreText ? parseInt(scoreText.replace(/\D/g, "")) : null;
            entries.push({ title, score });
        });

        console.log("Found entries:", entries);
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}

scrape();