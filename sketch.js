/*
    IDEAS
    Aggie Simulator 2023
    5 State Changes
    1. Feed Rev - clicking the feed button will display a bowl of food emoticon and then a heart.

    Complex User Interaction - Upload an image of your own pet
*/

let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 800;
let COLOR_STATUS_BAR_BACKGROUND;
let COLOR_STATUS_BAR_FILLED;
let COLOR_MAROON;

let petImage;
let foodBowlImage;
let foodHeartImage;

let food = 0.5;
let happiness = 0.5;
let age = 0.1;

let petName = 'Rune Bear';
let lifespan = 60; // how many seconds the pet lives

function preload() {
    petImage = loadImage('assets/runebear.png');
    foodBowlImage = loadImage('assets/foodbowl.png');
    foodHeartImage = loadImage('assets/foodheart.png');
}

function setup() {
    COLOR_STATUS_BAR_BACKGROUND = color(220);
    COLOR_STATUS_BAR_FILLED = color(0, 255, 0);
    // aggie maroon. source:
    // https://brandguide.tamu.edu/web/web-color-palette.html
    COLOR_MAROON = color(80, 0, 0);

    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    feedButton = createButton('Feed your pet');
    feedButton.position(20, CANVAS_HEIGHT - 45);
    feedButton.mousePressed(feed);

    kissButton = createButton('Kiss your pet');
    kissButton.position(125, CANVAS_HEIGHT - 45);
    kissButton.mousePressed(kiss);

    // aging
    agingInterval = 100 // how often to age in milliseconds
    setInterval(() => {
        let secondsElapsed = agingInterval / 1000;
        age += secondsElapsed / lifespan;
    }, agingInterval)
}


showingFoodBowl = false
showingFoodHeart = false
function feed() {
    food += 0.1
    // Display a bowl of food emoticon and then a heart.
    showingFoodBowl = true
    setTimeout(() => {showingFoodBowl = false; showingFoodHeart = true;}, 1500)
    setTimeout(() => {showingFoodHeart = false}, 3000)
}

function kiss(){

}

function draw()
{
    background(COLOR_MAROON);

    // draw title
    fill(255);
    textSize(32);
    text('Aggie Simulator 2023', 25, 35);

    // pet name
    textSize(50)
    text(petName, 375, 75)

    // draw status bars
    textSize(14)
    text('Food', 25, 55)
    text('Happiness', 25, 75)
    text('Senescence', 25, 95)
    // draw backgrounds
    fill(COLOR_STATUS_BAR_BACKGROUND)
    rect(125, 45, 200, 10)
    rect(125, 65, 200, 10)
    rect(125, 85, 200, 10)
    // fill in
    fill(COLOR_STATUS_BAR_FILLED)
    rect(125+2, 45+2, 200 * food, 10-4)
    rect(125+2, 65+2, 200 * happiness, 10-4)
    rect(125+2, 85+2, 200 * (1-age), 10-4)

    // draw pet
    image(petImage, 50, 125, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 200);

    //displayGameover("Through your fault and your alone, your pet " + petName + "\nhas succumbed to starvation and died a cruel death.")
    //displayGameover("The cold tendrils of time have at last ensnared your wretched beast.\nYour pet " + petName + " has succumbed to old age.")
    if(food > 1)
        displayGameover("You have overfed your pet " + petName + ".\nFor this gluttony, the beast has been condemned to death.")

    // draw emoticons
    if(showingFoodBowl)
        image(foodBowlImage, 75, 150, 150, 150);
    if(showingFoodHeart)
        image(foodHeartImage, 75, 150, 150, 150);
}

function displayGameover(reason) {
    fill(0)
    rect(75, 75, CANVAS_WIDTH - 150, CANVAS_HEIGHT - 150)
    fill(255)
    textSize(50)
    text('DECEASED', 100, 150)

    textSize(20)
    text(reason, 100, 200)
}

function loadCamera() {
}