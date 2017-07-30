function generate({
    title,
    index,
    price
}) {
    return ` # ${index} - ${title} - ${price} VND`;
}

function generateReceipt({
    name,
    food
}) {
    return `${name} - ${food}`; 
}

module.exports = {
    generate,
    generateReceipt,
};