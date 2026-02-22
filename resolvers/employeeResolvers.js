const Employee = require('../models/Employee');

const employeeResolvers = {
  Query: {
    getAllEmployees: async () => {
      try {
        return await Employee.find();
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    searchEmployeeByEid: async (_, { id }) => {
      try {
        return await Employee.findById(id);
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    searchEmployeeByDepartmentOrDesignation: async (_, { department, designation }) => {
      try {
        const filter = {};
        if (department) filter.department = department;
        if (designation) filter.designation = designation;
        return await Employee.find(filter);
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },

  Mutation: {
    addEmployee: async (_, args) => {
      try {
        const newEmployee = new Employee(args);
        const savedEmployee = await newEmployee.save();
        return savedEmployee;
      } catch (err) {
        console.error('Error adding employee:', err);
        return null;
      }
    },

    updateEmployee: async (_, { id, ...updateData }) => {
      try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
          id,
          { ...updateData, updated_at: Date.now() },
          { new: true }
        );
        return updatedEmployee;
      } catch (err) {
        console.error('Error updating employee:', err);
        return null;
      }
    },

    deleteEmployee: async (_, { id }) => {
      try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        return deletedEmployee;
      } catch (err) {
        console.error('Error deleting employee:', err);
        return null;
      }
    },
  },
};

module.exports = employeeResolvers;