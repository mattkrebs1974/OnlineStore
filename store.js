var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('text-table');
var dotenv = require('dotenv')
var name = "";
var ID_NUMBER;



// var t = table([
//     ['master', '0123456789abcdef'],
//     ['staging', 'fedcba9876543210']
// ]);
// console.log(t);


var connection = mysql.createConnection({
    host: "127.0.0.1",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "Storefront_db"
});


connection.connect(function (err) {
    if (err) throw err;
    introductions();

});



function introductions() {
    inquirer.prompt({

        name: "introductions",
        type: "list",
        message: "\n\nWelcome to our Online Office Store! \n\n\n Are you a Store Manager, or a Customer?\n\n\n",
        choices: ["Manager", "Customer", "Exit"]

    }

    )
        .then(function (answer) {

            switch (answer.introductions) {
                case "Manager":
                    console.log("\n\nThank you for checking in today!\n");
                    managerOptions();
                    break;

                case "Customer":
                    console.log("\n\nThank You for Visiting us today!\n");

                    newOrReturningCustomer();
                    break;

                case "Exit":
                    setTimeout(leave, 2000);
                    break;
            }

        });
}







function managerOptions() {
    inquirer.prompt({
        name: "managerOptions",
        type: "list",
        message: "\n\nWhat would you like to do right now?",
        choices: ["Review Current Inventory", "Consider Restocking", "Purchase Orders", "Go Home"]
    })

        .then(function (answer) {

            switch (answer.managerOptions) {
                case "Review Current Inventory":
                    console.log("\n\nOK lets take a look to see what is on our shelves!\n\n");
                    setTimeout(checkInventory, 2000)
                    break;
                case "Consider Restocking":
                    setTimeout(checkStock, 2000);
                    break;

                case "Purchase Orders":
                    console.log("\n\nOK - lets take a look at your sales.\n\n");
                    setTimeout(checkSales, 2000);
                    break;

                case "Go Home":
                    console.log("\n\nYou just got here!!\n\n")


                    setTimeout(leave, 2000);



            }
        });
}
function leave() {

    connection.end();

}

function checkSales() {

    var query = "SELECT * FROM Orders";

    console.log("\x1b[44m%s\x1b[0m", "Purchase Orders");
    connection.query(query, function (err, res) {
        if (err) throw err;
        if (res.length > 0) {

            var productDisplay =[['Item', 'Price_Per_Item', 'Quantity', 'Total Cost']];

            for (var i = 0; i < res.length; i++) {
               

                productDisplay.push([res[i].Item, res[i].Price_Per_Item, res[i].Quantity, res[i].TotalCost])


                //Old one
                // console.log("\x1b[44m%s\x1b[0m", "\n" + res[i].Item + "    Item Price: $" + res[i].Price_Per_Item + "    Quantity: " + res[i].Quantity + "    Total Cost: $" + res[i].TotalCost);
                
            }
            output = table(productDisplay);
            console.log("\x1b[44m%s\x1b[0m", output)
            



        }
    })
    setTimeout(managerOptions, 3000);
}




function customerOptions() {
    inquirer.prompt({

        name: "customerOptions",
        type: "list",
        message: "\n\nWhat would you like to do right now?",
        choices: ["See your purchase history", "Go Shopping", "Go Home"]
    })

        .then(function (answer) {
            switch (answer.customerOptions) {

                case "See your purchase history":
                    console.log("\n\nOK lets take a look to see what you have purchased so far!\n\n");
                    setTimeout(purchaseHistory, 3000);
                    break;

                case "Go Shopping":
                    console.log("\n\nOK Let's go shopping!\n\n");
                    setTimeout(seeWhatsOnTheShelves, 1500);

                    break;

                case "Go Home":
                    console.log("\n\nCome back soon!\n\n");
                    setTimeout(leave, 2000);
                    break;

            }
        });
}

