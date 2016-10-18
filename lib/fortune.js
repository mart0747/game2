var fortunes = [
    "conquer your fears or they will conquer you",
    "Rivers need springs",
    "Do not fear what you do not know",
    "progress not perfection",
];

exports.getFortune = function() {
    var idx = Math.floor(Math.random() * fortunes.length);
    return fortunes[idx];
}