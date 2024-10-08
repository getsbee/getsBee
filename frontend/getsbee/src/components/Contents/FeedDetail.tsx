import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import HighlightItem from './HighlightItem';
import { FeedDetailItem } from '../../api/FeedDetailAPI';

interface FeedDetailProps {
  detail: FeedDetailItem;
}

const FeedDetail: React.FC<FeedDetailProps> = React.memo(({ detail }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div
      className="mt-5 ml-3 mb-3 bg-white rounded-[12px]"
      style={{ boxShadow: 'none', width: '600px', height: 'auto' }}
    >
      <div className="p-0 mt-4 mr-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <div
              onClick={() => (window.location.href = `/myhive/${detail.memberEmail.split('@')[0]}`)}
              style={{ cursor: 'pointer' }}
            >
              <Avatar className="flex" image={detail.memberImage} size="large" shape="circle" />
            </div>
            <div className="ml-2 flex flex-col justify-center">
              <div
                onClick={() =>
                  (window.location.href = `/myhive/${detail.memberEmail.split('@')[0]}/${detail.directoryId}`)
                }
                className="hover:underline"
                style={{ cursor: 'pointer' }}
              >
                <h2 className="text-lg font-bold">
                  {detail.memberEmail.split('@')[0]} / {detail.directoryName}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-5 mr-2">
            <div className="flex items-center gap-1">
              <i className="pi pi-heart" style={{ fontSize: '1.2rem', color: '#8F8F8F' }} />
              <span className="mb-1" style={{ color: '#8F8F8F' }}>
                {detail.likeCount}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <i className="pi pi-eye" style={{ fontSize: '1.2rem', color: '#8F8F8F' }} />
              <span className="mb-1" style={{ color: '#8F8F8F' }}>
                {detail.viewCount}
              </span>
            </div>
          </div>
        </div>
        <div className="p-0">
          <p className="mt-2 ml-4" style={{ color: '#72736A' }}>
            {detail.highlights.length} Highlights & Insights
          </p>
          <div className="flex flex-col gap-2">
            {detail.highlights.slice(0, isExpanded ? detail.highlights.length : 1).map((highlight) => (
              <Link key={highlight.highlightId} to={`/posts/${detail.postId}`}>
                <HighlightItem text={highlight.content} color={highlight.color} />
              </Link>
            ))}
          </div>
          <div className="mt-2 mb-2 mr-2 text-right">
            <Button
              label={isExpanded ? 'Show less' : 'Show more'}
              onClick={toggleExpand}
              className="p-button-text"
              style={{ color: '#72736A', fontWeight: 'semibold' }}
            />
          </div>
        </div>
        <Divider className="mt-1 my-4 border-gray-300 mb-0" style={{ borderBottomWidth: '1px' }} />
        <div className="p-0">
          <div className="flex items-center gap-2">
            <p className="mt-4 mb-1 ml-4 text-[18px]">Insights</p>
          </div>
          <div className="mt-0 ml-4 mb-5">
            <p>{detail.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FeedDetail;
