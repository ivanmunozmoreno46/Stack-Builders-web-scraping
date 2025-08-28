const path = require("path");
const controller = {};
const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://news.ycombinator.com/";

controller.scrape = async (req, res) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const entries = [];
        $("tr.athing")
            .slice(0, 30)
            .each((i, el) => {
                const title = $(el).find(".titleline").text().trim();
                const rank = parseInt($(el).find(".rank").text().replace(".", ""));
                const subtextRow = $(el).next();
                const scoreText = subtextRow.find(".score").text();

                const commentsAnchor = subtextRow.find("a").last();
                let comments = 0;
                if (commentsAnchor && commentsAnchor.text().includes("comment")) {
                    comments = parseInt(commentsAnchor.text().replace(/\D/g, "")) || 0;
                }

                const score = scoreText ? parseInt(scoreText.replace(/\D/g, "")) : null;
                entries.push({ rank, title, score, comments });
            });

        res.json({ entries });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Error during scraping", details: error.message });
    }
};

module.exports = controller;
