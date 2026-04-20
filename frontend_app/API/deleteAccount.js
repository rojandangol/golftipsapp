import axiosInstance from '../utils/axiosInstance';

export const deleteUserAccount = async (userId) => {
  try {
    const response = await axiosInstance.delete('/deleteAccount', {
      data: { user_id: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};