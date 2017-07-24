function generate({
    title,
    price
}) {
    return `${title} - ${price} VND `;
}

function generateReceipt({
    name,
    pic,
    food
}) {
    return `${name} - ${food}`;
}

module.exports = {
    generate,
    generateReceipt,
};