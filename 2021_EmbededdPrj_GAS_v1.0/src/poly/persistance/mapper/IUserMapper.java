package poly.persistance.mapper;

import java.util.List;

import config.Mapper;
import poly.dto.KakaoDTO;
import poly.dto.UserDTO;

@Mapper("UserMapper")
public interface IUserMapper {

	UserDTO getLoginInfo(UserDTO uDTO); // 일반적인 로그인 시도

	List<UserDTO> getUserList(UserDTO uDTO); // 유저 정보 가져오기

	KakaoDTO kakaoLoginForDgService(KakaoDTO pDTO); // 카카오 로그인을 통한 로그인 후 유저정보 가져오기
	
	UserDTO getEmpnoCheck(UserDTO pDTO); // 로그인 시 아작스 

	UserDTO getEmailCheck(UserDTO pDTO); // 비밀번호 변경 시 인증 메일 발송을 위한 메서드 

	UserDTO getFindUserInfo(UserDTO rDTO); // 비밀번호 분실 시 입력받은 이메일로 사용자 정보 확인 하는 메서드

	int insertUserInfo(UserDTO pDTO); // 회원가입

	int updateAdminInfo(UserDTO pDTO); // 회원 정보 수정
	
}
