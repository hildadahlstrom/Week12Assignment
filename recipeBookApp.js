//url variables. The first is for the api url. The second is for the whole url with resource in crudcrud.
const urlWithoutResource = 'https://crudcrud.com/api/1cb5641566174594a44dc4ddad833d21';
const url = urlWithoutResource + '/recipes';

//global variables
let recipes = [];//array to hold all the arrays 
let ingId = 0;
let instId = 0;

//Recipe Object has the name of a recipe, and arrays for ingredients and instructions
class Recipe{
    constructor(name){
        this.name = name;
        this.ingredients = [];
        this.instructions = [];
    }
}

//Ingredient Object has name of ingredient as well as amount of ingredient. I also assign each ingredient an id to find it more easily
class Ingredient{
    constructor(name,amount){
        this.name = name;
        this.amount = amount;
        this.id = ingId++;
    }
}

//Instruction Object has name of instruction. I also assign each instruction an id to find it more easily
class Instruction{
    constructor(name){
        this.name = name;
        this.id = instId++;
    }
}

//Recipe class holds all the methods that interact with the crudcrud API
class Recipes{
    //addNewRecipe takes in a recipe and posts it to the api, then calls the function to display everything
    static addNewRecipe(recipe){
        fetch(url,{
            headers:{"Content-type":"application/json; charset=UTF-8"},
            method: 'POST',
            body: JSON.stringify(recipe)
        }).then(() =>{
            return DrawDOM.displayAllRecipes();
        });
        
    }
    //deleteReccipe takes in a recipe and deletes it from the api, then calls displayAllRecipes
    static deleteRecipe(recipe){
        fetch(url + `/${recipe._id}`,{
            headers:{"Content-type":"application/json; charset=UTF-8"},
            method: 'DELETE'
        })
        .then(() =>{
            return DrawDOM.displayAllRecipes();
        });
    }

    //updateRecipe takes a recipe to update in the api, then calls displayAllRecipes
    static updateRecipe(recipe){
        fetch(url + `/${recipe._id}`,{
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'PUT',
            body: JSON.stringify({ //passing in each of the individual parts not including the id
                name:recipe.name, 
                ingredients:recipe.ingredients,
                instructions:recipe.instructions
            })
        })
        .then(() =>{
            return DrawDOM.displayAllRecipes();
        })
    }   
}

//DrawDOM class handles all the updates that you see on the screen
class DrawDOM{
    //displayAllRecipes gets the most current items from the API and converts it to an array, then empties the screen and then displays the new array
    static displayAllRecipes(){
        fetch(url)
        .then(data => data.json())
        .then((rec) => {
            $('#information').empty();
            recipes = rec;
            for(let i = 0; i < recipes.length; i ++){
                this.displayRecipe(recipes[i]);//display the recipe
                this.formContainer(recipes[i]);//creates 2 columns to display ingredients and instructions
                this.displayIngredients(recipes[i]);//display the ingredients of the recipe
                this.displayInstructions(recipes[i]);//display the instructions of the recipe
            }
        })
    }

    //add new recipe to the page
    static createRecipe(name){
        Recipes.addNewRecipe(new Recipe(name))
    }

    //delete a recipe from the page
    static async deleteRecipe(id){
        for(let i = 0; i < recipes.length;i++){
            if(id == recipes[i]._id){
                Recipes.deleteRecipe(recipes[i]);
            }
        }
    }

    //add ingredient to recipe with passed in id
    static addIngredient(id){
        for(let i = 0; i < recipes.length; i++){
            if(recipes[i]._id == id){
                recipes[i].ingredients.push(new Ingredient($(`#${recipes[i]._id}-ingredient-name`).val(),$(`#${recipes[i]._id}-ingredient-amount`).val()));
                Recipes.updateRecipe(recipes[i]);
            } 
        }
    }

    //remove ingredient with an id from recipe with passed in id
    static removeIngredient(recipeId,ingredientId){
        for(let recipe of recipes){
            if(recipe._id == recipeId){
                for(const ingredient of recipe.ingredients){
                    if(ingredient.id == ingredientId){
                        recipe.ingredients.splice(recipe.ingredients.indexOf(ingredient),1);
                        Recipes.updateRecipe(recipe);
                    }
                }
            }
        }
    }

    //add instruction to recipe with passed in id
    static addInstruction(id){
        for(let i = 0; i < recipes.length; i++){
            if(recipes[i]._id == id){
                recipes[i].instructions.push(new Instruction($(`#${recipes[i]._id}-instruction`).val()));
                Recipes.updateRecipe(recipes[i]);
            }
        }
    }

