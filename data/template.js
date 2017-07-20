function generate({
    title,
    price,
    img
}) {
    const template = {
        "color": "#36a64f",
        "pretext": `${title}`,
        "title": `${title}`,
        "title_link": `http://www.alogiaocom.com/index.php`,
        "text": `${price}`,
        "image_url": `${img}`,
        "thumb_url": `${img}`,
        "footer": "Hanna Order"
    }
    return template;
}

function generateReceipt({
    name,
    pic,
    food
}) {
    const template = {
        "color": "#36a64f",
        "title": `${name}`,
        "text": `${food}`,
        "footer": "Hanna lunch"
    }
    return template;
}

module.exports = {
    generate,
    generateReceipt,
};