import MainService from '../models/MainServices.js';

export const createMainService = async (req, res, next) => {
    try {
      const data = req.body;
      const { name, description } = data;
      const newMainService = new MainService({
        name,
        description,
      });
      await newMainService.save();
  
      const createdMainService = await MainService.findById(newMainService._id)
        .select('-_id -createdAt -updatedAt -__v')
        .lean();
      res.status(201).json({ message: 'Dịch vụ chính đã được tạo.', mainService: createdMainService });
    } catch (err) {
      next(err);
    }
  };

  
  
