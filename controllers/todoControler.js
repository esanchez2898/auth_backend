const db = require('../db.js')


// GET /items
const getAllTodos = async (req, res) => {
    const { idTodo, status } = req.query; // Get the status from query parameters
    const userId = req.id;
    try {
        let items;

if (idTodo) {
    items = await db('test_todos')
        .select('*')
        .where({ user_id: userId });
        console.log('condicional 1')
} else if (status) {
    items = await db('test_todos')
        .select('*')
        .andWhere({ status });
        console.log('condicional 1')
} else {
    items = await db('test_todos')
        .select('*')
        console.log('condicional 1')
}

        
        
        
        
        res.status(200).json({
            message: 'Data loaded successfully!',
            jsonResponse: items
        });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
}


// POST /createItem
const createNewTodo = async (req, res) => {
    const { name, status } = req.body;
    const userId = req.id; // Obtenemos el user_id desde el token
    console.log('userId: ', userId)

    try {
        const [newTodo] = await db('test_todos').insert({ todo: name, status, user_id: userId }).returning('*');
        res.status(201).json({ jsonResponse: newTodo });
    } catch (error) {
        res.status(500).json({ error });
    }
}





// DELETE /items/:id
const deleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCount = await db('test_todos').where({ id }).del();
        if (deletedCount) {
            res.status(200).json({ message: `Data with id:${id} deleted successfully!` });
        } else {
            res.status(404).json({ error: 'Item not found for deletion' });
        }
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
}



// PATCH /items/:id
const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    try {
        const [updatedItem] = status ? await db('test_todos').where({ id }).update({ status }).returning('*') : await db('test_todos').where({ id }).update({ todo: name }).returning('*')
        res.status(200).json({ message: 'Data updated successfully!', jsonResponse: updatedItem });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
}


/*
// PATCH /items/:id
const updateTodo2 = async (req, res) => { // the routes???????????????????????????????????????????????
    const { id } = req.params;
    const { name } = req.body;
    try {
        const [updatedItem] = await db('todos').where({ id }).update({ todo: name }).returning('*');
        res.status(200).json({ message: 'Data updated successfully!', jsonResponse: updatedItem });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
}



// PATCH /items/:id/status
const updateTodoStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const [statusUpdated] = await db('todos').where({ id }).update({ status }).returning('*');
        res.status(200).json({ message: `Todo status updated to ${status}`, jsonResponse: statusUpdated });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
}*/

module.exports = {
    getAllTodos,
    createNewTodo,
    deleteTodo,
    updateTodo
};


/*
// PATCH /items/:id
router.patch('/items/:id', async (req, res) => { // the routes???????????????????????????????????????????????


    const { id, status } = req.params;
    const { name } = req.body;
    //const { status } = req.body;

    try {        
        const [dataUpdate] = status ? await db('todos').where({ id }).update({ status }).returning('*') : await db('todos').where({ id }).update({ todo: name }).returning('*')               
        res.status(200).json({ message: 'Daaaaaaaaaaaaaaaaaaaaaaaaata updated successfully!', jsonResponse: dataUpdate });        
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});*/