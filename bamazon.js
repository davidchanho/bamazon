'use strict';

// Makes error in node.js more readable
require('pretty-error').start();

// User Input
const inquirer = require('inquirer'); // allows user access to crud functionality

// Database
const mysql = require('mysql'); // adds database

// holds keys in another file for security purposes
require('dotenv').config();
const keys = require('./keys.js');

// Table
const { table } = require('table'); // format database into a table

var back = ''; //allows user to go back to previous menu after looking at readTable()

// creates sql connection
const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306, // default port for mysql
	user: keys.mysql.user, // hides user id
	password: keys.mysql.password, // hides user password
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	mainMenu();
});

function mainMenu() {
	inquirer
		.prompt([
			{
				type: 'list',
				choices: ['Customer', 'Manager', 'Exit'],
				name: 'mainMenu'
			}
		])
		.then(function(answer) {
			switch (answer.mainMenu) {
				case 'Customer':
					customerMenu();
					break;
				case 'Manager':
					managerMenu();
					break;
				// case 'Supervisor':
				// 	supervisorMenu();
				// 	break;
				default:
					process.exit();
					break;
			}
		});
}

function customerMenu() {
	back = 'customer';
	inquirer
		.prompt([
			{
				type: 'list',
				choices: ['View Shop', 'Buy', 'Back'],
				name: 'customerMenu'
			}
		])
		.then(function(answer) {
			switch (answer.customerMenu) {
				case 'View Shop':
					readTable();
					break;
				case 'Buy':
					buyMenu();
					break;
				default:
					goBack();
					break;
			}
		});
}
function readTable() {
	// adds header to table
	const header = [
		'Item Id',
		'Product Name',
		'Department',
		'Price (USD)',
		'Quantity'
	];
	let data = [header]; // row of data starting with header
	let dataAdd = []; // adds columns to data
	let output; // turns data into a table and outputs
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		for (let i = 0; i < res.length; i++) {
			dataAdd = [
				res[i].item_id,
				res[i].product_name,
				res[i].department_name,
				res[i].price,
				res[i].stock_quantity
			];
			data.push(dataAdd);
		}
		output = table(data);
		console.log(output);
		switch (back) {
			case 'customer':
				customerMenu();
				break;
			case 'manager':
				managerMenu();
				break;
			case 'supervisor':
				supervisorMenu();
				break;
			default:
				mainMenu();
				break;
		}
	});
}
function buyMenu() {
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					name: 'choice',
					type: 'list',
					choices: function() {
						var choiceArray = [];
						for (var i = 0; i < res.length; i++) {
							choiceArray.push(res[i].product_name);
						}
						return choiceArray;
					},
					message: 'What do you want to buy?'
				},
				{
					name: 'buyNumber',
					type: 'number',
					message: 'How Many?'
				},
				{
					name: 'buyConfirm',
					type: 'confirm',
					message: 'Are you sure?'
				}
			])
			.then(function(answer) {
				if (answer.buyConfirm) {
					var chosenProduct;
					for (var i = 0; i < res.length; i++) {
						if (res[i].product_name === answer.choice) {
							chosenProduct = res[i];
						}
					}
					var stockLeft = chosenProduct.stock_quantity - answer.buyNumber;
					if (stockLeft > 0) {
						connection.query(
							'UPDATE products SET ? WHERE ?',
							[
								{
									stock_quantity: stockLeft
								},
								{
									item_id: chosenProduct.item_id
								}
							],
							function(error) {
								if (error) throw err;
								console.log('bought!');
								customerMenu();
							}
						);
					} else {
						console.log('not enough in stock!');
						customerMenu();
					}
				} else {
					console.log('not enough quantity!');
					customerMenu();
				}
			});
	});
}

