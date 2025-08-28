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
            const rank = parseInt($(el).find(".rank").text().replace(".", ""));
            // Access the next row for the score and comments
            const subtextRow = $(el).next();
            const scoreText = subtextRow.find(".score").text();
            
            // Search for the last anchor tag which usually contains the comments
            const commentsAnchor = subtextRow.find('a').last();
            let comments = 0;
            if (commentsAnchor && commentsAnchor.text().includes("comment")) {
                // Extract number of comments, default to 0 if "discuss" or no number found
                comments = parseInt(commentsAnchor.text().replace(/\D/g, "")) || 0;
            }

            const score = scoreText ? parseInt(scoreText.replace(/\D/g, "")) : null;
            entries.push({rank, title, score, comments });
        });

        console.log("Found entries:", entries);
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}

scrape();