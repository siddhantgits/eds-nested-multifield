// cards.js
// This function is called automatically by EDS for every <div class="cards"> found on the page.
// "block" is the DOM element: <div class="cards">...</div>

export default function decorate(block) {
    // 1. Find all the card rows (each direct child div is one card item)
    const cardRows = [...block.querySelectorAll(':scope > div')];

    // 2. For each row, restructure the HTML
    cardRows.forEach((row) => {
        // Add a class so we can style it
        row.classList.add('card');

        // Get all the columns in this row
        const [imageCol, titleCol, descriptionCol, linkCol] = [...row.querySelectorAll(':scope > div')];

        // Optional: add classes to each column for easier CSS targeting
        if (imageCol) imageCol.classList.add('card-image');
        if (titleCol) titleCol.classList.add('card-title');
        if (descriptionCol) descriptionCol.classList.add('card-description');
        if (linkCol) linkCol.classList.add('card-link');
    });
}