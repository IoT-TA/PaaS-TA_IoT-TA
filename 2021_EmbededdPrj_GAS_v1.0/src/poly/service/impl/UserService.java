package poly.service.impl;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import poly.dto.KakaoDTO;
import poly.dto.UserDTO;
import poly.persistance.mapper.IUserMapper;
import poly.service.IUserService;

/* @Auth 최별규
 * @Version 1.1
 * 유저의 로그인, 메인 페이지 관련 비스니스로직을 수행하는 class
 * ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.13   |  최별규     |  초안 작성
 * |              |             |
 * */

@Service("UserService")
public class UserService implements IUserService{
	private Logger log = Logger.getLogger(getClass().getName());
	//--------------------------------------------------리소스 선언부------------------------------------------------
	@Resource(name="UserMapper")
	private IUserMapper userMapper;
	//-----------------------------------------------------------------------------------------------------------------
	//-----------------------------------------로그인을 위한 메서드----------------------------------------------------
	@Override 
	public UserDTO getLoginInfo(UserDTO uDTO) {
		return userMapper.getLoginInfo(uDTO);
	}
	//------------------------------------카카오 로그인을 위한 메서드---------------------------------------------------
	@Override
	public KakaoDTO kakaoLoginForDgService(KakaoDTO pDTO) {
		return userMapper.kakaoLoginForDgService(pDTO);
	}
	//------------------------------------------아작스 호출 되는 로직-----------------------------------------------------
	@Override
	public int getEmpnoCheck(String empno) {
		int res = 0;
		UserDTO pDTO = new UserDTO(); 
		pDTO.setEmpno(empno); 
		UserDTO rDTO = new UserDTO(); 
		rDTO = userMapper.getEmpnoCheck(pDTO); 
		if(rDTO != null) { 
			res = 1; 
		} else {
			res = 0; 
		}
		return res; 
	}
	//------------------------------------------비밀번호 변경 시 인증 메일 발송을 위한 메서드 -------------------------------
	@Override
	public int getEmailCheck(String email) {
		int res = 0;
		UserDTO pDTO = new UserDTO();
		pDTO.setEmail(email);
		UserDTO rDTO = new UserDTO();
		rDTO = userMapper.getEmailCheck(pDTO);
		if(rDTO != null) { 
			res = 1;
		} else {
			res = 0;
		}
		return res;
	}
	//--------------------------------------------------사용자 정보 찾기-----------------------------------------------------
	@Override
	public UserDTO getFindUserInfo(UserDTO pDTO) {
		log.info("유저 이메일 찾기 프로세스 실행");
		UserDTO rDTO = userMapper.getFindUserInfo(pDTO);
		if(rDTO == null ) { 
			rDTO = new UserDTO();
		} 
		log.info("유저 이메일 찾기 프로세스 종료");
		return rDTO;
	}
	//-------------------------------------------------------회원 가입--------------------------------------------------------
	@Override
	public int insertUserInfo(UserDTO pDTO) {
		return userMapper.insertUserInfo(pDTO);
	}
	//--------------------------------------------------------회원정보 수정--------------------------------------------------
	@Override
	public int updateAdminInfo(UserDTO pDTO) {
		int success = userMapper.updateAdminInfo(pDTO);
		int res = 0; 
		if(success == 1) {
			res = 1;
		}
		return res; 
	}
}
