
const app = {};

app.food = [
    {
    type: "protein",
    varieties: [
        { name: 'Steak', serving: '3 oz', image: 'assets/icons/protein-beef.svg' },
        { name: 'chicken', serving: '4 oz', image: 'assets/icons/protein-chicken.svg' },
        { name: 'shrimp', serving: '4 oz', image: 'assets/icons/protein-shrimp.svg' },
        { name: 'tofu', serving: '150 grams', image: 'assets/icons/protein-tofu.svg' },
        { name: 'eggs', serving: "two", image: 'assets/icons/protein-eggs.svg' },
        { name: 'salmon', serving: '4 oz', image: 'assets/icons/protein-salmon.svg' }
        ],
    },
    {
    type: "veg",
    varieties: [
        { name: 'asparagus', serving: '6 medium spears', image: 'assets/icons/veg-asparagus.svg' },
        { name: 'beets', serving: '1/2 whole medium', image: 'assets/icons/veg-beets.svg' },
        { name: 'broccoli', serving: '1 cup chopped', image: 'assets/icons/veg-brocolli.svg' },
        { name: 'carrot', serving: '1 cup chopped', image: 'assets/icons/veg-carrot.svg' },
        { name: 'zucchini', serving: '1 cup sliced', image: 'assets/icons/veg-zucchini.svg' }
        ],
    },
    {
    type: "carb",
    varieties: [
        { name: 'baked potato', serving: 'one medium', image: 'assets/icons/carb-baked-potato.svg' },
        { name: 'pasta', serving: '1 cup', image: 'assets/icons/carb-pasta-tomato.svg' },
        { name: 'brown rice', serving: '1/2 cup', image: 'assets/icons/carb-rice-brown.svg' },
        { name: 'white rice', serving: '1/2 cup', image: 'assets/icons/carb-rice-white.svg' },
        { name: 'sweet potato', serving: 'one medium', image: 'assets/icons/carb-sweet-potato.svg' }
        ]
    }
]


// find the correct array based on the button ID
app.findFoodArray = function(clickedButton){
    const matchingArray = app.food.filter((food) => {
       return(food.type == clickedButton);
    });
    return matchingArray[0].varieties; 
}


// Randomly pick an object
app.pickRandomItem = function(array){
    const number = Math.floor(Math.random() * (array.length));
    return array[number];
}


// Add to HTML on click
app.assignHtml = function(array, id){
    $(`div#main-img-${id}`).html(`<img src="${array.image}" alt="${array.name}"/>`);
    $(`#randomizer__info--${id}`).html(`
        <h2 id="result-${id}">${array.name}</h2>
        <h3 id="result-${id}">${array.serving}</h3>
    `)
};


app.displayApiInfo = (id, apiDataCals, apiDataProts, apiDataFats, apiDataCarbs) =>{ 
    $(`#randomizer__info--${id}`).append(`
        <p id="result-calories-${id}">Calories: ${apiDataCals}</p>
        <p id="result-p-${id}">Protein: ${apiDataProts}</p>
        <p id="result-f-${id}">Fat: ${apiDataFats}</p>
        <p id="result-c-${id}">Carbohydrates: ${apiDataCarbs}</p>
    `)
}

app.getApiInfo = (id, item) => {
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
          reqUrl: 'https://api.edamam.com/api/nutrition-data',
          params: {
            method: 'GET',
            dataType: 'json',
            app_id: '5c79c0b4',
            app_key: '1cca38a8725080f71faedd0f70080646',
            ingr: `${item}`
          }
        }
      }).then(function(results) {
          const apiCalories = results.calories;
          const apiProtein = (Math.floor(results.totalNutrients.PROCNT.quantity)) + results.totalNutrients.PROCNT.unit;
          const apiFats = (Math.floor(results.totalNutrients.FAT.quantity)) + results.totalNutrients.FAT.unit;
          const apiCarbs = (Math.floor(results.totalNutrients.CHOCDF.quantity)) + results.totalNutrients.CHOCDF.unit;

          app.displayApiInfo(id, apiCalories, apiProtein, apiFats, apiCarbs);

      }).catch(function(error){
          console.log('it broke', error);
      })
    
    };


// Code to kick off the app goes here.  --------------------------------------------------------
app.init = function() {
    
    // Find the array associated with the button clicked on
    $('.btn-randomize').on('click', function(){

        const buttonId = $(this).attr('id');
        let foodArray = app.pickRandomItem(app.findFoodArray(buttonId));
        const nextFood = `${foodArray.name} ${foodArray.serving}`;
        
        // whatever item is randomly generated on click will pass into this function so that the api knows what to look for. The api then spits out the item
        app.getApiInfo(buttonId, nextFood); 

        // this takes the randomly generated item and populates it to the screen.
        app.assignHtml(foodArray, buttonId); 
        
    });



};

// Document Ready  --------------------------------------------------------
$(document).ready(function(){    
    app.init();
});
    


// api info: https://developer.edamam.com/edamam-docs-nutrition-api