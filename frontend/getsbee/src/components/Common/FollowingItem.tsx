import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { userState } from '../../recoil/userState';
import starIcon from '../../assets/starIcon.png';
import stargIcon from '../../assets/stargIcon.png';
import { deleteFollow, createFollow } from '../../api/FollowingListApi';

const FollowingItem = ({ item, showStarIcon }) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const memberEmail = item.member.memberEmail.split('@')[0];
  const currentUser = useRecoilValue(userState);
  const isOwnPage = currentUser?.email.split('@')[0] === username;
  const isFollowerPage = location.pathname.includes('follower');

  const handleStarClick = async () => {
    if (showStarIcon) {
      setIsDialogVisible(true);
    } else {
      await createFollow(item.directory.directoryId); // 팔로우 생성
      navigate(0); // 페이지 리로드
    }
  };

  const confirmDeletion = async () => {
    await deleteFollow(item.follow.followId); // 팔로우 취소
    navigate(0); // 페이지 리로드
    setIsDialogVisible(false); // 다이얼로그 닫기
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLImageElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleStarClick();
    }
  };

  const moveToMember = () => {
    navigate(`/myhive/${memberEmail}/${item.directory.directoryId}`);
  };

  const moveToMember1 = () => {
    navigate(`/myhive/${username}/${item.directory.directoryId}`);
  };

  const moveToMemberProfile = () => {
    navigate(`/myhive/${memberEmail}`);
  };

  return (
    <div
      className="relative border rounded-[6px] m-3 p-2 md:w-54 w-64"
      style={{
        height: '7rem',
        borderColor: '#EFEFEF',
        borderWidth: '2px',
      }}
    >
      <ConfirmDialog
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        message="정말로 팔로우를 취소하시겠습니까?"
        header="팔로우 취소"
        icon="pi pi-exclamation-triangle"
        accept={confirmDeletion}
        reject={() => setIsDialogVisible(false)}
      />
      {!isFollowerPage && (
        <div className="absolute top-2 left-4 text-[12px] text-blue-600">
          {item.follow.followCount}
          <span className="text-[10px]">명이 구독합니다.</span>
        </div>
      )}
      {!isFollowerPage ? (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <p
              className="ml-2 mt-4 text-[16px] text-[#5C5C5C] font-bold hover:text-blue-700"
              onClick={moveToMember}
              role="button"
              tabIndex={0}
            >
              {item.directory.directoryName.split(' / ').map((name, index) => (
                <React.Fragment key={index}>
                  {index > 0 && '/ '}
                  {name}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <p
              className="ml-2 mt-1 text-[16px] text-[#5C5C5C] font-bold hover:text-blue-700"
              onClick={moveToMember1}
              role="button"
              tabIndex={0}
            >
              {item.directory.directoryName.split(' / ').map((name, index) => (
                <React.Fragment key={index}>
                  {index > 0 && '/ '}
                  {name}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-4 flex items-center">
        <div className="flex" onClick={moveToMemberProfile} role="button" tabIndex={0}>
          <img src={item.member.picture} alt={item.member.memberName} className="w-[22px] h-[22px] rounded-full" />
          <p className="ml-1 text-[#5C5C5C] text-[14px]">{memberEmail}</p>
        </div>
      </div>

      {isOwnPage && showStarIcon && (
        <img
          className="w-[20px] h-[20px] absolute top-5 right-5 cursor-pointer"
          src={showStarIcon ? starIcon : stargIcon} // showStarIcon 상태에 따라 아이콘 변경
          alt="starIcon"
          onClick={handleStarClick}
          onKeyPress={handleKeyPress}
        />
      )}
    </div>
  );
};

export default FollowingItem;
