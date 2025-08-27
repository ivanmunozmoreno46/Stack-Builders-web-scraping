const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://news.ycombinator.com/";

async function scrape() {
    try {
        // HTTP request
        const { data } = await axios.get(url);

        // Load HTML into cheerio
        const $ = cheerio.load(data);

        // TEST: Extract and log the title
        const titles = [];
        $(".hnname").each((i, el) => {
            titles.push($(el).text().trim());
        });
        console.log("Títulos encontrados:", titles);
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}


scrape();