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
    // const template = {
    //     "color": "#36a64f",
    //     "title": `${name}`,
    //     "text": `${food}`,
    //     "footer": "Hanna lunch"
    // }
    return `${name} - ${food}`;
}

module.exports = {
    generate,
    generateReceipt,
};