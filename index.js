let windowHeight;
let windowWidth;
let canvasWidth;
let canvasHeight;
let FRAME_RATE = 60;
let score= 0;
let difficulty =1;
let missileSpawnTime =9000;
let lastSpawn = 0;
let gameStarted = false;
let gameEnded = false;
let missile_images = [
    'https://cdn.glitch.com/dfc8b693-bd17-4d21-9139-26bd8b54df55%2Fmissile_1.png?v=1575659381214',
    'https://cdn.glitch.com/dfc8b693-bd17-4d21-9139-26bd8b54df55%2Fmissile_2.png?v=1575659381917',
    'https://cdn.glitch.com/dfc8b693-bd17-4d21-9139-26bd8b54df55%2Fmissile_3.png?v=1575659384206',
    'https://cdn.glitch.com/dfc8b693-bd17-4d21-9139-26bd8b54df55%2Fmissile_4.png?v=1575659389403'

];
let OverAll_Transition = {
    x: 0,
    y: 0
}
let prevMousePosition = {
    x: -1,
    y: -1,
}
let idCount = 0;

let prevScore = 0;
let bestScore = 0;

let aircraft = null;
let missiles = [];
let healthBar = null;
let banner = null;
let health_value_elem = null;
let fake_heli = null;
let fake_heli_initation = 0;
let ECM_WAIT = 15000;
let background_img = null;
let repair = null;
let sound = null;
let crash = null;
let crash_image;
let counterMeasures = 0;
let repairsCount = 0;
function preload()
{
    sound = loadSound('https://cdn.glitch.com/dfc8b693-bd17-4d21-9139-26bd8b54df55%2Fsound.mp3?v=1575661477586');
    crash = loadSound('https://cdn.glitch.com/dfc8b693-bd17-4d21-9139-26bd8b54df55%2Fgameover.mp3?v=1575661465860');
}
function setup()
{
    crash_image=loadImage('https://cdn.glitch.com/dfc8b693-bd17-4d21-9139-26bd8b54df55%2Fartyom-liner-broken.jpg?v=1575660441896');
    background_img = loadImage('https://i.imgur.com/T6AddN6.jpg');
    banner = loadImage('https://i.imgur.com/2oup8Mj.png');
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    canvasWidth = windowWidth*0.8;
    canvasHeight = windowHeight*0.9;
    repair = {};
    repair.image = loadImage('https://i.imgur.com/8YJzd30.png');
    repair.info = null;
    repair.width = canvasWidth*0.05;
    repair.height = canvasHeight*0.05;
    repair.last_repair = 0;
    let canvas =  createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch-holder');


    frameRate(FRAME_RATE);
    background(200, 200, 200);
    healthBar = document.getElementById('health');
    health_value_elem = document.getElementById('health_value');
    initGame();
}
function initGame() {

      counterMeasures = 0;
    repairsCount = 0;
    aircraft = {};
    aircraft.velocity  = 4;
    aircraft.isHelo=true;
    aircraft.heading=0;
    aircraft.position={};
    aircraft.position.x = canvasWidth/2;
    aircraft.position.y = canvasHeight/2;
    aircraft.image = loadImage('https://i.imgur.com/sPK2N7B.png');
    aircraft.fake_image = loadImage('https://i.imgur.com/1ZPwIgy.png');

    aircraft.width  = windowWidth*0.05;
    aircraft.height =windowWidth*0.03;
    aircraft.rotors = loadImage('https://i.imgur.com/lzJ09f2.png');
    aircraft.fakerotors = loadImage('https://i.imgur.com/fGGbnCE.png');
    aircraft.rotorHeading=0;
    aircraft.health=100;
    aircraft.maxHealth=100;
    healthBar.setAttribute('value', aircraft.health);
    healthBar.setAttribute('max', aircraft.maxHealth);

    let missile = {};
    missile.position=
        {
            x: 10,
            y: 10,

        };
    missile.velocity=2;
    missile.image = loadImage('https://i.imgur.com/gZSRNJY.png');
    missile.heading=0;
    missile.width=windowWidth*0.03;
    missile.height=windowHeight*0.03;
    missiles.push(missile);


    let missile2 = {};
    missile2.position=
        {
            x: windowWidth*1.6,
            y: -20,

        };
    missile2.velocity=2;
    missile2.image = loadImage('https://i.imgur.com/gZSRNJY.png');
    missile2.heading=0;
    missile2.width=windowWidth*0.03;
    missile2.height=windowHeight*0.03;
    missiles.push(missile);


    let missile3 = {};
    missile3.position=
        {
            x: -30,
            y: windowHeight*1.2,

        };
    missile3.velocity=2;
    missile3.image = loadImage('https://i.imgur.com/gZSRNJY.png');
    missile3.heading=0;
    missile3.width=windowWidth*0.03;
    missile3.height=windowHeight*0.03;
    missiles.push(missile3);


    let missile4 = {};
    missile4.position=
        {
            x: windowWidth*1.1,
            y: windowHeight*1.1,

        };
    missile4.velocity=2;
    missile4.image = loadImage('https://i.imgur.com/gZSRNJY.png');
    missile4.heading=0;
    missile4.width=windowWidth*0.03;
    missile4.height=windowHeight*0.03;
    missiles.push(missile4);
}

