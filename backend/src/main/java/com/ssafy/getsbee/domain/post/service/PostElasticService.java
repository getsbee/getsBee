package com.ssafy.getsbee.domain.post.service;

import com.ssafy.getsbee.domain.directory.entity.Directory;
import com.ssafy.getsbee.domain.highlight.entity.Highlight;
import com.ssafy.getsbee.domain.post.entity.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface PostElasticService {

    void savePostDocument(Highlight highlight);

    void deletePostDocument(Post post);

    void deleteHighlightDocument(Highlight highlight);

    Slice<Long> findByKeyword(String keyword, Pageable pageable, Long postId);

    void updatePostDocument(Post post);

    Slice<Long> findMyHiveByKeyword(String query, Pageable pageable, Long postId, Directory directory);
}