function purchaseHistory() {

    var query = "SELECT * FROM Orders WHERE Buyer = '" + name + "' and Buyer_ID = " + ID_NUMBER;

    console.log("\x1b[44m%s\x1b[0m", "Your Purchase History");
    connection.query(query, function (err, res) {
        if (err) throw err;
        if (res.length > 0) {



            var productDisplay = [['Item', 'Price_Per_Item', 'Quantity', 'Total Cost']];


            for (var i = 0; i < res.length; i++) {
              
                productDisplay.push([res[i].Item, res[i].Price_Per_Item, res[i].Quantity, res[i].TotalCost])

              //Old display
                // console.log("\x1b[44m%s\x1b[0m", "\n" + res[i].Item + "    Item Price: $" + res[i].Price_Per_Item + "    Quantity: " + res[i].Quantity + "    Total Cost: $" + res[i].TotalCost);

            }

            output = table(productDisplay);
            console.log("\x1b[44m%s\x1b[0m", output)


        } else {
            console.log("\x1b[44m%s\x1b[0m", "You haven't purchased anything yet.")
        }
    })
    setTimeout(customerOptions, 6000);
}

function checkInventory() {


    var query = "SELECT Category, Items_For_Sale, Price_Per_Item, Quantity_Available FROM SalesTable";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n\n")
        console.log("\x1b[44m%s\x1b[0m", "Items For Sale");
        
        var productDisplay = [['Items_For_Sale', 'Price_Per_Item', 'Quantity_Available']];

        
        for (var i = 0; i < res.length; i++) {


            productDisplay.push([res[i].Items_For_Sale, res[i].Price_Per_Item, res[i].Quantity_Available])

           
           //Old display
            // console.log("\x1b[44m%s\x1b[0m", "\n" + res[i].Items_For_Sale + "        Price: $" + res[i].Price_Per_Item + "        Quantity Available: " + res[i].Quantity_Available);


        }


        output = table(productDisplay);
        console.log("\x1b[44m%s\x1b[0m", output)


    });

    managerOptions();

}

function seeWhatsOnTheShelves() {

    var query = "SELECT Category, Items_For_Sale, Price_Per_Item, Quantity_Available FROM SalesTable";

    console.log("\n\n")
    console.log("\x1b[44m%s\x1b[0m", "Items For Sale");
    connection.query(query, function (err, res) {
        if (err) throw err;


        var productDisplay = [['Items_For_Sale ', 'Price_Per_Item', 'Quantity_Available']];


        for (var i = 0; i < res.length; i++) {


            productDisplay.push([res[i].Items_For_Sale, res[i].Price_Per_Item, res[i].Quantity_Available])

            //Old way
            // console.log("\x1b[44m%s\x1b[0m", "\n" + res[i].Items_For_Sale + "        Price: $" + res[i].Price_Per_Item + "        Quantity Available: " + res[i].Quantity_Available);


        }

        output = table(productDisplay);
        console.log("\x1b[44m%s\x1b[0m", output)


        shop();

    });

}

// managerOptions()



//                 itemsDesired();