function draw() {


    background(200, 200, 200);
    if(gameStarted == false && gameEnded==false )
    {
        image(banner, 100, canvasHeight*0.10, canvasWidth*0.8, canvasHeight*0.5);
        textSize(canvasHeight/10);
        text('SEAD', canvasWidth*0.4, canvasHeight*0.7);
        fill(0, 102, 153);
        textSize(canvasHeight/15);
        text('Suppression of Enemy Air Defences', canvasWidth*0.2, canvasHeight*0.756);
        fill(0, 102, 153);

        textSize(canvasHeight/20);
        text('Keep enemy missiles busy as long as you can', canvasWidth*0.2, canvasHeight*0.9);
        fill(255, 255, 255);

        textSize(canvasHeight/26);
        text('Click to continue', canvasWidth*0.8, canvasHeight*0.96);
        fill(255, 255, 255);

        if(gameEnded)
        {
            textSize(canvasHeight/26);
            text('Previous Score: ' + parseInt( prevScore )+ '. Best: ' +parseInt( bestScore), canvasWidth*0.1, canvasHeight*0.96);
            fill(255, 255, 255);
        }
    }
    else if(gameStarted == true && gameEnded == false)
    {

        if(!sound.isPlaying())
        {
            sound.play();
        }
        if(!crash.isPlaying())
        {

            crash.stop();
        }
        image(background_img, 0, 0, canvasWidth*2, canvasHeight*2);

        let angle = 0;//
        textSize(canvasHeight/40);
        text("Best Score: " + parseInt( bestScore ), 20, 30);
        fill(255, 255, 255);
        if(repair.info != null)
        {
            let x= repair.info.position.x -repair.width;
            let y = repair.info.position.y -repair.height;
            translate(x, y);
            rotate(0);
            imageMode(CENTER);

            image(repair.image, 0, 0, repair.width, repair.height);
            rotate(-0);
            translate(-x, -y);
            if(millis() - repair.info.initiation > 5000)
            {
                repair.info = null;
                repair.last_repair = millis();
            }
            else {
                let xCollide =   ( repair.info.position.x <=  aircraft.position.x + aircraft.width  &&
                    repair.info.position.x + repair.width >= aircraft.position.x);
                let yCollide =    repair.info.position.y <=  aircraft.position.y + aircraft.height  &&
                    repair.info.position.y + repair.height >= aircraft.position.y;

                console.log("REPAIR: ", repair.info.position, "Aircraft: ", aircraft.position);
                if(xCollide && yCollide)
                {
                    repairsCount++;
                    aircraft.health += 10;
                    if(aircraft.maxHealth<aircraft.health)aircraft.health=aircraft.maxHealth;
                    repair.info = null; repair.info = null;
                    repair.last_repair = millis();
                }
            }
        }
        else  if(millis() - repair.last_repair > 15000)
        {
            repair.info ={};
            repair.info.initiation = millis();
            repair.info.position = {};
            let randomPostionX = Math.random() * canvasWidth;
            let randomPositionY = Math.random() * canvasHeight;
            repair.info.position.x = randomPostionX;
            repair.info.position.y = randomPositionY;

        }

        if(fake_heli != null)
        {
            text("Counter Measures 'ACTIVE'", windowWidth*0.5, 30);
        }
        else
        {
            if(millis() - fake_heli_initation > ECM_WAIT)
            {
                text("Counter Measures 'READY'", windowWidth*0.5, 30);
            }
            else {
                text("Counter Measures ready in " + parseInt((ECM_WAIT - (millis() - fake_heli_initation))/1000) + 's', windowWidth*0.5, 30);
            }
        }


        if(fake_heli != null)
        {
            translate(fake_heli.position.x, fake_heli.position.y);
            imageMode(CENTER);
            rotate(fake_heli.heading);
            image(fake_heli.image, 0, 0, fake_heli.width, fake_heli.height);
            fake_heli.rotorHeading+= 0.1;
            rotate(fake_heli.rotorHeading);

            image(fake_heli.rotors, 0, 0, fake_heli.width, fake_heli.height);
            rotate(-fake_heli.rotorHeading);
            rotate(-fake_heli.heading);
            translate(-fake_heli.position.x, -fake_heli.position.y);



            let deltaX = fake_heli.velocity * cos(fake_heli.heading);
            let deltaY = fake_heli.velocity * sin(fake_heli.heading);
            fake_heli.position.x+=deltaX;
            fake_heli.position.y+=deltaY;

            let time_passed = (millis() - fake_heli.time) / 1000;
            if(time_passed > 5)
            {
                fake_heli=null;
            }
        }

 

        translate(aircraft.position.x, aircraft.position.y);
        imageMode(CENTER);
        rotate(aircraft.heading);
        if(fake_heli != null) {
            image(aircraft.fake_image, 0, 0, aircraft.width, aircraft.height);

        }
        else {

            image(aircraft.image, 0, 0, aircraft.width, aircraft.height);
        }
        aircraft.rotorHeading+= 0.1;
        rotate(aircraft.rotorHeading);

        image(aircraft.rotors, 0, 0, aircraft.width, aircraft.height);
        rotate(-aircraft.rotorHeading);
        rotate(-aircraft.heading);
        translate(-aircraft.position.x, -aircraft.position.y);

        angle = atan2(mouseY - aircraft.position.y, mouseX - aircraft.position.x);



        let deltaX = aircraft.velocity * cos(aircraft.heading);
        let deltaY = aircraft.velocity * sin(aircraft.heading);

        let dx = aircraft.position.x - mouseX;
        let dy = aircraft.position.y - mouseY;
        let distance = Math.sqrt((dx*dx)+(dy*dy));
        let prevHeading = aircraft.heading;

       
        if(distance<= aircraft.velocity)
        {
            aircraft.position.x = mouseX;
            aircraft.position.y = mouseY;
            // aircraft.heading=prevHeading;
        }
        else
        {
            aircraft.position.x+=deltaX;
            aircraft.position.y+=deltaY;
            aircraft.heading=angle;
        }


        
        for(i = 0; i < missiles.length; i++)
        {

            translate(missiles[i].position.x, missiles[i].position.y);
            imageMode(CENTER);
            rotate(missiles[i].heading);
            image(missiles[i].image, 0, 0, missiles[i].width, missiles[i].height);
            rotate(-missiles[i].heading);
            translate(-missiles[i].position.x, -missiles[i].position.y);

           

            if(fake_heli ==  null)
            {
                angle = atan2(aircraft.position.y - missiles[i].position.y, aircraft.position.x - missiles[i].position.x);
                let deltaX = missiles[i].velocity * cos(missiles[i].heading);
                let deltaY = missiles[i].velocity * sin(missiles[i].heading);

                let dx = missiles[i].position.x - aircraft.position.x;
                let dy = missiles[i].position.y - aircraft.position.y;
                let distance = Math.sqrt((dx*dx)+(dy*dy));



                if(distance<= missiles[i].velocity)
                {
                    missiles[i].position.x = aircraft.position.x;
                    missiles[i].position.y = aircraft.position.y;
                   
                }
                else
                {
                    missiles[i].position.x+=deltaX;
                    missiles[i].position.y+=deltaY;
                    missiles[i].heading=angle;
                }

                let xCollide =    missiles[i].position.x <=  aircraft.position.x + aircraft.width  &&
                    missiles[i].position.x + missiles[i].width >= aircraft.position.x;
                let yCollide =    missiles[i].position.y <=  aircraft.position.y + aircraft.width  &&
                    missiles[i].position.y + missiles[i].width >= aircraft.position.y;

                if(xCollide && yCollide)
                {
                    missiles.splice(i, 1);
                    aircraft.health -= 10;
                }
            }
            else
            {
                angle = atan2(fake_heli.position.y - missiles[i].position.y, fake_heli.position.x - missiles[i].position.x);
                let deltaX = missiles[i].velocity * cos(missiles[i].heading);
                let deltaY = missiles[i].velocity * sin(missiles[i].heading);

                let dx = missiles[i].position.x - fake_heli.position.x;
                let dy = missiles[i].position.y - fake_heli.position.y;
                let distance = Math.sqrt((dx*dx)+(dy*dy));



                if(distance<= missiles[i].velocity)
                {
                    missiles[i].position.x = fake_heli.position.x;
                    missiles[i].position.y = fake_heli.position.y;
                   
                }
                else
                {
                    missiles[i].position.x+=deltaX;
                    missiles[i].position.y+=deltaY;
                    missiles[i].heading=angle;
                }

                let xCollide =    missiles[i].position.x <=  fake_heli.position.x + fake_heli.width  &&
                    missiles[i].position.x + missiles[i].width >= fake_heli.position.x;
                let yCollide =    missiles[i].position.y <=  fake_heli.position.y + fake_heli.width  &&
                    missiles[i].position.y + missiles[i].width >= fake_heli.position.y;

                if(xCollide && yCollide)
                {
                    missiles.splice(i, 1);
                   
                }
            }






           
        }


        let time = millis();

        score += (1.0 / FRAME_RATE) * difficulty;

        if(difficulty<1.5)
            difficulty+= 0.0001;

        let scoreCard = document.getElementById('score_card');
        scoreCard.innerText= parseInt( score);

        healthBar.setAttribute('value', aircraft.health);
        health_value_elem.innerHTML=aircraft.health;
        if(aircraft.health<=0)
        {
            gameEnded=true;
            gameStarted=false;
            prevScore = score;
            if(score > bestScore) {
                bestScore= score;
            }
            score=0;

        }
        if(time - lastSpawn >= missileSpawnTime)
        {
            lastSpawn = time;
            spawnMissile();
        }
    }
    else if(gameEnded==true)
    {
        if(sound.isPlaying())
        {
            sound.stop();
        }
        if(!crash.isPlaying())
        {

            crash.play();
        }
        image(crash_image, 0, 0, canvasWidth *2, canvasHeight *2);
        textSize(canvasHeight/10);
        text('GAME OVER', canvasWidth*0.4, canvasHeight*0.3);
        fill(0, 102, 153);
        textSize(canvasHeight/15);
        text('Your Score: ' + parseInt( prevScore), canvasWidth*0.2, canvasHeight*0.4);
        fill(0, 102, 153);

        text('Best Score ' + parseInt( bestScore), canvasWidth*0.2, canvasHeight*0.5);
        fill(0, 102, 153);


        text('Repairs: ' + parseInt( repairsCount), canvasWidth*0.5, canvasHeight*0.4);
        fill(0, 102, 153);

        text('Counter Measures ' + parseInt( counterMeasures), canvasWidth*0.5, canvasHeight*0.5);
        fill(0, 102, 153);



        text('Click to start again!' , canvasWidth*0.3, canvasHeight*0.6);
        fill(0, 102, 153);

    }

    prevMousePosition = {x: mouseX, y: mouseY};
}

