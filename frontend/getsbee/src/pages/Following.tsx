import React, { useState, useEffect } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { useParams } from 'react-router-dom';
import { userInfoByEmailPrefixSelector } from '../recoil/userState';
import SideBar from '../components/Common/SideBar';
import Menu from '../components/Common/Menu';
import FollowingItem from '../components/Common/FollowingItem';
import userIcon2 from '../assets/userIcon2.png';
import FollowSearchBar from '../components/Common/FollowSearchBar';
import { getFollowingMemberListState } from '../recoil/FollowingState';

const Following: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const userInfoLoadable = useRecoilValueLoadable(userInfoByEmailPrefixSelector(username || ''));
  const [memberId, setMemberId] = useState<number | null>(null);
  useEffect(() => {
    if (userInfoLoadable.state === 'hasValue' && userInfoLoadable.contents) {
      setMemberId(userInfoLoadable.contents.memberId);
    }
  }, [userInfoLoadable.state, userInfoLoadable.contents]);

  const postLoadable = useRecoilValueLoadable(getFollowingMemberListState({ memberId: memberId || 0 }));

  const [followItems, setFollowItems] = useState<JSX.Element[]>([]);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 검색 결과를 상태에 저장
  useEffect(() => {
    if (postLoadable.state === 'hasValue' && postLoadable.contents && postLoadable.contents.data) {
      const items = postLoadable.contents.data.map((item) => <FollowingItem item={item} showStarIcon={true} />);
      if (isMounted) {
        setFollowItems(items);
      }
    }
  }, [postLoadable.state, postLoadable.contents, isMounted]);

  // const followItems = Array.from({ length: 7 }, (_, index) => <FollowingItem key={index} />);

  return (
    <div className="flex h-screen">
      <div className="w-[224px]">
        <SideBar memberId={memberId} />
      </div>
      <div className="flex flex-col w-5/6 ml-2">
        <div className="flex justify-between items-center border-b ml-6">
          <div className="flex mt-[75px] mb-[5px] ml-[10px]">
            <img className="w-[32px] h-[32px]" src={userIcon2} alt="userIcon" />
            <p className="flex items-center text-[#CC9C00] text-[24px] ml-2 font-bold">following</p>
          </div>
          <div className="mb-[35px] mr-[12px]">
            <Menu />
          </div>
        </div>
        <div className="flex justify-end mt-2 mr-5">
          <FollowSearchBar />
        </div>
        <div className="">
          <div className="grid lg:grid-cols-4 lg:gap-2 md:grid-cols-2 md:gap-1 justify-items-center">{followItems}</div>
        </div>
      </div>
    </div>
  );
};

export default Following;
