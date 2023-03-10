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

let STATUS_INPLAY = "STATUS_INPLAY";
let STATUS_UPLOADING = "STATUS_UPLOADING";
let STATUS_CUSTOMIZE = "STATUS_CUSTOMIZE";
let STATUS_GAMEOVER = "STATUS_GAMEOVER";
let gameStatus = STATUS_INPLAY;

let petImage;
let foodBowlImage;
let heartImage;

let pastPetsImage;

let showingFoodBowl = false
let showingHeart = false

let showHat = false;
let showTie = false;

let showStats = false;
let showStatsButton;
let showPastPets = false;
let showPastPetsButton;
let hungerIcon;
let happinessIcon;
let ageIcon;

let startButton;
let resetGameButton;
let fileButton;
let nameInput;

let food = 0.5;
let happiness = 0.5;
let age = 0.0;

let petName = 'Rune Bear';
let lifespan = 45; // how many seconds the pet lives
let hungerspeed = 60; // how many seconds it takes for the pet to starve

let gameoverMessage = "The game is over";

function preload() {
    petImage = loadImage('assets/runebear.png');
    foodBowlImage = loadImage('assets/foodbowl.png');
    heartImage = loadImage('assets/foodheart.png');

    hungerIcon = loadImage('assets/hungericon.png');
    happinessIcon = loadImage('assets/hapinessicon.png');
    ageIcon = loadImage('assets/ageicon.png');

    hatIcon = loadImage('assets/hat.png');
    tieIcon = loadImage('assets/bowtie.png');

    pastPetsImage = loadImage('assets/pastpets.png');
}

function setup() {
    COLOR_STATUS_BAR_BACKGROUND = color(220);
    COLOR_STATUS_BAR_FILLED = color(0, 255, 0);
    // aggie maroon. source:
    // https://brandguide.tamu.edu/web/web-color-palette.html
    COLOR_MAROON = color(80, 0, 0);

    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    showStatsButton = createButton('Toggle Stats');
    showStatsButton.position(CANVAS_WIDTH-20 - showStatsButton.width, 20);
    showStatsButton.mousePressed(() => showStats = !showStats);

    showPastPetsButton = createButton('Toggle Past Pets');
    showPastPetsButton.position(CANVAS_WIDTH-20 - showPastPetsButton.width - 20 - showStatsButton.width, 20);
    showPastPetsButton.mousePressed(() => showPastPets = !showPastPets);

    feedButton = createButton('Feed your pet');
    feedButton.position(20, CANVAS_HEIGHT - 45);
    feedButton.mousePressed(feed);

    kissButton = createButton('Kiss your pet');
    kissButton.position(125, CANVAS_HEIGHT - 45);
    kissButton.mousePressed(kiss);

    customizeButton = createButton('Customize your pet');
    customizeButton.position(225, CANVAS_HEIGHT - 45);
    customizeButton.mousePressed(customMenu);

    uploadButton = createButton('Upload a pet');
    uploadButton.position(CANVAS_WIDTH - 150, CANVAS_HEIGHT - 45);
    uploadButton.mousePressed(mockUpload);

    resetGameButton = createButton('New Game');
    resetGameButton.position(200, 500)
    resetGameButton.mousePressed(resetGame);

    startButton = createButton('Begin your pet\'s life!');
    startButton.position(200, 500)
    startButton.mousePressed(changePet);

    hatButton = createButton('Toggle Hat');
    hatButton.position(50, 10)
    hatButton.mousePressed(() => showHat = !showHat);

    tieButton = createButton('Toggle Bowtie');
    tieButton.position(50, 50)
    tieButton.mousePressed(() => showTie = !showTie);

    cancelCustomButton = createButton('Exit');
    cancelCustomButton.position(50, 100)
    cancelCustomButton.mousePressed(resetGame);

    fileButton = createButton('Upload file');
    fileButton.position(100, 300)

    nameInput = createInput();
    nameInput.position(225, 400);
    nameInput.value('Reveille');

    // decrease stats over time
    decayInterval = 100 // how often to alter stats, in milliseconds
    setInterval(() => {
        let secondsElapsed = decayInterval / 1000;
        age += secondsElapsed / lifespan;
        food -= secondsElapsed / hungerspeed;
        happiness -= secondsElapsed / 180;
    }, decayInterval)

    resetGame();
}

function resetGame() {
    food = 0.5;
    happiness = 0.5;
    age = 0.0;
    gameStatus = STATUS_INPLAY;
    resetGameButton.hide();
    startButton.hide();
    fileButton.hide();
    hatButton.hide();
    tieButton.hide();
    cancelCustomButton.hide();
    nameInput.hide();
}

function feed() {
    food += 0.05
    
    showingFoodBowl = true
    setTimeout(() => {showingFoodBowl = false}, 1500)
}

