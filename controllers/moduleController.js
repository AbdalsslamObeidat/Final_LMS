import ModuleModel from '../models/moduleModel.js';

const ModuleController = {
  async getModulesByCourse(req, res) {
    try {
      const { courseId } = req.params;
      const modules = await ModuleModel.findAllByCourse(courseId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getModuleById(req, res) {
    try {
      const { id } = req.params;
      const module = await ModuleModel.findById(id);
      if (!module) return res.status(404).json({ message: 'Module not found' });
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createModule(req, res) {
    try {
      const newModule = await ModuleModel.create(req.body);
      res.status(201).json(newModule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateModule(req, res) {
    try {
      const { id } = req.params;
      const updatedModule = await ModuleModel.update(id, req.body);
      if (!updatedModule) return res.status(404).json({ message: 'Module not found' });
      res.json(updatedModule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteModule(req, res) {
    try {
      const { id } = req.params;
      const deletedModule = await ModuleModel.delete(id);
      if (!deletedModule) return res.status(404).json({ message: 'Module not found' });
      res.json({ message: 'Module deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default ModuleController;
