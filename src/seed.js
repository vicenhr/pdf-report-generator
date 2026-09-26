import { db } from './db/db.js';
import { insertBook, getAllBooks } from './db/db.js';
import { ratingToNumber } from './utils/ratingToNumber.js';
import fs from "node:fs";
import path from "node:path";

const booksPath = path.join(import.meta.dirname, "..", "data/books.json");

async function asyncCall() {
    const books = JSON.parse(fs.readFileSync(booksPath, "utf-8"));
    db.exec(`DELETE FROM books`);
    books.forEach(element => {
        insertBook({
            title: element.title, 
            price: element.price_gbp, 
            rating: ratingToNumber(element.rating_text), 
            url: element.product_url
        });
    });
    console.log(getAllBooks().length);
}

asyncCall();