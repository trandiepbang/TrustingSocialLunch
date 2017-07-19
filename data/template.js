function generate({
    title,
    price,
    img
}) {
    const template = {
        "fallback": "Có lỗi xảy ra",
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
module.exports = {
    generate,
};