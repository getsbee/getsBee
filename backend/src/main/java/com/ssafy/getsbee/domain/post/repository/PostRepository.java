package com.ssafy.getsbee.domain.post.repository;

import com.ssafy.getsbee.domain.directory.entity.Directory;
import com.ssafy.getsbee.domain.member.entity.Member;
import com.ssafy.getsbee.domain.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long>, PostRepositoryCustom {

    Optional<Post> findByMemberAndUrl(Member member, String url);

    Optional<Post> findById(Long postId);

    Long countPostsByMember(Member member);

    Long countPostsByDirectory(Directory directory);
}
