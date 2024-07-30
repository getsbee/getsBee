package com.ssafy.getsbee.domain.follow.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.getsbee.domain.directory.entity.Directory;
import com.ssafy.getsbee.domain.follow.entity.Follow;
import com.ssafy.getsbee.domain.member.entity.Member;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import static com.ssafy.getsbee.domain.follow.entity.QFollow.follow;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FollowRepositoryCustomImpl implements FollowRepositoryCustom{

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    @Override
    @Transactional
    public void createFollow(Member member, Directory directory) {
        Follow follow = Follow.builder()
                .followingMember(member)
                .followedMember(directory.getMember())
                .followedDirectory(directory)
                .isDeleted(false)
                .build();

        em.persist(follow);
    }

    @Override
    public Long countMemberFollowers(Member member) { //맴버의 디렉토리를 팔로우하는 사람들의 수
        return queryFactory
                .select(follow.count())
                .from(follow)
                .where(follow.followedMember.eq(member))
                .fetchOne();
    }


    @Override
    public Long countMemberFollowings(Member member) { //멤버가 팔로잉중인 디렉토리 수
        return queryFactory
                .select(follow.count())
                .from(follow)
                .where(follow.followingMember.eq(member))
                .fetchOne();
    }

    @Override
    public Long countDirectoryFollowers(Directory directory) { //특정 디렉토리를 팔로우하는 사람의 수
        return queryFactory
                .select(follow.count())
                .from(follow)
                .where(follow.followedDirectory.eq(directory))
                .fetchOne();
    }
}