function mousePressed() {
    if(gameStarted==false)
    {
        if(gameEnded)
        {
            gameStarted = false;
            gameEnded=false;
            initGame();
        }
        if(repair==null) repair={};
        repair.last_repair = millis();
        gameStarted = true;
    }
    else {
        if(fake_heli == null && millis() - fake_heli_initation > ECM_WAIT)
        {
            counterMeasures++;
            fake_heli = {};
            fake_heli.velocity  = 3;
            fake_heli.isHelo=true;
            fake_heli.heading=0;
            fake_heli.position={};
            fake_heli.position.x = mouseX;
            fake_heli.position.y = mouseY;
            fake_heli.image = loadImage('https://i.imgur.com/1ZPwIgy.png');
            fake_heli.width  = windowWidth*0.052;
            fake_heli.height =windowWidth*0.033;
            fake_heli.rotors = loadImage('https://i.imgur.com/fGGbnCE.png');
            fake_heli.rotorHeading=0;
            fake_heli.health=100;
            fake_heli.maxHealth=100;
            fake_heli.time = millis();
            let angle = atan2(aircraft.position.y - mouseY, aircraft.position.x - mouseX);
            fake_heli.heading=angle;
            fake_heli_initation = millis();
        }
    }


}

function spawnMissile() {

    let randomPostionX = Math.random() * canvasWidth;
    let randomPositionY = Math.random() * canvasHeight;
    let missilenew = {};
    missilenew.position=
        {
            x: randomPostionX,
            y: randomPositionY,

        };
    missilenew.velocity=2*difficulty;


    let randomNumber = 1+parseInt( Math.random()*3);
    missilenew.image = loadImage(missile_images[randomNumber]);
    missilenew.heading=0;
    missilenew.width=windowWidth*0.03;
    missilenew.height=windowHeight*0.03;
    missiles.push(missilenew);

    return;


}


