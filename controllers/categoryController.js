import CategoryModel from '../models/categoryModel.js';

const CategoryController = {
  // Create a new category
  async create(req, res) {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    try {
      const category = await CategoryModel.create({ name });
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create category' });
    }
  },

  // Get all categories
  async getAll(req, res) {
    try {
      const categories = await CategoryModel.findAll();
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  },

  // Get one category by id
  async getById(req, res) {
    const { id } = req.params;
    try {
      const category = await CategoryModel.findById(id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch category' });
    }
  },

  // Update category
  async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    try {
      const updatedCategory = await CategoryModel.update(id, { name });
      if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
      res.json(updatedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update category' });
    }
  },

  // Delete category
  async delete(req, res) {
    const { id } = req.params;

    try {
      await CategoryModel.delete(id);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  }
};

export default CategoryController;