    //remove instruction with an id from recipe with passed in id
    static removeInstruction(recipeId,instructionId){
        for(let recipe of recipes){
            if(recipe._id == recipeId){
                for(const instruction of recipe.instructions){
                    if(instruction.id == instructionId){
                        recipe.instructions.splice(recipe.instructions.indexOf(instruction),1);
                        Recipes.updateRecipe(recipe);
                    }
                }
            }
        }
    }

    //displays the recipe that is passed in within html
    static displayRecipe(recipe){
        $('#information').prepend(
            `<div id = "${recipe._id}" class = "card recipe-card">
            <div class = "card-header">
                <div class = "row">
                    <div class = "col-sm-2">
                        <button class = "delete-button btn" onclick = "DrawDOM.deleteRecipe('${recipe._id}')">Delete</button>
                    </div>
                    <div class = "col-sm">
                        <h2>${recipe.name}</h2>
                    </div>
                </div>
            </div>
            <div class = "card-body recipe-card">
                <div class = "card recipe-card">
                    <div class = "row justify-content-between recipe-card">
                        <div class = "col-sm-5">
                            <div class = "row">
                                <div class = "col-sm">
                                    <div class = "row">
                                        <input type = "text" id = "${recipe._id}-ingredient-amount" class = "form-control" placeholder = "Enter amount of ingredient">
                                    </div>
                                </div>
                                <div class = "col-sm">
                                    <div class = "row">
                                        <input type = "text" id = "${recipe._id}-ingredient-name" class = "form-control" placeholder = "Enter ingredient">
                                    </div>
                                </div>
                            </div>
                            <div class = "row">       
                                <button id = "${recipe._id}-new-ingredient" onclick = "DrawDOM.addIngredient('${recipe._id}')" class = "add-ingredient form-control btn">Add Ingredient</button>
                            </div>
                        </div>
    
                        <div class = "col-sm-5">
                            <div class = "card recipe-card">
                                <div class = "row align-items-center recipe-card">
                                        <input type = "text" id = "${recipe._id}-instruction" class = "form-control" placeholder = "Enter instructions for this recipe">
                                </div>  
                                <div class = "row ">
                                    <button id = "${recipe._id}-new-instruction" onclick = "DrawDOM.addInstruction('${recipe._id}')" class = "add-instruction form-control btn ">Add Instruction</button>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        );
    }

    //creates a 2 column container to display the ingredients and instructions into
    static formContainer(recipe){
        $(`#${recipe._id}`).find('.card-body').append( 
            `<div class = "row">
                <div class = "col-sm-6">
                    <div class = "container-fluid ing-container" id = "ingredient-list">
                        <div class = "row">
                            <div class = "col-sm">
                                <h3>Amount</h3>
                            </div>
                            <div class = "col-sm">
                                <h3>Ingredient</h3>
                            </div>
                            <div class = "col-sm-1">
                                <!-- <h3>Remove</h3> -->
                            </div>
                        </div>
                    </div> 
                </div>
                <div class = "col-sm-6">
                    <div class = "container-fluid inst-container" id = "instruction-list">
                        <div class = "row">
                            <div class = "col-sm-1">
                                <h3>#</h3>
                            </div>
                            <div class = "col-sm">
                                <h3>Instruction</h3>
                            </div>
                            <div class = "col-sm-2">
                                <!-- <h3>Remove</h3> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        );
    }
    //displays the inredients of the recipe that is passed in within html
    static displayIngredients(recipe){
        //creates each individual ingredient line
        for(const ingredient of recipe.ingredients){
            $(`#${recipe._id}`).find('#ingredient-list').append(
                `<div class = "row">
                    <div class = "col-sm-3">
                        ${ingredient.amount}
                    </div>
                    <div class = "col-sm">
                        ${ingredient.name}
                    </div>
                    <div class = "col-sm-2">
                        <button class = "remove-button btn" onclick = "DrawDOM.removeIngredient('${recipe._id}','${ingredient.id}')">Remove</button>
                    </div>
                </div>
                `
            );
        }
    }
    //displays all the instructions for the passed in recipe
    static displayInstructions(recipe){
        let number = 0;//number for each row of instructions
        //displays each instruction in the recipe
        for(const instruction of recipe.instructions){
            number++;
            $(`#${recipe._id}`).find('#instruction-list').append(
                `<div class = "row">
                    <div class = "col-sm-1">
                        ${number}
                    </div>
                    <div class = "col-sm">
                        ${instruction.name}
                    </div>
                    <div class = "col-sm-2">
                        <button class = "remove-button btn" onclick = "DrawDOM.removeInstruction('${recipe._id}','${instruction.id}')">Remove</button>
                    </div>
                </div>
                `
            );
        }
    }
}

//main program
DrawDOM.displayAllRecipes();
//on click create new recipe and display everything
$('#create-new-recipe').on('click',()  => {
    DrawDOM.createRecipe($('#new-recipe-name').val());
    $('#new-recipe-name').val('');
});
