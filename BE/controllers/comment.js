import Comment from "../models/Comment.js";
import User from "../models/User.js";
import moment from "moment";

export const createComment = async (req, res, next) => {
    try {
        const { comment, rate, userId, doctorId } = req.body;
        const newComment = new Comment({
            comment, 
            rate, 
            userId, 
            doctorId
        });
        const createdComment = await newComment.save();
        const user = await User.findById(userId);
        const doctor = await User.findById(doctorId);

        res.status(201).json({
            comment: createdComment.comment,
            rate: createdComment.rate,
            userName: user ? user.name : "Không xác định",
            doctorName: doctor ? doctor.name : "Không xác định",
        });
    } catch (error) {
        next(error);
    }
};

export const getCommentsByDoctorId = async (req, res, next) => {
    try {
        const doctorId = req.params.id;
        const comments = await Comment.find({ doctorId});

        const doctor = await User.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Bác sĩ không tồn tại' });
        }

        const commentsWithDoctor = [];
        await Promise.all(comments.map(async (comment) => {
            const user = await User.findById(comment.userId);
            const formattedDate = moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss');
            commentsWithDoctor.push({
                comment: comment.comment,
                rate: comment.rate,
                userName: user ? user.name : "Không xác định",
                doctorName: doctor.name,
                date: formattedDate,
            });
        }));

        res.status(200).json(commentsWithDoctor);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => { //delete commnet màn hình end user
    try {
        const commentId = req.params.id;
        const userId = req.user.id; 

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Bình luận không tồn tại' });
        }
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này' });
        }
        await comment.remove();

        res.status(200).json({ message: 'Bình luận đã được xóa thành công' });
    } catch (error) {
        next(error);
    }
};

//hàm xóa cho trang admin quản lý comment
export const deleteCmtAdmin = async (req, res, next) => {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("Bình luận đã được xóa thành công");
    } catch (err) {
      next(err);
    }
  };