function checkStock() {

    inquirer.prompt({
        name: "howManyItemsOnShelves",
        type: "list",
        message: "\n\nEach Manager is different.\n\nAs items are flying off the shelves (due to sales) -\n\nAt what number (quantity) should each item be at before you decide to restock\n\n",
        choices: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    })

        .then(function (answer) {
            var threshold = answer.howManyItemsOnShelves;

            console.log("\n\nOK lets check to see if any of our items are below that threshold and need to be restocked.\n\n");

            var query = "SELECT Quantity_Available FROM SalesTable";

            connection.query(query, function (err, res) {
                if (err) throw err;

                for (var i = 0; i < res.length; i++) {

                    if (res[i].Quantity_Available < threshold) {

                        console.log("OK based on the threshold that you haves set you are going to need to restock.");


                        inquirer.prompt({
                            name: "maximumAmountOnShelves",
                            type: "list",
                            message: "\n\n In terms of quantity of Items (in stock) what is your limit on the high end?",
                            choices: [14, 15, 16, 17, 18, 19, 20]
                        })

                            .then(function (answer) {
                                var highthreshold = answer.maximumAmountOnShelves;





                                console.log("\n\nOK so we won't go over " + highthreshold + ".");

                                var nextquery = "UPDATE SalesTable SET Quantity_Available = " + highthreshold + " WHERE Quantity_Available < " + threshold;

                                // RESET
                                // UPDATE SalesTable SET Quantity_Available = 4 Where Quantity_Available > 8

                                connection.query(nextquery, function (err, result) {
                                    if (err) throw err;


                                    function restock() {
                                        console.log("\n\nOK you've restocked those items that needed it.\n\n")
                                    }

                                    setTimeout(restock, 3000);

                                    setTimeout(managerOptions, 6000);
                                })



                            })
                        return false;
                    } else {


                    }
                }

            })
            function dontRestock() {
                console.log("All of the items on your shelves are above the number that you set - so you do not need to restock.");
            }

            setTimeout(dontRestock, 4000);
            setTimeout(managerOptions, 8000);



        })









    // managerOptions();

}


function newOrReturningCustomer() {

    inquirer.prompt({

        name: "newOrReturning",
        type: "list",
        message: "\n\nAre you a new or Returning Customer?",
        choices: ["New Customer", "Returning Customer"]
    })

        .then(function (answer) {
            switch (answer.newOrReturning) {

                case "New Customer":
                    console.log("\n\nWelcome!\n\n");
                    register();
                    break;

                case "Returning Customer":
                    console.log("\n\nWelcome Back!\n\n");
                    signIn();
                    //remember to visits ++
                    break;

            }
        });
}


function register() {

    // directions ------ delete customers 
    //DELETE FROM Customer_Id WHERE Cust_ID > 1;

    inquirer.prompt({

        name: "register",
        type: "input",
        message: "\n\nWhat is your Name?",
    })

        .then(function (answer) {

            name = answer.register;

            var registerName = "INSERT INTO Customer_Id VALUES (default, '" + name + "', 1)"

            connection.query(registerName, function (err, result) {
                if (err) throw err;

                else {

                    var getID = "SELECT Cust_ID from Customer_Id ORDER BY Cust_ID DESC LIMIT 1;"

                    connection.query(getID, function (err, res) {
                        if (err) throw err;

                        else {

                            ID_NUMBER = res[0].Cust_ID

                            console.log("\n\nOK " + name + " your Customer ID Number is " + ID_NUMBER + ".\n\nTo log in to your account in the future \n\nYou must type in your name (as  you entered it) \n\nAnd your given CustoemrID number");
                        }
                    })

                    setTimeout(customerOptions, 4000);

                }

            })


        });

}



