package poly.service;

import java.util.Map;

public interface IKakaoService {
	// 로그인 후 사용자 인증코드 발급 받기 위한 서비스
	String getAuthcode() throws Exception;
	// 카카오 인증 코드로 토큰 받기
	String getAccessToken(String code) throws Exception;
	// 토큰을 매개로 한 사용자 정보 가져오기 
	Map<String,Object> getUserInfo(String accessToken) throws Exception;
	// 카카오 로그아웃 구현
	int kakaoLogOut(String accessToken) throws Exception;
}
