import { User } from '../models/User.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-__v');
    res.json(ApiResponse.success(users));
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(user));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(HTTP_STATUS.BAD_REQUEST)
        .json(ApiResponse.error(ERROR_MESSAGES.EMAIL_EXISTS));
    }
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND)
        .json(ApiResponse.error(ERROR_MESSAGES.USER_NOT_FOUND));
    }
    res.json(ApiResponse.success(user));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND)
        .json(ApiResponse.error(ERROR_MESSAGES.USER_NOT_FOUND));
    }
    res.json(ApiResponse.success(user));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND)
        .json(ApiResponse.error(ERROR_MESSAGES.USER_NOT_FOUND));
    }
    res.json(ApiResponse.success(null, HTTP_STATUS.OK, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
};