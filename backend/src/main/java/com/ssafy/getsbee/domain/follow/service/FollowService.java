package com.ssafy.getsbee.domain.follow.service;

import com.ssafy.getsbee.domain.directory.entity.Directory;
import com.ssafy.getsbee.domain.follow.dto.response.FollowDirectoryResponse;
import com.ssafy.getsbee.domain.follow.dto.response.HiveInfoResponse;
import com.ssafy.getsbee.domain.member.entity.Member;
import java.util.List;

public interface FollowService {

    void createFollow(Long DirectoryId);

    void deleteFollow(Long followId);

    List<FollowDirectoryResponse> findFollowedDirectories(Long memberId);

    List<FollowDirectoryResponse> findFollowingDirectories(Long memberId);

    HiveInfoResponse getHiveInfo(Long memberId);
}
