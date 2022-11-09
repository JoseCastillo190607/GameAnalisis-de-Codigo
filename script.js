

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1900;
    canvas.height = 500;

//* Esta clase InputH andler es nuestro mando, el cual nos permitira que nuestro player peuda moverse de arriba hacia abajo ademas de poder disparar el ammo 

    class InputHandler{
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e=>{
                if((    (e.key === 'ArrowUp') ||
                        (e.key === 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                }else if(e.key === ' '){
                    this.game.player.shootTop();
                }else if(e.key === 'd'){
                    this.game.debug = !this.game.debug;
                }
            });
            window.addEventListener('keyup', e=>{
                if(this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            });

        }
    }
 
//* Clase projecttitle esta clase es la municion la cual contiene atributos como velociadad de disparo, tamaño y ancho ademas de sus metodos update y draw 

    class Projecttitle{
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 10 ;
            this.markedForDeletion = false;
        }
        update(){
            this.x += this.speed;
            if(this.x > this.game.width * 0.8){
                this.markedForDeletion = true;
            }
        }

//* draw(context) pinta y de color la municion de nuestro caballito de mar haicendo uso de context.fillStyle
        draw(context){
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }


//* La clase player es la mas importate de todas puesto que esta hace uso de varias clases y metodos que componen en su mayoria el juego.
    class Player{
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            this.speedY = 0;
            this.maxSpeed = 1;
            this.Projectiles = [];
            this.image = document.getElementById('player');
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit = 10000;
        }
        update(deltaTime){
            this.y += this.speedY;
            if(this.game.keys.includes('ArrowUp')){
                this.speedY = -this.maxSpeed;
            }else if(this.game.keys.includes('ArrowDown')){
                this.speedY = this.maxSpeed;
            }else{
                this.speedY = 0;
            }
            this.y += this.speedY;
            this.Projectiles.forEach(projecttitle=>{
                projecttitle.update();
            });
            this.Projectiles = this.Projectiles.filter(projecttitle=>!projecttitle.markedForDeletion);
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else{
                this.frameX = 0;
            }
            if(this.powerUp){
                if(this.powerUpTimer > this.powerUpLimit){
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                }else{
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;
                    this.game.ammo += 0.1;
                }
            }
        }
        draw(context){
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,
                                this.frameX*this.width,
                                this.frameY*this.height,
                                this.width, this.height,
                                this.x, this.y,
                                this.width, this.height);
            this.Projectiles.forEach(projecttitle=>{
                projecttitle.draw(context);
            });
        }
        shootTop(){
            if(this.game.ammo > 0) {
            this.Projectiles.push(new Projecttitle(this.game, this.x+80, this.y+30));
            this.game.ammo--;
        }
    }
    enterPowerUp(){
        this.powerUpTimer = 0;
        this.powerUp = true;
        this.game.ammo = this.game.maxAmmo;
    }
}

//* Clase Enemy esta clase se encarga de pintar a los enemigos

    class Enemy{
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random()*-1.5-0.5;
            this.markedForDeletion = false;
            this.lives = 5;
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
        }
        update(){
            this.x += this.speedX;
            if(this.x + this.width < 0){
                this.markedForDeletion = true;
            }
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else{
                this.frameX = 0;
            }
        }
        draw(context){
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,
                                this.frameX*this.width,
                                this.frameY*this.height,
                                this.width, this.height,
                                this.x, this.y,
                                this.width, this.height,
                                )
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
        }
    }


//* es un tipo de enemigo el cual tiene Herencia de la clase padre Enemy por lo tanto Angler1 contienen los atributos del mismo, este aparece de forma aleatoria en la pantalla

    class Angler1 extends Enemy{
        constructor(game){
            super(game)
            this.width = 228;
            this.height = 169;
            this.y = Math.random()*(this.game.height*0.9-this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random()*3);
            this.lives = 2;
        }
    }
    
//* la clase Angles2 es otro tipo de enemigo especial el cual tambien hereda los atributos de su padre Enemy

    class Angler2 extends Enemy{
        constructor(game){
            super(game)
            this.width = 213;
            this.height = 165;
            this.y = Math.random()*(this.game.height*0.9-this.height);
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random()*2);
            this.lives = 3;
        }
    }
    
//* Clase LuckyFish esta clase contiene al pez de la suerte el cual es traido por su id "lucky" y pintado aleatoriamente con la funcion Math.Random

    class LuckyFish extends Enemy{
        constructor(game){
            super(game)
            this.width = 300;
            this.height = 300;   
            this.y = Math.random()*(this.game.height*0.9-this.height);
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random()*2);
            this.lives = 5;
            this.score = 20;
            this.type = 'lucky';
        }
    }

