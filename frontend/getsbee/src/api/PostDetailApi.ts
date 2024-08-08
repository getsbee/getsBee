import axios from './axiosConfig';

export const getPostDetail = async (postId: number) => {
  const response = await axios.get(`/posts/${postId}`);

  if (response.status !== 200) {
    throw new Error('Failed to get post detail');
  }

  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await axios.delete(`/posts/${postId}`);

  if (response.status !== 200) {
    throw new Error('Failed to delete post');
  }

  return response.data;
};