function signIn() {
    // Ask person to provide their username and password when it is confirmed set name== to what they have typed set ID = to what they have typed add 1 to the number of visits. If it cannot be found --- your information cannot be found send them to register. Once signed in --- got to customeroptions(). 


    inquirer.prompt([
        {
            name: "nameOfVisitor",
            type: "input",
            message: "please enter your name (as you entered it when you first registered)"
        },
        {
            name: "IdNumber",
            type: "input",
            message: "please enter your given ID number"
        }
    ])
        .then(function (answer) {

            name = answer.nameOfVisitor;
            ID_NUMBER = answer.IdNumber;



            var isRegistered = "SELECT Visits FROM Customer_Id WHERE Cust_ID = ? AND name = ?";


            connection.query(isRegistered, [ID_NUMBER, name], function (err, res) {
                if (err) {
                    console.log(err);
                }
                else if (res[0]) {


                    var updateVisits = "UPDATE Customer_Id SET Visits = (Visits + 1) WHERE Name = '" + name + "' and Cust_ID = " + ID_NUMBER;

                    connection.query(updateVisits, function (err, result) {
                        if (err) throw err;

                        setTimeout(customerOptions, 2000);
                    })

                }
                else {


                    console.log("\n\nWe can't find a match with the combination of '" + name + "' and '" + ID_NUMBER + "'.\n\nHowever, we can re-register you right now.");

                    var reRegisterName = "INSERT INTO Customer_Id VALUES (default, '" + name + "', 1)"

                    connection.query(reRegisterName, function (err, result) {
                        if (err) throw err;


                        var getID = "SELECT Cust_ID from Customer_Id ORDER BY Cust_ID DESC LIMIT 1;"

                        connection.query(getID, function (err, res) {
                            if (err) throw err;

                            else {

                                ID_NUMBER = res[0].Cust_ID


                                function notice() {
                                    console.log("\n\nOK " + name + " your Customer ID Number is now " + ID_NUMBER + ".\n\nTo log in to your account in the future, \n\nyou must type in your name (as you entered it) \n\nAnd your given Custoemr ID number.");
                                }

                                setTimeout(notice, 5000);

                            }
                        })








                        setTimeout(customerOptions, 14000);
                    })

                }

            })

        })

}

// function itemsDesired() {
//     inquirer.prompt([{

//         name: "itemsDesired",
//         type: "list",
//         message: "\n\n At Matt Krebs's store we have a fine selection of products!\n\n What were you looking for today?",
//         choices: ["Umbrellas", "Hampsters", "Machine Guns"]
//     },
//     {
//         name: "quantityDesired",
//         input: "number",
//         message: "\n\n How many of these were you looking to purchase today \n\n(Must not be greater than ______ )\n\n"
//     }

//     ])
//         .then(function (answer) {
//             if (answer.quantityDesired > 0 && answer.quantityDesired <= 6)  //make variable out of inventory of desired number and compare)
//             {
//                 console.log("\n\nyou have chosen to buy 7 _____ at $_____\n\n")
//                 payment()
//             } else {

//                 console.log("\n\nWe only have ___ left in stock.\n\n Please pick a number that is greater than zero but less than\n\n")

//             }

//         })
// }

// function payment() {

// console.log("your order is to buy x of x at x number");

//     inquirer.prompt({

//         name: "confirmOrder",
//         type: "list",
//         message: "Would you like to go forward with this order",
//         choices: ["Yes", "no"]
//     })

//         .then(function (answer) {
//             if (answer.confirmOrder === "Yes"){
//             console.log("Great we have now magically taken x from you and in 10-15 business days you will receive your _______. Your order has been documented in purchase history.")

//             //document purchase - in purchase history - in inventory - in sales. 

//             } else {

//                 console.log("Sorry that you have decided not to purchase the_______. They are very popular. For now we will return you to the main menu ")

//             }



// })
// }

// function restock(){

// UPDATE SalesTable
// SET Quantity_Available = highthreshold
// WHERE Quantity_Available < threshold

// }

// function maximumAmount() {
//     inquirer.prompt({
//         name: "maximumAmountOnShelves",
//         type: "list",
//         message: "\n\n In terms of quantity of Items (in stock) what is your limit on the high end?",
//         choices: [14, 15, 16, 17, 18, 19, 20]
//     })

//         .then(function (answer) {
//             var highthreshold = answer.maximumAmountOnShelves;


//             console.log(highthreshold);

//             console.log("\n\nOK lets check to see if any of our items \n\n are below that threshold and need to be restocked");



//         })
// }



// function checkStock() {

//     inquirer.prompt({
//         name: "howManyItemsOnShelves",
//         type: "list",
//         message: "\n\nEach Manager is different.\n\nAs items are flying off the shelves (due to sales) -\n\nAt what number (quantity) should each item be at before you decide to restock\n\n",
//         choices: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
//     })

//         .then(function (answer) {
//             var threshold = answer.howManyItemsOnShelves;

//             console.log(threshold);

