package com.ssafy.getsbee.domain.follow.entity;

import com.ssafy.getsbee.domain.directory.entity.Directory;
import com.ssafy.getsbee.domain.member.entity.Member;
import com.ssafy.getsbee.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import static jakarta.persistence.FetchType.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE follow SET is_deleted = true WHERE follow_id = ?")
@SQLRestriction("is_deleted = false")
public class Follow extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_id")
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "following_member_id", nullable = false)
    private Member followingMember;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "followed_member_id", nullable = false)
    private Member followedMember;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "followed_directory_id", nullable = false)
    private Directory followedDirectory;

    @Column(name = "is_deleted", columnDefinition = "tinyint(1) not null default 0")
    private Boolean isDeleted;

    @Builder
    public Follow(Long id, Member followingMember, Member followedMember, Directory followedDirectory, Boolean isDeleted) {
        this.id = id;
        this.followingMember = followingMember;
        this.followedMember = followedMember;
        this.followedDirectory = followedDirectory;
        this.isDeleted = isDeleted;
    }
}
