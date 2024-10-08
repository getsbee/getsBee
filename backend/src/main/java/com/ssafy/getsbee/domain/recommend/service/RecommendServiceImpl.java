package com.ssafy.getsbee.domain.recommend.service;

import com.ssafy.getsbee.domain.directory.service.DirectoryService;
import com.ssafy.getsbee.domain.interest.entity.Category;
import com.ssafy.getsbee.domain.interest.entity.Interest;
import com.ssafy.getsbee.domain.interest.repository.InterestRepository;
import com.ssafy.getsbee.domain.member.entity.Member;
import com.ssafy.getsbee.domain.member.service.MemberService;
import com.ssafy.getsbee.domain.post.entity.Post;
import com.ssafy.getsbee.domain.post.repository.PostRepository;
import com.ssafy.getsbee.domain.post.service.PostService;
import com.ssafy.getsbee.domain.recommend.dto.response.*;
import com.ssafy.getsbee.infra.personalize.PersonalizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.ssafy.getsbee.global.consts.StaticConst.*;

@Service
@RequiredArgsConstructor
public class RecommendServiceImpl implements RecommendService {

    private final MemberService memberService;
    private final PostService postService;
    private final DirectoryService directoryService;
    private final PersonalizeService personalizeService;
    private final InterestRepository interestRepository;
    private final PostRepository postRepository;

    @Value("${cloud.aws.personalize.campaign.personalize-post-arn}")
    String personalizePostArn;

    @Value("${cloud.aws.personalize.campaign.related-post-arn}")
    String relatedPostArn;

    @Override
    public Slice<RecommendResponse> recommendPersonalizePosts(Long memberId, Pageable pageable) {
        Member member = memberService.findById(memberId);
        if (isUpdatedRecommend(member.getUpdatedAt())) {
            List<Long> postIds = personalizeService.getRecommendations(personalizePostArn, memberId.toString(), null, RECOMMEND_SIZE);
            Slice<Post> posts = postRepository.findInPostIds(postIds, pageable);
            return mapToRecommendResponse(sortPostsByIds(posts, postIds, pageable.getPageSize()));
        }
        List<Category> categories = mapToCategory(interestRepository.findAllByMember(member));
        return mapToRecommendResponse(postRepository.findAllByCategory(categories, null, pageable));
    }

    @Override
    public Slice<RecommendResponse> recommendRelatedPosts(Long postId, Pageable pageable) {
        Post post = postService.findById(postId);
        if (isUpdatedRecommend(post.getUpdatedAt())) {
            List<Long> postIds = personalizeService.getRecommendations(relatedPostArn, null, postId.toString(), RECOMMEND_SIZE);
            Slice<Post> posts = postRepository.findInPostIds(postIds, pageable);
            return mapToRecommendResponse(sortPostsByIds(posts, postIds, pageable.getPageSize()));
        }
        List<Category> categories = mapToCategory(interestRepository.findByUrl(post.getUrl()));
        return mapToRecommendResponse(postRepository.findAllByCategory(categories, postId, pageable));
    }

    @Override
    public Slice<RecommendResponse> recommendPersonalizePostsByPersonalize(Long memberId, Pageable pageable) {
        List<Long> postIds = personalizeService.getRecommendations(personalizePostArn, memberId.toString(), null, RECOMMEND_SIZE);
        Slice<Post> posts = postRepository.findInPostIds(postIds, pageable);
        return mapToRecommendResponse(sortPostsByIds(posts, postIds, pageable.getPageSize()));
    }

    @Override
    public Slice<RecommendResponse> recommendRelatedPostsByPersonalize(Long postId, Pageable pageable) {
        List<Long> postIds = personalizeService.getRecommendations(relatedPostArn, null, postId.toString(), RECOMMEND_SIZE);
        Slice<Post> posts = postRepository.findInPostIds(postIds, pageable);
        return mapToRecommendResponse(sortPostsByIds(posts, postIds, pageable.getPageSize()));
    }

    private Boolean isUpdatedRecommend(LocalDateTime updatedAt) {
        LocalDateTime referenceDate = LocalDateTime.now().minus(1, ChronoUnit.DAYS);
        if (updatedAt.isBefore(referenceDate) || updatedAt.isEqual(referenceDate)) {
            return true;
        }
        return false;
    }

    private Slice<Post> sortPostsByIds(Slice<Post> posts, List<Long> postIds, int size) {
        List<Post> postList = posts.getContent();

        Map<Long, Integer> postIdIndexMap = IntStream.range(0, postIds.size())
                .boxed()
                .collect(Collectors.toMap(postIds::get, i -> i));

        List<Post> sortedPostList = postList.stream()
                .filter(post -> postIdIndexMap.containsKey(post.getId()))
                .sorted(Comparator.comparing(post -> postIdIndexMap.get(post.getId())))
                .limit(size)
                .toList();
        return new SliceImpl<>(sortedPostList, posts.getPageable(), posts.hasNext());
    }

    private List<Category> mapToCategory(List<Interest> interests) {
        return interests.stream()
                .map(Interest::getCategory)
                .toList();
    }

    private Slice<RecommendResponse> mapToRecommendResponse(Slice<Post> posts) {
        return filterDistinctPostsByUrl(posts).map(post ->
                RecommendResponse.of(PostResponse.of(post),
                        MemberResponse.of(post.getMember()),
                        DirectoryResponse.of(post.getDirectory().getId(), directoryService.findFullNameByDirectory(post.getDirectory())),
                        HighlightResponse.of(post.getHighlights())));
    }

    private Slice<Post> filterDistinctPostsByUrl(Slice<Post> posts) {
        Set<String> urls = new HashSet<>();

        List<Post> filteredPosts = posts.stream()
                .filter(post -> urls.add(post.getUrl()))
                .toList();
        return new SliceImpl<>(filteredPosts, posts.getPageable(), posts.hasNext());
    }
}
