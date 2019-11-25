const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host:'localhost',
    port:3306, 
    user:'root', 
    password:'Password1!',
    database:'bamazon'
});

connection.connect(function(err){
    if (err) throw err;
    askManager();
});


const askManager = () =>{
    inquirer.prompt([
        {
            type:'list',
            name:'manage',
            message:'What action would you like to take?',
            choices:['View Products for sale','View low inventory','Add to inventory', 'Add New Products']
        }
    ]).then((answer) => {
        switch (answer.manage){
            case 'View Products for sale':
                viewProducts();
                break;
            case 'View low inventory':
                lowInventory();
                break;
            case 'Add to inventory':
                addInventory();
                break;
            case 'Add New Products':
                newProducts();
                break;
        }
    })
}
const anotherAction = () =>{
    inquirer.prompt([
        {
            type:'confirm',
            name:'anotherAction',
            message:'Would you like to do anything else?'
        }
        
    ]).then((answer) =>{
        if(answer.anotherAction){
            askManager();
        }else{
            process.exit();
        }
    })
}

const viewProducts = () =>{
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++){
            console.log(`
${res[i].item_id}. ${res[i].product_name} | ${res[i].department_name} | $${res[i].price} | ${res[i].stock_quantity}`)
        }
        anotherAction();
    })
};

const lowInventory = () =>{
    connection.query('SELECT * FROM products WHERE stock_quantity <= 5', (err, res) =>{
        if (err) throw err;
        for (let i = 0; i < res.length; i++){
            console.log(`
${res[i].item_id}. ${res[i].product_name} | ${res[i].department_name} | $${res[i].price} | ${res[i].stock_quantity}`)
        }
        anotherAction();
    })
};

const addInventory = () =>{
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++){
            console.log(`
${res[i].item_id}. ${res[i].product_name} | ${res[i].department_name} | $${res[i].price} | ${res[i].stock_quantity}`)
        }
    
    inquirer.prompt([
        {
            type:'input',
            name:'addWhat',
            message:'Enter the Item Id number for the product you would like to update the inventory for?'
        },
        {
            type:'input',
            name:'updatedInven',
            message:'What is the new inventory for this product?',
            validate: (value) =>{
                if(isNaN(value)===false){
                    return true;
                }else{
                    console.log('\n Please enter valid quantity.');
                } 
            }
        }
    ]).then((answer) =>{
        let query = 'UPDATE products SET ? WHERE ?'
        connection.query( query, [{stock_quantity: answer.updatedInven}, {item_id:answer.addWhat}], (err) =>{
            if (err) throw err;
            console.log('Product has been updated.')
        })
        anotherAction();
    })
})
};

const newProducts = () =>{
    inquirer.prompt([
        {
            name:'newProd',
            message:'Enter the name of the new product.'
        },
        {
            name:'newDepart',
            message:'What department is the product in?',
        },
        {
            name:'newPrice',
            message:'What is the price of the product?'
        },
        {
            name:'newInven',
            message:'What is the stock quantity of this product'
        }
    ]).then((answer)=>{
        let query = 'INSERT INTO products SET ?';
    connection.query(query,
        {
            product_name:answer.newProd,
            department_name:answer.newDepart,
            price:answer.newPrice,
            stock_quantity:answer.newInven
        },
        (err)=>{
            if(err)throw err;
            console.log('Product has been added')
        }
        )
        anotherAction();
    })

}
