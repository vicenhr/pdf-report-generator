# PDF Report Generator

![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-built--in-003B57?logo=sqlite&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)

This is a small backend project I built as part of my backend internship at FlyRank. It's a pipeline that takes data from a SQL database, turns it into a PDF report, and serves that PDF through an API — no background jobs, everything runs inside a normal request.

## What it does

The flow is simple: query the database → build an HTML page with the results → turn that HTML into a PDF with a headless browser → save the file and hand out a link to download it. That's it. Four moves, one pipeline.

## Dataset

I reused the book data I scraped in an earlier project of mine, [Scrapper](https://github.com/vicenhr/Scrapper). So instead of made-up shop orders, this report works with 60 real books from books.toscrape.com: title, price, rating, and url.

## How to run it

1. Install dependencies:
```
npm install
```

2. Install Playwright's browser (only needed once):
```
npx playwright install chromium
```

3. Seed the database (reads `data/books.json` and fills `report.db`):
```
node src/seed.js
```

4. Start the server:
```
npm run dev
```

The server runs on `http://localhost:3000`.

## The aggregation SQL

These are the four queries behind the report, all inside `getReportData()`:

```sql
-- Total books
SELECT COUNT(*) AS total FROM books;

-- Average price
SELECT AVG(price) AS avgPrice FROM books;

-- Top 5 most expensive books
SELECT * FROM books ORDER BY price DESC LIMIT 5;

-- Books grouped by rating
SELECT rating, COUNT(*) AS total FROM books GROUP BY rating;
```

## Proof it works: generate → download

First POST generates a new report:

```
curl.exe -i -X POST http://localhost:3000/reports
```
```
HTTP/1.1 201 Created
{"id":3,"file":"/reports/3/file"}
```

Downloading it by link:

```
curl.exe -o my-report.pdf http://localhost:3000/reports/3/file
```

This downloads a real PDF, opens fine, no corrupted bytes.

Timing check — the POST takes a couple of seconds, on purpose, since there's no background job here:

```
Measure-Command { curl.exe -i -X POST http://localhost:3000/reports }
```
```
TotalSeconds : 2.1546937
```

## When would this move out of the request?

With 60 books this is fast enough nobody notices the wait. But the part that actually gets slow as data grows isn't SQLite — it's Playwright rendering the long table into a PDF. Once that table has thousands of rows, the render time adds up, and that's the point where I'd move report generation into a background job instead of making the client wait on the request.

## Asking twice, getting one

`POST /reports` checks if a report was already generated today. If one exists, it returns that same report with a `200` instead of making a new one. Send `{ "force": true }` to skip the check and generate a fresh one anyway.

This check protects against generating duplicate reports when a user double-clicks the button or the same request gets sent twice by accident — so "asking twice" only ever produces one real effect. A real-world example where a missing check like this costs money: a credit card charge on an online store. If the payment already went through and the system doesn't catch the repeated request, the customer ends up charged twice for the same purchase.

## Screenshot

![PDF Report](/img/pdf-report-example.png)

## Tech stack

- Node.js + Express
- SQLite (`node:sqlite`, built-in)
- Playwright (HTML → PDF)

## Author

**Vicente Hernández Ramos** — [@vicenhr](https://github.com/vicenhr)