///* la clase layer es una parte de los escenarios del juego , siendo este el fondo del mar 

    class Layer{
        constructor(game, image, speedModifer){
            this.game = game;
            this.image = image;
            this.speedModifer = speedModifer;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }

        update(){
            if(this.x <= -this.width)this.x = 0;
            this.x -= this.game.speed*this.speedModifer;
        }

        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x+this.width, this.y);
        }
    }
//* la clase background como su nombre lo dice es el fondo del juego, el escenario completo conteniendo los cuatro layers existentes 
    class Background{
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');

            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1.2);
            this.layer4 = new Layer(this.game, this.image4, 1.7);

                
            this.layer = [this.layer1, this.layer2, this.layer3];
            // , this.layer4
        }

        update(){
            this.layer.forEach(layer=>layer.update());
        }

        draw(context){
            this.layer.forEach(layer=>layer.draw(context));
        }
    }


//* Esta clase muestra todos los recursos estadisticos del juego como el puntaje, el tiempo, si es que has ganado o perdido la ronda del juego
    class UI{
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Arial Black';
            this.color = 'red';
        }

        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px '+this.fontFamily;
            context.fillText('score: '+this.game.score, 20, 40);
            for(let i=0; i<this.game.ammo; i++){
                context.fillRect(20 + 5*i, 50, 3, 20);
            }
            
            const formattedTime = (this.game.gameTime*0.001).toFixed(1);
            context.fillText('Timer: ' + formattedTime, 20, 100);
            console.log(this.game.score)

            if(this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if(this.game.score > this.game.WinningScore){
                    message1 = 'Haz Ganado!';
                    message2 = 'Bien hecho!';
                }else{
                    message1 = 'Perdiste';
                    message2 = 'Intenta de nuevo!';
                }
                context.font = '100px '+this.fontFamily;
                context.fillText(message1,
                                this.game.width*0.5,
                                this.game.height*0.5-20);
                context.font = '25px '+this.fontFamily;
                context.fillText(message2,
                                this.game.width*0.5,
                                this.game.height*0.5+20);
            }
            context.restore();
    }
}


//* la clase game instancia los objetos como el player, el InputHandler, UI, Background, ademas de hacer uso de todas clases del juego pues esta es la clase principal 
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.Background = new Background(this);
            this.keys = [];
            this.ammo = 20;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.maxAmmo = 50;
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.gameOver = false;
            this.score = 0;
            this.WinningScore = 10;
            this.gameTime = 0;
            this.timeLimit = 20000;
            this.speed = 1;
            this.debug = false;
        }

        update(deltaTime){
            if(!this.gameOver) this.gameTime += deltaTime;
            if(this.gameTime > this.timeLimit) this.gameOver = true;
            this.Background.update();
            this.Background.layer4.update();
            this.player.update(deltaTime);
            if(this.ammoTimer > this.ammoInterval){
                console.log(this.ammo)
                if(this.ammo < this.maxAmmo) {
                this.ammo++;
                this.ammoTimer = 0;
                }
            }else{
                this.ammoTimer += deltaTime;
            }
            this.enemies.forEach(enemy=>{
                enemy.update();
                if(this.checkCollistion(this.player, enemy)){
                    enemy.markedForDeletion = true;
                    if(enemy.type='lucky') this.player.enterPowerUp();
                    else this.score--;
                }
                this.player.Projectiles.forEach(projecttitle=>{
                    if(this.checkCollistion(projecttitle, enemy)){
                        enemy.lives--;
                        projecttitle.markedForDeletion = true;
                        if(enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            if(!this.gameOver) this.score += enemy.score;
                            if(this.score > this.WinningScore) {
                                this.gameOver = true;
                            }
                        }
                    }
                });
            });
            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);
            if(this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }
        }

        draw(context){
            this.Background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            });
            this.Background.layer4.draw(context);
        }

        addEnemy(){
            const randomize = Math.random();
            if(randomize < 0.3)this.enemies.push(new Angler1(this));
            else if(randomize < 0.6) this.enemies.push(new Angler2(this));
            else this.enemies.push(new LuckyFish(this));
        }
        checkCollistion(rect1, rect2){
            return(     rect1.x < rect2.x + rect2.width
                        && rect1.x + rect1.width > rect2.x
                        && rect1.y < rect2.y + rect2.height
                        && rect1.height + rect1.y > rect2.y
            );
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp-lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});