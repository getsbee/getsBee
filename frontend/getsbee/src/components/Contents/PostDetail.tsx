import React, { useState, KeyboardEvent } from 'react';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import DirSelection from '../Directory/DirSelection';
import Highlight from './Highlight';
import PostUpdate from './PostUpdate';
import publicIcon from '../../assets/publicIcon.png';
import privateIcon from '../../assets/privateIcon.png';

interface Highlight {
  content: string;
  color: string;
}

interface Comment {
  id: string;
  name: string;
  comment: string;
  date: string;
  avatar: string;
}

interface Post {
  title: string;
  url: string;
  viewCount: string;
  likeCount: string;
  directoryName: string;
  isPublic: boolean;
  isLike: boolean;
  note: string;
  avatar: string;
  highlights: Highlight[];
  comments: Comment[];
}

function PostDetail() {
  const [value, setValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isMyPost] = useState(false);
  const [post, setPost] = useState<Post>({
    title: 'There are many variations of passages of Lorem Ipsum ',
    url: 'https://www.figma.com/design/6haHr5BJLpFYfi0soGyEYu/',
    viewCount: '3.7k',
    likeCount: '3.7k',
    directoryName: 'Hong BoemSun / IT / Cloud',
    isPublic: true,
    isLike: false,
    note: 'ers, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default',
    avatar: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
    highlights: [
      {
        content:
          'ers, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default',
        color: '#F9F47F',
      },
      {
        content: 'ers, as opposed to using Content here, content here, making it look like readable',
        color: '#FFB6C6',
      },
    ],
    comments: [
      {
        id: '1',
        name: 'Hong Bumsun',
        comment: '좋은 글 잘 보았습니다.',
        date: '2024/07/31 10:27',
        avatar: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
      },
    ],
  });

  const publicClass = post.isPublic ? 'bg-[#DBEAFE] text-[#3B559C]' : 'bg-red-200 text-red-800';
  const publicText = post.isPublic ? 'Public' : 'Private';
  const iconSrc = post.isPublic ? publicIcon : privateIcon;

  const handleUpdateSave = (updatedPost: Post) => {
    setPost(updatedPost);
    setIsEditing(false);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return <PostUpdate post={post} onSave={handleUpdateSave} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="mb-4" style={{ width: '500px', height: 'auto' }}>
      <div className="flex justify-between mt-3">
        {isMyPost && (
          <div className="flex items-center">
            <span className={`flex items-center text-[12px] font-semibold px-2 py-1 rounded-full ${publicClass}`}>
              <img className="flex w-[20px] h-[20px] mr-1" src={iconSrc} alt="statusIcon" />
              {publicText}
            </span>
          </div>
        )}
        <div className="flex items-center">{isMyPost && <DirSelection />}</div>
      </div>
      <div className="flex mt-3">
        <img src={post.avatar} alt={post.title} className="mt-3 ml-3 w-[80px] h-[80px]" />
        <div className="ml-4 flex-1">
          <p className="text-[14px] font-semibold" style={{ color: '#8D8D8D' }}>
            {post.directoryName}
          </p>
          <h2 className="text-[18px] font-bold mr-1">{post.title}</h2>
          <a href={post.url} className="text-[12px] font-semibold hover:underline block" style={{ color: '#8D8D8D' }}>
            {post.url}
          </a>
          <div className="flex justify-end text-[12px] font-semibold mt-3" style={{ color: '#8D8D8D' }}>
            <div className="flex items-center mr-4">
              <i className={`pi pi-heart mr-1`} />
              <span>{post.likeCount}</span>
            </div>
            <div className="flex items-center">
              <i className={`pi pi-eye mr-1`} />
              <span className="mr-3">{post.viewCount}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-2">
        <Divider className="mt-1 mb-2 border-gray-300" style={{ borderBottomWidth: '1px' }} />
      </div>
      <div className="flex justify-between items-center mt-3 ml-3">
        <h2 className="text-[18px] font-bold">Highlights</h2>
        <div className="flex">
          {isMyPost && (
            <i
              className="pi pi-file-edit mr-2 text-[#8D8D8D] hover:text-[#07294D] cursor-pointer"
              title="Edit"
              onClick={() => setIsEditing(true)}
              onKeyPress={handleKeyPress}
              tabIndex={0}
              role="button"
              aria-label="Edit"
            />
          )}
          <i className="pi pi-heart mr-2 text-[#8D8D8D] hover:text-[#07294D] cursor-pointer" title="Like" />
          <i className="pi pi-share-alt mr-2 text-[#8D8D8D] hover:text-[#07294D] cursor-pointer" title="Share" />
          <i className="pi pi-bookmark mr-4 text-[#8D8D8D] hover:text-[#07294D] cursor-pointer" title="Bookmark" />
        </div>
      </div>
      <div className="mt-4 ml-6">
        {post.highlights.map((highlight) => (
          <Highlight key={highlight.content} text={highlight.content} color={highlight.color} className="mb-4" />
        ))}
      </div>
      <div className="flex mt-3 ml-3">
        <h2 className="text-[18px] font-bold">Notes</h2>
      </div>
      <div className="mt-1 ml-6">{post.note}</div>
      <div className="flex mt-3 ml-3">
        <h2 className="text-[18px] font-bold">Comments</h2>
      </div>
      <div className="relative mt-3 ml-3">
        <div className="card flex flex-col">
          <InputTextarea
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
            rows={2}
            style={{ width: '100%' }}
          />
          <button
            type="button"
            style={{
              backgroundColor: '#1E88E5',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '50px',
              height: '30px',
              fontSize: '14px',
              marginTop: '10px',
              alignSelf: 'flex-end',
            }}
          >
            등록
          </button>
        </div>
      </div>
      <div className="ml-3">
        {post.comments.map((comment) => (
          <div key={comment.id} className="flex items-start mt-3">
            <img src={comment.avatar} alt="avatar" className="w-[30px] h-[30px] rounded-full" />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <p className="font-semibold mr-2">{comment.name}</p>
                <p className="text-[12px]" style={{ color: '#8D8D8D' }}>
                  {comment.date}
                </p>
              </div>
              <p className="text-[14px]">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDetail;
