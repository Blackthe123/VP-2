var dog, happyDog, database, foodS, foodStock, dogImg, happyDogImg, feed, foodObj, add, availableFood, fedTime, lastFed;

function preload()
{
	dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");

}

function setup() {
  database = firebase.database();
	createCanvas(800, 700);

  foodStock = database.ref('food');
  foodStock.on("value", readStock);

  foodObj = new Food()

  dog = createSprite(600, 250, 50, 50);
  dog.addImage(dogImg);

  dog.scale = 0.15;

  feed = createButton("Feed Dog");
  feed.position(600, 100);
  feed.mousePressed(feedDog);

  add = createButton("Add Food");
  add.position(700, 100);
  add.mousePressed(addFood);
}


function draw() {  
   background(46, 139, 87);
   
   database.ref('food').on("value",(data)=>{
     availableFood = data.val();
   });

   fill(255, 255, 254);
   textSize(20);
   stroke("red");
   text("Avaiable Food: " + availableFood, 255, 30);

   foodObj.display();
   fedTime = database.ref('feedTime');
   fedTime.on("value", (data)=>{
   lastFed = data.val();
   });

   textSize(20);
   stroke("blue");
   if(lastFed>=12){
   text("Last fed : " + lastFed % 12 + " PM", 50, 70);
   }
   else if(lastFed === 0){
   text("Last fed : 12 AM", 50, 70);
   }
   else{
   text("Last fed : " + lastFed + " AM", 50, 70); 
   }
  drawSprites();
   }
  
  function readStock(data){
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  }

  function feedDog(){
    dog.addImage(happyDogImg);
    var food_stock_val = foodObj.getFoodStock();
    if(food_stock_val<=0){
    foodObj.updateFoodStock(food_stock_val * 0);
   }
    else{
    foodObj.updateFoodStock(food_stock_val -1);
    }
    database.ref('/').update({
      food : foodObj.getFoodStock(),
      feedTime : hour()
    })
  }

  function addFood(){
    foodS++
    database.ref("/").update({
     food:foodS
    });
  }




