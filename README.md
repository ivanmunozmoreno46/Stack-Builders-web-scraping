# Stack-Builders-web-scraping

A web scraping exercise

## Description

This project scrapes the main page of Hacker News, allowing you to filter and query news entries through an API built with Node.js and Express.

## Usage

Start the server:

```bash
node src/app.js
```
or with nodemon:
```bash
nodemon src/app.js
```

## Main Endpoints

- `GET /scrape`  
  Returns the first 30 Hacker News entries with title, score, and comments.

- `GET /scrape/long`  
  Returns entries with more than 5 words in the title, sorted by number of comments.

- `GET /scrape/short`  
  Returns entries with 5 words or fewer in the title, sorted by score.

- `GET /log`  
  Returns the usage history of the filters (timestamp and filter used).

## Notes

- Usage data is stored in memory (cache) and will be lost when the server restarts.
- Scraping is performed in real time each time the `/scrape` endpoint is hit.