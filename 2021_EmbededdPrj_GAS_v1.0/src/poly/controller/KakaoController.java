package poly.controller;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import poly.dto.KakaoDTO;
import poly.service.IKakaoService;
import poly.service.IUserService;

/* @Auth 최별규
 * @Version 1.1
 * 카카오로그인 처리 컨트롤러
 * ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.23   |  최별규     |  초안 작성
 * |              |             |
 * */

@Controller
public class KakaoController {
	private Logger log = Logger.getLogger(getClass());
	//-------------------------------------------------------------------------리소스 선언부---------------------------------------------------
	@Resource(name="kakaoSerivce")
	private IKakaoService kakaoService;
	@Resource(name="UserService")
	private IUserService userService;
	//--------------------------------------------------------------------------리소스 선언부----------------------------------------------------
	//--------------------------카카오 정보 제공을 위한 매핑 카카오 로그인 or 카카오 정보 제공 화면 보일 것임------------------------------------
	@RequestMapping(value="/kakaoLoginProc")
	public String kakaoLoginProc(ModelMap model) throws Exception {
		log.info(this.getClass().getName() + "kakaoLogin Start!");
		String forKakao = kakaoService.getAuthcode(); // 카카오 접속을 위한 실행
		String msg = "카카오 로그인 시도";
		String url = forKakao;
		model.addAttribute("msg", msg);
		model.addAttribute("url", url); // 완성된 호출 url을 jsp에서 처리하도록 리다이렉팅
		log.info(this.getClass().getName() + "kakaoLogin End");
		return "/user/redirect";
	}	
	/*--------------------------------------------로그인 성공하여 인증 코드를 받을 매핑 작업-------------------------------------------------------
	* 카카오에 등로된 리다이렉팅 url을 리퀘스트 매핑과 같게 해주어서 이쪽으로 매핑하도록 설정
	* 리퀘스트 매핑의  프로듀스 속성을 사용하여 응답 형식 지정 방식은 겟, 포스트 
	*모두 리스폰스 타입은 code로 고정 인증코드를 받은다음 서비스로 넘겨줌(인증토큰 받아야 하니까)
	**/
	@SuppressWarnings("unused")
	@RequestMapping(value = "/kakaoLogin", produces = "apllication/json", method = { RequestMethod.GET, RequestMethod.POST })
	public String kakaoAuthCodeProc(@RequestParam("code") String code, HttpServletRequest request,
			HttpServletResponse response, ModelMap model, HttpSession session) throws Exception {
		log.info(this.getClass().getName() + "kakaoAuthCodeProc Start!!!");
		//-----------------------------------------------------------변수 선언----------------------------------------------------------------------
		String kakaoToken = kakaoService.getAccessToken(code);
		String msg = "";
		String url = "";
		String id = "";
		String name = "";
		//------------------------------------------------------------------------------------------------------------------------------------------
		//------------------------------------------------카카오 로그인 성공 후 사용자 정보 가져오기------------------------------------------------
		Map<String, Object> result = kakaoService.getUserInfo(kakaoToken);
		String kakaoEmail = result.get("kakaoEmail").toString();
		log.info("카카오 이메일 : " + kakaoEmail);
		//----------------------------------------------------------------데이터 확인---------------------------------------------------------------
		if (result == null) {
			msg = "인증 실패";
			url = "/user/userLogin.do";
		} else {
			KakaoDTO pDTO = new KakaoDTO(); // 값 전달 용
			KakaoDTO rDTO = new KakaoDTO(); // 값 받아오기 용
			pDTO.setKakaoMeail(kakaoEmail);	
			rDTO = userService.kakaoLoginForDgService(pDTO);	//userService에서 MAPPER를 연결하여 값 받아옴
			if (rDTO != null) {
				id = rDTO.getId();
				name = rDTO.getName();
				log.info("유저 이름 : " + id);
				log.info("유저 아이디 : " + name);
				msg = "카카오 로그인 성공 되었습니다.";
				url = "/main/index.do";
			} else {
				msg = "GASGASGAS 서비스에 회원가입 먼저 해주세요!";
				url = "/user/userLogin.do";
			}

		}
		/* 로그아웃 처리 시, 사용할 토큰 값 */
		session.setAttribute("kakaoToken", kakaoToken);		//세션 값으로 정보 유지
		session.setAttribute("id", id);
		session.setAttribute("name", name);

		model.addAttribute("msg", msg);
		msg = "로그아웃 완료";
		model.addAttribute("url", url);

		return "/user/redirect";
	}
}
