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

  export const getMainService = async (req, res, next) => {
    try {
      const mainServiceId = req.params.id; 
      const mainService = await MainService.findById(mainServiceId).select('-_id -createdAt -updatedAt -__v').lean();
  
      if (!mainService) {
        return next(createError(404, 'Dịch vụ k tồn tại.'));
      }
        res.status(200).json(mainService);
    } catch (err) {
      next(err);
    }
  };
  export const getAllMainServices = async (req, res, next) => {
    try {
      const mainServices = await MainService.find({}, '-_id -createdAt -updatedAt -__v').lean();
  
      res.status(200).json(mainServices);
    } catch (err) {
      next(err);
    }
  };
  
  
  