function kiss(){
    happiness += 0.1
    // Display a bowl of food emoticon and then a heart.
    showingHeart = true
    setTimeout(() => {showingHeart = false}, 1500)
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

    // draw pet
    image(petImage, 50, 125, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 200);


    if(gameStatus === STATUS_INPLAY) {
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
        rect(125+2, 45+2, 196 * food, 10-4)
        rect(125+2, 65+2, 196 * happiness, 10-4)
        rect(125+2, 85+2, 196 * (1-age), 10-4)

        if(food > 1) {
            endGame("You have overfed your pet " + petName + ". For this gluttony, the beast has been condemned to death.");
        }
        else if(food < 0) {
            endGame("Through your fault alone, your pet " + petName + " has succumbed to starvation and died.");
        }
        if(age > 1) {
            endGame("The cold maw of time has at last devoured your pet " + petName + " raw. Your pet has expired of old age.");
        }
        if(happiness < 0) {
            endGame("Your pet " + petName + " has been driven to madness by your neglect, and has killed itself out of despair.");
        }
        if(happiness > 1) {
            endGame("Your pet " + petName + " has become over-excited and died of a heart attack.");
        }

        // draw emoticons
        if(showingFoodBowl)
            image(foodBowlImage, 75, 150, 150, 150);
        if(showingHeart)
            image(heartImage, 75, 150, 150, 150);

        // show stats
        if(showStats) {
            fill(0)
            rect(CANVAS_WIDTH-20-150,20,150,150);
            iconX = CANVAS_WIDTH-150-20+10;
            image(hungerIcon, iconX,40, 40, 40)
            image(happinessIcon, iconX,80, 40, 40)
            image(ageIcon, iconX,120, 40, 40)
            fill(255)
            textSize(40)
            textX = iconX + 40;
            // write rounded stats as percentage
            text(food.toFixed(2)*100 + "%", textX, 80);
            text(happiness.toFixed(2)*100 + "%", textX, 120);
            text(age.toFixed(2)*100 + "%", textX, 160);
        }

        if(showPastPets) {
            image(pastPetsImage,0,0);
        }

        // tooltips
        if(mouseX > 125 - 5 && mouseX < 125 + 200 + 5 && mouseY > 45 - 5 && mouseY < 45 + 10 + 5) {
            push();
            fill(255);
            stroke(0);
            textSize(20);
            strokeWeight(5);
            text("Your pet " + petName + " requires food to function: " + food.toFixed(2)*100 + "%", mouseX, mouseY)
            pop();
        }
        if(mouseX > 125 - 5 && mouseX < 125 + 200 + 5 && mouseY > 65 - 5 && mouseY < 65 + 10 + 5) {
            push();
            fill(255);
            stroke(0);
            textSize(20);
            strokeWeight(5);
            text("Optionally, you may keep your pet " + petName + " happy: " + happiness.toFixed(2)*100 + "%", mouseX, mouseY)
            pop();
        }
        if(mouseX > 125 - 5 && mouseX < 125 + 200 + 5 && mouseY > 85 - 5 && mouseY < 85 + 10 + 5) {
            push();
            fill(255);
            stroke(0);
            textSize(20);
            strokeWeight(5);
            text("Senescence is the process by which biological agents die of old age.\nThere is nothing you can do to mitigate this: " + (1-age).toFixed(2)*100 + "%", mouseX, mouseY-20)
            pop();
        }
    }

    if(gameStatus === STATUS_UPLOADING){
        displayUpload();
    }

    if(gameStatus === STATUS_GAMEOVER) {
        displayGameover();
    }

    if(gameStatus === STATUS_CUSTOMIZE) {
        fill(0)
        rect(0,0,150,150);
        iconX = 0;
        image(hatIcon, iconX,0, 40, 40)
        image(tieIcon, iconX,40, 40, 40)
        fill(255)
        textSize(40)
        textX = iconX + 40;
        // write rounded stats as percentage
    }

    if(showHat){
        image(hatIcon, 300, 200, 100,100);
    }

    if(showTie){
        image(tieIcon, 375, 500, 80,80);
    }
}

function endGame(reason) {
    gameStatus = STATUS_GAMEOVER;
    gameoverMessage = reason;
    resetGameButton.show();
}

function customMenu(){
    gameStatus = STATUS_CUSTOMIZE;
    hatButton.show();
    tieButton.show();
    cancelCustomButton.show();
}

function mockUpload(){
    gameStatus = STATUS_UPLOADING;
    startButton.show();
    fileButton.show();
    nameInput.show();
}

function changePet(){
    petImage = loadImage('assets/reveille.jpeg')
    petName = 'Reveille'
    resetGame();
}

function displayUpload() {
    fill(0)
    rect(75, 75, CANVAS_WIDTH - 150, CANVAS_HEIGHT - 150)
    fill(255)
    textSize(50)
    text('UPLOAD YOUR PET', 100, 150)

    textSize(20)
    text("Accepts jpeg and png files", 100, 200, CANVAS_WIDTH - 150 - 100, CANVAS_HEIGHT - 200)
    text("reveille.jpeg", 200, 300, CANVAS_WIDTH - 150 - 100, CANVAS_HEIGHT - 200)
    text("Pet's Name", 100, 400, CANVAS_WIDTH - 150 - 100, CANVAS_HEIGHT - 200)
}

function displayGameover() {
    fill(0)
    rect(75, 75, CANVAS_WIDTH - 150, CANVAS_HEIGHT - 150)
    fill(255)
    textSize(50)
    text('DECEASED', 100, 150)

    textSize(20)
    text(gameoverMessage, 100, 200, CANVAS_WIDTH - 150 - 100, CANVAS_HEIGHT - 200)
}