export function buildHtml(reportData, allBooks) {
    const filasTop5 = reportData.top5Expensive
        .map(book => `<tr><td>${book.title}</td><td>£${book.price}</td></tr>`)
        .join("");
    
    const books = allBooks
        .map(book => `
            <tr>
                <td>${book.title}</td>
                <td>£${book.price}</td>
                <td>${book.rating}</td>
                <td>${book.url}</td>
            </tr>
        `)
        .join("");

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                tr {
                    break-inside: avoid;
                }
                thead {
                    display: table-header-group;
                }
            </style>
        </head>
        <body>
            <h1>Book Report — ${new Date().toLocaleDateString()}</h1>
            <p>Total books: ${reportData.totalBooks}</p>
            <p>Average price: £${reportData.avgPrice.toFixed(2)}</p>
            <p>Top 5 most expensive: </p>
            <table>
                <thead>
                    <tr><th>Title</th><th>Price</th></tr>
                </thead>
                <tbody>
                    ${filasTop5}
                </tbody>
            </table>
            <p>All books: </p>
            <table>
                <thead>
                    <tr><th>Title</th><th>Price</th><th>Rating</th><th>Url</th></tr>
                </thead>
                <tbody>
                    ${books}
                </tbody>
            </table>
        </body>
        </html>
    `;
}