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
    showProducts();
});

const showProducts = () => {
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++){
            console.log(`
${res[i].item_id}. ${res[i].product_name} | ${res[i].department_name} | $${res[i].price} | ${res[i].stock_quantity}`)
        }
        promptUser(res);
    })
}
const buyMore = () => {
    inquirer.prompt([
        {
            type:'confirm',
            name:'more',
            message:'Would you like to buy anything else?'
        }
    ]).then((answer)=>{
        if(answer.more){
            showProducts();
        }else{
            process.exit();
        }
    })
}
const promptUser = (res) => {
    inquirer.prompt([
        {
            type:'input',
            name:'purchase',
            message:'\nWhich product would you like to purchase?'
        }
    ]).then((answer)=>{
        for(var i = 0; i < res.length;i++){
            if(answer.purchase == res[i].item_id || res[i].product_name === answer.purchase){
                let purchased = res[i]
                inquirer.prompt([
                    {
                        type:'input',
                        name:'quantity', 
                        message: `\nHow many ${purchased.product_name}s would you like to buy?`,
                        validate: (value) => {
                            if(isNaN(value)===false){
                                return true;
                            }else{
                                console.log('\n Please enter valid quantity.');
                            }  
                        }
                    }
                ]).then((answer) =>{
                    if(purchased.stock_quantity > answer.quantity){
                        connection.query('UPDATE products SET ? WHERE ?', 
                        [
                            {
                                stock_quantity: purchased.stock_quantity - answer.quantity
                            },
                            {
                                item_id: purchased.item_id
                            }
                        ]
                        )
                        console.log(`${answer.quantity} ${purchased.product_name}s = $${purchased.price * answer.quantity}`);
                    }else{
                        console.log('Insufficient quantity');
                    }
                    buyMore();
                });
            }
        }
    })
}