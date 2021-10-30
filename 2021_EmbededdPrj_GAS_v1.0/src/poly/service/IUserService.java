package poly.service;

import poly.dto.KakaoDTO;
import poly.dto.UserDTO;

public interface IUserService {

	UserDTO getLoginInfo(UserDTO uDTO); // 로그인 정보 입력                                                              

	KakaoDTO kakaoLoginForDgService(KakaoDTO pDTO); //  카카오 인증을 통해 받아온 이메일로 서비스 로그인 시도
	
	int getEmpnoCheck(String empno); // 로그인 아이디 확인 아작스

	int getEmailCheck(String email); // 비밀번호 변경 시 인증 메일 발송을 위한 메서드 

	UserDTO getFindUserInfo(UserDTO rDTO); // 비밓번호 분실시 입력된 이메일로 사용자 정보 찾아오는 메서드

	int insertUserInfo(UserDTO pDTO); // 회원가입

	int updateAdminInfo(UserDTO pDTO); // 비밀번호 변경


}