function managerMenu() {
	back = 'manager';
	inquirer
		.prompt([
			{
				type: 'list',
				choices: [
					'View Products for Sale',
					'View Low Inventory',
					'Add to Inventory',
					'Add New Product',
					'Back'
				],
				name: 'managerMenu'
			}
		])
		.then(function(answer) {
			switch (answer.managerMenu) {
				case 'View Products for Sale':
					readTable();
					break;
				case 'View Low Inventory':
					lowInventory();
					break;
				case 'Add to Inventory':
					addInventory();
					break;
				case 'Add New Product':
					newProduct();
					break;
				default:
					goBack();
					break;
			}
		});
}
function lowInventory() {
	connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(
		err,
		res
	) {
		if (err) throw err;
		const header = [
			// adds header to table
			'Item Id',
			'Product Name',
			'Department',
			'Price (USD)',
			'Quantity'
		];
		let data = [header]; // row of data starting with header
		let dataAdd = []; // adds columns to data
		let output; // turns data into a table and outputs
		for (let i = 0; i < res.length; i++) {
			dataAdd = [
				res[i].item_id,
				res[i].product_name,
				res[i].department_name,
				res[i].price,
				res[i].stock_quantity
			];
			data.push(dataAdd);
		}
		output = table(data);
		console.log(output);
		managerMenu();
	});
}
function addInventory() {
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					name: 'choice',
					type: 'list',
					choices: function() {
						var choiceArray = [];
						for (var i = 0; i < res.length; i++) {
							choiceArray.push(res[i].product_name);
						}
						return choiceArray;
					},
					message: 'What do you want to add?'
				},
				{
					name: 'addNumber',
					type: 'number',
					message: 'How Many?'
				},
				{
					name: 'addConfirm',
					type: 'confirm',
					message: 'Are you sure?'
				}
			])
			.then(function(answer) {
				if (answer.addConfirm) {
					var chosenProduct;
					for (var i = 0; i < res.length; i++) {
						if (res[i].product_name === answer.choice) {
							chosenProduct = res[i];
						}
					}
					var updateStock = chosenProduct.stock_quantity + answer.addNumber;
					connection.query(
						'UPDATE products SET ? WHERE ?',
						[
							{
								stock_quantity: updateStock
							},
							{
								item_id: chosenProduct.item_id
							}
						],
						function(error) {
							if (error) throw err;
							console.log('add!');
							managerMenu();
						}
					);
				} else {
					managerMenu();
				}
			});
	});
}
function newProduct() {
	inquirer
		.prompt([
			{
				name: 'product',
				type: 'input',
				message: 'Product:'
			},
			{
				name: 'department',
				type: 'input',
				message: 'Department:'
			},
			{
				name: 'price',
				type: 'input',
				message: 'Price:'
			},
			{
				name: 'stock',
				type: 'input',
				message: 'Stock Quantity:'
			},
			{
				name: 'addConfirm',
				type: 'confirm',
				message: 'Are You Sure?'
			}
		])
		.then(function(answer) {
			if (answer.addConfirm) {
				connection.query(
					'INSERT INTO products SET ?',
					{
						product_name: answer.product,
						department_name: answer.department,
						price: answer.stock,
						stock_quantity: answer.stock
					},
					function(err) {
						if (err) throw err;
						console.log('Product Added');
						managerMenu();
					}
				);
			} else {
				managerMenu();
			}
		});
}

// function supervisorMenu() {
// 	back = 'supervisor';
// 	inquirer
// 		.prompt([
// 			{
// 				type: 'list',
// 				choices: [
// 					'View Product Sales by Department',
// 					'Create New Department',
// 					'Back'
// 				],
// 				name: 'superMenu'
// 			}
// 		])
// 		.then(function(answer) {
// 			switch (answer.superMenu) {
// 				case 'View Product Sales by Department':
// 					salesByDepartment();
// 					break;
// 				case 'Create New Department':
// 					newDepartment();
// 					break;
// 				default:
// 					goBack();
// 					break;
// 			}
// 		});
// }

// function salesByDepartment() {
// 	connection.query('SELECT * FROM products', function(err, res) {
// 		if (err) throw err;
// 		const header = [
// 			// adds header to table
// 			'Item Id',
// 			'Product Name',
// 			'Department',
// 			'Price (USD)',
// 			'Quantity'
// 		];
// 		let data = [header]; // row of data starting with header
// 		let dataAdd = []; // adds columns to data
// 		let output;
// 		var chosenDepartment = res.department_name;
// 		for (var i = 0; i < chosenDepartment.length; i++) {
// 			chosenDepartment = res[i].department_name;
// 			connection.query(
// 				`SELECT * FROM products WHERE department_name = '${chosenDepartment}'`,
// 				function(err, res) {
// 					if (err) throw err;
// 					dataAdd.push(res);
// 					console.table(dataAdd);
// 				}
// 			);
// 		}
// 	});
// }
// function newDepartment() {
// 	inquirer
// 		.prompt([
// 			{
// 				name: 'addDepartment',
// 				type: 'input',
// 				message: 'Department:'
// 			},
// 			{
// 				name: 'addConfirm',
// 				type: 'confirm',
// 				message: 'Are You Sure?'
// 			}
// 		])
// 		.then(function(answer) {
// 			if (answer.addConfirm) {
// 				connection.query(
// 					'ALTER TABLE products ADD ? VARCHAR(100)',
// 					{
// 						department_name: answer.addDepartment
// 					},
// 					function(err) {
// 						if (err) throw err;
// 						console.log('Department Added');
// 						superMenu();
// 					}
// 				);
// 			} else {
// 				superMenu();
// 			}
// 		});
// }

function goBack() {
	inquirer
		.prompt([
			{
				message: 'Go Back to Main Menu?',
				type: 'confirm',
				name: 'back'
			}
		])
		.then(function(answer) {
			if (answer.back) {
				console.clear();
				mainMenu();
			} else {
				switch (back) {
					case 'customer':
						console.clear();
						customerMenu();
						break;
					case 'manager':
						console.clear();
						managerMenu();
						break;
					// case 'supervisor':
					// 	console.clear();
					// 	supervisorMenu();
					// 	break;
					default:
						console.clear();
						mainMenu();
						break;
				}
			}
		});
}