//             console.log("\n\nOK lets check to see if any of our items are below that threshold and need to be restocked.\n\n");

//             var query = "SELECT Quantity_Available FROM SalesTable";

//             connection.query(query, function (err, res) {
//                 if (err) throw err;

//                 for (var i = 0; i < res.length; i++) {

//                     if (res[i].Quantity_Available < threshold) {

//                         console.log("OK based on the threshold that you haves set you are going to need to restock.");

//                         inquirer.prompt({
//                             name: "maximumAmountOnShelves",
//                             type: "list",
//                             message: "\n\n In terms of quantity of Items (in stock) what is your limit on the high end?",
//                             choices: [14, 15, 16, 17, 18, 19, 20]
//                         })

//                             .then(function (answer) {
//                                 var highthreshold = answer.maximumAmountOnShelves;



//                                 console.log(highthreshold);

//                                 console.log("\n\nOK so we won't go over " + highthreshold + ".");



//                                 var nextquery = "UPDATE SalesTable SET Quantity_Available = " + highthreshold + "WHERE Quantity_Available < " + threshold;

//                                 connection.query(nextquery, function (err, result) {
//                                     if (err) throw err;

//                                     console.log(result);
//                                  })



//                                 })
//                                 return false;
//                             } else {

//                             }

//                 console.log("OK based on the threshold that you have set we currently have plenty on the shelves. ")

//  })



function shop() {

    // to delete rows do the following:
    //DELETE FROM Orders WHERE Cust_ID > 1;

    connection.query("SELECT * FROM SalesTable", function (err, results) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "whatYouAreBuying",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].Items_For_Sale);
                    }
                    return choiceArray;
                },
                message: "Which item would you like to buy?"
            },
            {
                name: "Quantity",
                type: "input",
                message: "How many would you like to buy?"

            }
        ])
            .then(function (answer) {

                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].Items_For_Sale === answer.whatYouAreBuying) {
                        chosenItem = results[i];
                    }
                }

                if (chosenItem.Quantity_Available < parseInt(answer.Quantity)) {

                    console.log("\n\nSorry we don't have enough inventory to fill this order! Please resubmit your order.\n\n")

                    setTimeout(seeWhatsOnTheShelves, 2500);


                } else {

                    var costOfPurchase = (parseInt(answer.Quantity)) * (parseFloat(chosenItem.Price_Per_Item));

                    var roundedCost = (Math.round(costOfPurchase * 100) / (100));



                    console.log("\n\nOK you are purchasing " + answer.Quantity + " " + answer.whatYouAreBuying + "\n (at: $" + parseFloat(chosenItem.Price_Per_Item) + " each) for a total of $" + roundedCost + ".");

                    connection.query(
                        "INSERT INTO Orders SET ?",

                        {

                            Buyer_ID: ID_NUMBER,
                            Buyer: name,
                            Category: chosenItem.Category,
                            Item: answer.whatYouAreBuying,
                            Price_Per_Item: chosenItem.Price_Per_Item,
                            Quantity: answer.Quantity,
                            TotalCost: roundedCost

                        },


                        function (err) {
                            if (err) throw err;

                        }
                    )

                    function receipt() {
                        connection.query(
                            "UPDATE SalesTable SET ? WHERE Product_ID=" + chosenItem.Product_ID,
                            {

                                Quantity_Available: chosenItem.Quantity_Available - answer.Quantity,
                                Items_Sold: chosenItem.Items_Sold + answer.Quantity,
                                Total_Sales: chosenItem.Total_Sales + roundedCost

                            },

                            function (err) {
                                if (err) throw err;
                                console.log("You've just purchased " + answer.Quantity + " " + answer.whatYouAreBuying + ".");


                            }

                        )
                    }

                    setTimeout(receipt, 4000)
                    setTimeout(customerOptions, 7000)




                }








            })
    })

}

const port = process.env.PORT || 3000;
app.listen(port);

module.exports = app;