// src/recoil/PostDetailState.ts
import { atom, selectorFamily, useRecoilCallback } from 'recoil';
import { getPostDetail, deletePost, updatePost } from '../api/PostDetailApi';
import { toggleLikeAPI, toggleBookmarkAPI } from '../api/SocialAPI';

export interface Highlight {
  highlightId: number;
  content: string;
  color: string;
  startIndex: string;
  startOffset: number;
  lastIndex: number;
  lastOffset: number;
  type: string;
}

export interface Comment {
  commentId: number;
  content: string;
  memberId: string;
  memberName: string;
  memberImage: string;
  memberEmail: string;
  createdAt: string;
  isMyComment: boolean;
}

export interface Post {
  postId: number;
  title: string;
  url: string;
  note: string | null;
  thumbnailUrl: string;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  directoryId: number | null;
  directoryName: string | null;
  highlights: Highlight[];
  isLike: boolean;
  isBookmark: boolean;
  isMyPost: boolean;
  comments: Comment[];
  memberImage: string;
}

export const postDetailState = atom<Post | null>({
  key: 'postDetailState',
  default: null,
});

export const getPostDetailState = selectorFamily({
  key: 'getPostDetailState',
  get: (postId: number) => async () => {
    const data = await getPostDetail(postId);
    return data;
  },
});

export const useDeletePost = () => {
  return useRecoilCallback(({ reset }) => async (postId: number) => {
    await deletePost(postId);
    reset(postDetailState);
  });
};

export const useUpdatePost = () => {
  return useRecoilCallback(
    ({ set }) =>
      async (
        postId: number,
        data: {
          note: string;
          directoryId: number;
          isPublic: boolean;
          deleteHighlightIds: number[];
        },
      ) => {
        const updatedPost = await updatePost(postId, data);
        set(postDetailState, updatedPost);
      },
  );
};

export const useToggleLike = () => {
  return useRecoilCallback(({ set, snapshot }) => async (postId: number) => {
    const currentPost = await snapshot.getPromise(getPostDetailState(postId));

    if (!currentPost || !currentPost.data) {
      console.error('Post not found');
      return;
    }

    const originalLikeState = currentPost.data.isLike;
    const originalLikeCount = currentPost.data.likeCount;

    // Optimistically update the UI
    const updatePostState = (isLike: boolean) => {
      set(postDetailState, (prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          isLike: isLike,
          likeCount: isLike ? prevPost.likeCount + 1 : prevPost.likeCount - 1,
        };
      });
    };

    updatePostState(!originalLikeState);

    try {
      await toggleLikeAPI(postId, originalLikeState);

      // Refresh the post details to ensure server-client consistency
      const updatedPost = await getPostDetail(postId);
      set(postDetailState, updatedPost.data);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert the optimistic update if the API call failed
      updatePostState(originalLikeState);
      // Optionally, show an error message to the user
      // showErrorToast('Failed to update like status. Please try again.');
    }
  });
};

export const useToggleBookmark = () => {
  return useRecoilCallback(({ set, snapshot }) => async (postId: number) => {
    const currentPost = await snapshot.getPromise(getPostDetailState(postId));

    if (!currentPost || !currentPost.data) {
      console.error('Post not found');
      return;
    }

    const originalBookmarkState = currentPost.data.isBookmark;
    const originalBookmarkCount = currentPost.data.bookmarkCount;

    // Optimistically update the UI
    const updatePostState = (isBookmark: boolean) => {
      set(postDetailState, (prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          isBookmark: isBookmark,
          bookmarkCount: isBookmark ? prevPost.bookmarkCount + 1 : prevPost.bookmarkCount - 1,
        };
      });
    };

    updatePostState(!originalBookmarkState);

    try {
      await toggleBookmarkAPI(postId, originalBookmarkState);

      // Refresh the post details to ensure server-client consistency
      const updatedPost = await getPostDetail(postId);
      set(postDetailState, updatedPost.data);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      // Revert the optimistic update if the API call failed
      updatePostState(originalBookmarkState);
      // Optionally, show an error message to the user
      // showErrorToast('Failed to update bookmark status. Please try again.');
    }
  });
};
