const path = require("path");
const controller = {};
const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://news.ycombinator.com/";

// Array to log usage
const usageLog = [];

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

controller.filteredEntries = async (req, res) => {
    const filter = req.params.filter;
    try {
        // Saving the usage log
        usageLog.push({
            timestamp: new Date().toISOString(),
            filter: filter
        });

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

        // Function to count words in a title (excluding symbols)
        const countWords = (str) => {
            return str
                .replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ]/g, "") // elimina símbolos
                .trim()
                .split(/\s+/)
                .filter(Boolean).length;
        };

        let filtered = [];
        if (filter === "long") {
            // More than 5 words, ordered by comments descending
            filtered = entries
                .filter(e => countWords(e.title) > 5)
                .sort((a, b) => b.comments - a.comments);
        } else if (filter === "short") {
            // 5 words or fewer, ordered by score descending
            filtered = entries
                .filter(e => countWords(e.title) <= 5)
                .sort((a, b) => b.score - a.score);
        } else {
            return res.status(400).json({ error: "Invalid filter" });
        }

        res.json({ entries: filtered });
    } catch (error) {
        res.status(500).json({ error: "Error during scraping", details: error.message });
    }
};

// (Opcional) Exporta el historial de uso si quieres exponerlo en una ruta
controller.usageLog = (req, res) => {
    res.json({ usage: usageLog });
};

module.exports = controller;