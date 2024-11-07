const db = require('../db');

// Obtener todos los empleados
const getAllEmployees = async (req, res) => {
    try {
        const employees = await db('employees').select('*');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo empleado
const createNewEmployee = async (req, res) => {
    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
        return res.status(400).json({ message: 'First and last names are required.' });
    }

    try {
        const [newEmployee] = await db('employees')
        .insert({
            firstname,
            lastname
        }).returning(['id_employee', 'firstname', 'lastname']);
        
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un empleado
const updateEmployee = async (req, res) => {
    const { id, firstname, lastname } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Employee ID is required.' });
    }

    try {
        const updatedEmployee = await db('employees')
            .where({ id_employee: id })
            .update({ firstname, lastname })
            .returning(['id_employee', 'firstname', 'lastname']);

        if (!updatedEmployee.length) {
            return res.status(404).json({ message: `Employee ID ${id} not found` });
        }

        res.json(updatedEmployee[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un empleado
const deleteEmployee = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Employee ID is required.' });
    }

    try {
        const deletedEmployee = await db('employees').where({ id_employee: id }).del();

        if (!deletedEmployee) {
            return res.status(404).json({ message: `Employee ID ${id} not found` });
        }

        res.json({ message: `Employee ID ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un solo empleado
const getEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await db('employees').where({ id_employee: id }).first();

        if (!employee) {
            return res.status(404).json({ message: `Employee ID ${id} not found` });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};
