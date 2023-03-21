imagePaths = [];
const difficulty = {
    1: 3,
    2: 2,
    3: 1
};
let currentDifficulty = 1;

for (let i = 1; i <= 8; i++) {
    imagePaths.push("(" + i + ").jpg");
}

const randomImages = () => {
    tempArray = [...imagePaths];
    size = tempArray.length * 2;
    count = {}
    randomImageList = [];
    for (let i = 0; i < size; i++) {
        randomIndex = Math.floor(Math.random() * tempArray.length);
        randomImage = tempArray[randomIndex]
        randomImageList.push(randomImage);
        if (count[randomImage]) {
            count[randomImage]++;
        } else {
            count[randomImage] = 1;
        }

        if (count[randomImage] == 2) {
            tempArray.splice(randomIndex, 1);
        }
    }
    return randomImageList
}

randomImageList = randomImages();
const imageGrid = document.getElementById("image-grid");
let timer = document.querySelector(".timer");
timer.innerHTML= "0" + difficulty[currentDifficulty] + ":00"

for (let i = 0; i < 16; i++) {

    let imageDiv = document.createElement('div')
    imageDiv.className = "image-div"

    let imageElement = document.createElement('img');
    imageElement.className = "image";
    imageElement.classList.add("gray");

    imageElement.src = "Assets/" + randomImageList[i];
    imageDiv.appendChild(imageElement)
    imageGrid.appendChild(imageDiv);
}

function showFailure(){
    let audio = document.getElementById("audio");
    let audioSrc = document.getElementById("audio-src");
    audioSrc.src = "Assets/failure.mp3"
    audio.load();
    audio.play()
    const failureDiv = document.querySelector(".failure-screen");
    failureDiv.style.display = "block";
    const failureBtn = document.querySelector(".failure-btn");
    failureBtn.onclick = () =>{
        failureDiv.style.display = "none";
        resetTimer();
    }

}

function showVictory(){

    matches = 0;
    let audio = document.getElementById("audio");
    let audioSrc = document.getElementById("audio-src");

    const victoryDiv = document.querySelector(".victory-screen");
    const victoryBtn = document.querySelector(".victory-btn");
    if(currentDifficulty < 3){
        currentDifficulty++;
        audioSrc.src = "Assets/victory.mp3"
        audio.load();
        audio.play()
    }
    else{
        audioSrc.src = "Assets/final.mp3"
        audio.load();
        audio.play()
        victoryText = document.querySelector(".victory-text");
        victoryText.innerHTML = "You completed the game!"
        victoryBtn.innerHTML = "Play again!"
        currentDifficulty = 1;
    }
    victoryDiv.style.display = "block";

    victoryBtn.onclick = () =>{
        victoryDiv.style.display = "none";
        resetTimer();
    }
}

function countdown(elementName, minutes, seconds) {
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer() {
        msLeft = endTime - (+new Date);
        if (msLeft < 1000) {
            element.innerHTML = "Time is up!";
        } else {
            time = new Date(msLeft);
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            elementName.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
            setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
        }
    }

    endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
    updateTimer();
}

const startTimer = (element, duration) => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    countdown = setInterval(() => {
        const timeLeft = endTime - Date.now();
        const minutes = Math.floor(timeLeft / 1000 / 60);
        const seconds = Math.floor(timeLeft / 1000 % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        element.textContent = formattedTime;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            element.textContent = '00:00';
            showFailure();
        }
    })

}

const resetTimer = () =>{
    let timer = document.querySelector(".timer");
    timer.innerHTML= "0" + difficulty[currentDifficulty] + ":00"

}
const stopTimer = ()=>{
    clearInterval(countdown);
}

let grayed = true;
let firstImage;
let secondImage;
let lockImages = false;
let matches = 0;
function revealImage() {
    if(lockImages)
        return;
    if(this === firstImage)
        return;
    this.classList.remove("gray")
    if (grayed) {
        firstImage = this
        grayed = false; 
        return;
    }
    secondImage = this;
    checkForMatch();
}

function checkForMatch(){

    let isMatch = firstImage.src === secondImage.src;
    isMatch ? disableImages() : grayImage();
}

function disableImages(){
    matches++;
    if(matches == 8){
        stopTimer();
        showVictory();
    }
    firstImage.removeEventListener("click", revealImage);
    secondImage.removeEventListener("click", revealImage);
    resetImages();
}
function grayImage(){
    lockImages = true;
    setTimeout(() => {
        firstImage.classList.add('gray');
        secondImage.classList.add('gray');
        
        resetImages();
      }, 500);
}
function resetImages(){
    grayed = true;
    lockImages = false;
    firstImage = null;
    secondImage = null;
}


function startGame() {
    let failureScreen = document.querySelector(".failure-screen");
    failureScreen.style.display = "none";
    let audio = document.getElementById("audio");
    let audioSrc = document.getElementById("audio-src");

    audioSrc.src = "Assets/theme.mp3"
    audio.load();    
    audio.play();
    let imageElements = document.querySelectorAll(".image");
    imageElements.forEach((item) => {
        item.classList.add("gray")
    })

    const time = difficulty[currentDifficulty];
    let timerElement = document.querySelector(".timer");
    startTimer(timerElement, time * 60);
    imageElements.forEach(image => image.addEventListener("click", revealImage))
    if (matches == 8){
    }

}



// while(1){
//     gameLoop();
// }