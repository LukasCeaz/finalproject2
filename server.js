const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

//MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ceazz',
    password: 'HomeBeans123',
    database: 'all_inventory'
});
connection.connect();

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

//Routes

//Index route, displays index.html and three forms to add, edit, or remove items
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//Inventory route, displays all current inventory in a table
app.get('/inventory', (req, res) => {
    connection.query('SELECT * FROM current_inventory', (error, results) => {
        if (error) {
            console.error('Error fetching items:', error);
            res.status(500).send('Error fetching items');
        } else {
            res.render('inventory', { items: results });
        }
    });
});
//Route to add a new item to the table
app.post('/add-item', (req, res) => {
    const { item_name, item_quantity } = req.body;
    connection.query('INSERT INTO current_inventory (item_name, item_quantity) VALUES (?, ?)', [item_name, item_quantity], (error, result) => {
        if (error) {
            console.error('Error adding item:', error);
            res.status(500).send('Error adding item');
        } else {
            const message = `Item added: ${item_name}, Quantity: ${item_quantity}`;
            res.send(`<script>alert("${message}"); window.location.href = '/';</script>`);
        }
    });
});
//Route to edit an existing item in the table
app.post('/edit-item', (req, res) => {
    const { item_name, new_quantity } = req.body;
    connection.query('UPDATE current_inventory SET item_quantity = ? WHERE item_name = ?', [new_quantity, item_name], (error, result) => {
        if (error) {
            console.error('Error editing item:', error);
            res.status(500).send('Error editing item');
        } else {
            const message = `Item edited: ${item_name}, New Quantity: ${new_quantity}`;
            res.send(`<script>alert("${message}"); window.location.href = '/';</script>`);
        }
    });
});
//Route to remove an existing item from the table
app.post('/remove-item', (req, res) => {
    const { item_name } = req.body;
    connection.query('DELETE FROM current_inventory WHERE item_name = ?', [item_name], (error, result) => {
        if (error) {
            console.error('Error removing item:', error);
            res.status(500).send('Error removing item');
        } else {
            const message = `Item removed: ${item_name}`;
            res.send(`<script>alert("${message}"); window.location.href = '/';</script>`);
        }
    });
});

//Starts the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});