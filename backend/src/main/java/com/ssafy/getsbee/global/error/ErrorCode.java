package com.ssafy.getsbee.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    /** Common */
    _INTERNAL_SERVER_ERROR(INTERNAL_SERVER_ERROR, "C000", "서버 에러, 관리자에게 문의 바랍니다."),
    _BAD_REQUEST(BAD_REQUEST, "C001", "잘못된 요청 입니다."),
    _UNAUTHORIZED(UNAUTHORIZED, "C002", "인증되지 않았습니다."),
    _FORBIDDEN(FORBIDDEN, "C003", "권한이 없습니다."),
    _NOT_FOUND(NOT_FOUND, "C004", "찾을 수 없습니다."),
    _METHOD_NOT_ALLOWED(METHOD_NOT_ALLOWED, "C005", "지원하지 않는 Http Method 입니다."),
    INVALID_INPUT_VALUE(BAD_REQUEST, "C006", "Invalid Input Value"),

    /** Auth */
    UNAUTHORIZED_ACCESS(UNAUTHORIZED, "AUTH000", "권한이 없습니다."),
    FORBIDDEN_USER(FORBIDDEN, "AUTH001", "권한이 없는 유저 입니다"),
    INVALID_TOKEN(BAD_REQUEST, "AUTH002", "유효하지 않은 토큰 입니다"),
    LOGIN_FAILED(UNAUTHORIZED, "AUTH003", "로그인에 실패했습니다"),
    INVALID_AUTH_TOKEN(UNAUTHORIZED, "AUTH004", "권한 정보가 없는 토큰 입니다"),
    INVALID_REFRESH_TOKEN(BAD_REQUEST, "AUTH005", "Refresh Token이 유효하지 않습니다"),
    REFRESH_TOKEN_NOT_FOUND(BAD_REQUEST, "AUTH006", "로그아웃 된 사용자입니다"),
    GOOGLE_SERVER_ERROR(BAD_REQUEST, "AUTH007", "Google Server 에러입니다."),
    INVALID_ID_TOKEN(UNAUTHORIZED, "AUTH008", "ID 토큰 검증에 실패했습니다."),

    /** Member */
    DUPLICATE_MEMBER(BAD_REQUEST, "MEMBER000", "이미 존재하는 E-mail 입니다."),
    MEMBER_NOT_FOUND(BAD_REQUEST, "MEMBER001", "해당 회원이 존재하지 않습니다."),

    /** Post */
    DUPLICATE_POST(BAD_REQUEST, "POST000", "이미 존재하는 포스트 입니다."),
    POST_NOT_FOUND(BAD_REQUEST, "POST001", "해당 포스트는 존재하지 않습니다."),
    INVALID_POST_REQUEST(BAD_REQUEST, "POST002", "잘못된 포스트 리스트 요청입니다."),

    /** Highlight */
    DUPLICATE_HIGHLIGHT(BAD_REQUEST, "HIGHLIGHT000", "이미 존재하는 하이라이트 입니다."),
    HIGHLIGHT_NOT_FOUND(BAD_REQUEST, "HIGHLIGHT001", "해당 하이라이트는 존재하지 않습니다."),

    /** Directory */
    DIRECTORY_NOT_FOUND(BAD_REQUEST, "DIR000", "해당 디렉토리를 찾을 수 없습니다."),
    NEXT_DIRECTORY_NOT_FOUND(BAD_REQUEST, "DIR001", "다음 디렉토리를 찾을 수 없습니다."),
    PREV_DIRECTORY_NOT_FOUND(BAD_REQUEST, "DIR002", "이전 디렉토리를 찾을 수 없습니다."),
    CANT_DELETE_DEFAULT_DIRECTORY(BAD_REQUEST, "DIR003", "기본 디렉토리는 삭제할 수 없습니다."),

    /** Category */

    /** Block */
    BLOCK_NOT_FOUND(BAD_REQUEST, "BLOCK000", "해당 차단 도메인이 존재하지 않습니다."),
    DUPLICATE_BLOCK(BAD_REQUEST, "BLOCK001", "이미 차단한 도메인 입니다."),

    /** Like */
    LIKE_NOT_FOUND(BAD_REQUEST, "LIKE000", "해당 좋아요가 존재하지 않습니다."),
    DUPLICATE_LIKE(BAD_REQUEST, "LIKE001", "이미 존재하는 좋아요 입니다."),

    /** Comment */
    COMMENT_NOT_FOUND(BAD_REQUEST, "COMMENT000", "해당 댓글을 찾을 수 없습니다."),
    INVALID_COMMENT_REQUEST(BAD_REQUEST, "COMMENT001", "해당 댓글을 지울 수 없습니다."),

    /** Bookmark */
    DUPLICATE_BOOKMARK(BAD_REQUEST, "BOOKMARK000", "이미 존재하는 북마크 입니다."),
    BOOKMARK_NOT_FOUND(BAD_REQUEST, "BOOKMARK001", "해당 북마크는 존재하지 않습니다."),

    /** Interest */
    DUPLICATE_INTEREST(BAD_REQUEST, "INTEREST000", "이미 관심사를 입력했습니다."),

    /** Follow */
    WRONG_DIRECTORY_FOLLOW(BAD_REQUEST, "FOLLOW000", "해당 디렉토리는 팔로우 할 수 없습니다."),
    FOLLOW_NOT_FOUND(BAD_REQUEST, "FOLLOW001", "해당 팔로우를 찾을 수 없습니다."),
    UNFOLLOW_FAILED(BAD_REQUEST, "FOLLOW002", "잘못된 팔로우 취소 요청입니다."),

    /** CSV */
    CSV_ERROR(BAD_REQUEST, "CSV000", "CSV 생성에 실패했습니다."),

    /** AWS */
    AWS_SERVER_ERROR(BAD_REQUEST, "AWS000", "AWS 연동에 실패했습니다."),

    /**TXT**/
    TXT_ERROR(BAD_REQUEST, "TXT000", "TXT 생성에 실패했습니다."),

    /** PostDocument */
    DUPLICATE_POSTDOCUMENT(BAD_REQUEST, "POSTDOCUMENT000", "이미 존재하는 포스트 도큐먼트 입니다."),
    POSTDOCUMENT_NOT_FOUND(BAD_REQUEST, "POSTDOCUMENT001", "해당 포스트 도큐먼트는 존재하지 않습니다."),

    /** highlightDocument */
    DUPLICATE_HIGHLIGHTDOCUMENT(BAD_REQUEST, "HIGHLIGHTDOCUMENT000", "이미 존재하는 하이라이트 도규먼트 입니다."),
    HIGHLIGHTDOCUMENT_NOT_FOUND(BAD_REQUEST, "HIGHLIGHTDOCUMENT001", "해당 하이라이트 도큐먼트는 존재하지 않습니다."),

    /** DirectoryDocument */
    DUPLICATE_DIRECTORYDOCUMENT(BAD_REQUEST, "DIRECTORYDOCUMENT000", "이미 존재하는 디렉토리 도규먼트 입니다."),
    DIRECTORYDOCUMENT_NOT_FOUND(BAD_REQUEST, "DIRECTORYDOCUMENT001", "해당 디렉토리 도큐먼트는 존재하지 않습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
