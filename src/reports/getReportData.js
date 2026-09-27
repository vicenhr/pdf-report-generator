import { db } from '../db/db.js';

export function getReportData(){
    const totalBooks = db.prepare('SELECT COUNT(*) AS total FROM books').get();
    const avgPrice = db.prepare('SELECT AVG(price) AS avgPrice FROM books').get();
    const top5Expensive = db.prepare('SELECT * FROM books ORDER BY price desc LIMIT 5').all();
    const byRating = db.prepare('SELECT rating, COUNT(*) AS total FROM books GROUP BY rating').all();

    return{
        totalBooks,
        avgPrice,
        top5Expensive,
        byRating
    };
}

console.log(getReportData());