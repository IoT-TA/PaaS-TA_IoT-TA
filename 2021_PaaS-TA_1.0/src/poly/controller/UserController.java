package poly.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import poly.dto.MailDTO;
import poly.dto.UserDTO;
import poly.mongo.IMongoMapper;
import poly.service.IKakaoService;
import poly.service.IMailService;
import poly.service.IUserService;
import poly.util.CmmUtil;
import poly.util.EncryptUtil;
import poly.util.RamdomMail;

/* @Auth 최별규
 * @Version 1.1
 * 유저의 로그인, 메인 페이지 관련 매핑을 하는 class
 * ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.13   |  최별규     |  초안 작성
 * |              |             |
 * */

@Controller
public class UserController {
	private Logger log = Logger.getLogger(this.getClass().getName());
	//-----------------------------------------------------------리소스 선언부---------------------------------------------------
	@Resource(name = "UserService") // => 유저 로그인 관련
	private IUserService userService; 
	@Resource(name = "kakaoSerivce") // => 카카오로그인, 메시지 발송 
	private IKakaoService kakaoService;
	@Resource(name ="MailService") // => 메일 발송 관련
	private IMailService mailService;
	@Resource(name ="MongoMapper") // => 몽고 사용 관련
	private IMongoMapper mongoMapper;
	//---------------------------------------------------------------------------------------------------------------------------
	//-----------------------------------------------세션을 체크하여 권한이 있는지 확인-------------------------------------------
	@RequestMapping(value = "user/sessioCheck")
	public String userSessionCheck(HttpServletRequest request, HttpServletResponse response, Model model) {
		log.info(this.getClass() + "---------------------------------session null Start--------------------------------------");
		String msg = "로그인을 해주세요";
		String url = "/user/userLogin.do";
		log.info("url : " + url);
		log.info("msg : " + msg);
		model.addAttribute("msg", msg);
		model.addAttribute("url", url);
		log.info(this.getClass() + "----------------------------------------session null end!!-------------------------------");
		return "/user/redirect";
	}
	//-----------------------------------------------------인덱스 페이지 리턴----------------------------------------------------
	@RequestMapping(value="index") // 현재는 테스트용으로 사용된다.
	public String Index() throws Exception{
		log.info(this.getClass().getName() +  "index Start!!");
		log.info(this.getClass().getName() + "index Start!!");
		return "/index";
	}
	//----------------------------------------------------로그인페이지 보여주는 매핑----------------------------------------------
	@RequestMapping(value="user/userLogin")
	public String userLogin(HttpServletRequest request, ModelMap model) throws Exception{
		log.info(this.getClass() + "----------------------------------------user/userLogin start!!------------------------------");
		log.info(this.getClass() + "--------------------------------------------user/userLogin end!!----------------------------");
		return "/user/userLogin";
	}
	//------------------------------------------ID와 Password를 매개로 받아 로그인(권한부여) 기능을 매핑-------------------------
	@SuppressWarnings("unused")
	@RequestMapping(value="user/userLoginProc")
	public String userLoginProc(HttpServletRequest request, ModelMap model, HttpSession session) throws Exception{
		log.info(this.getClass() + "--------------------------------user/userLoginProc start!!----------------------------------");
		String empno = CmmUtil.nvl(request.getParameter("empno"));
		log.info("empno: " + empno);
		String pwd = CmmUtil.nvl(EncryptUtil.encHashSHA256(request.getParameter("pwd")));	
		log.info("pwd: " + pwd);
		//-----------------------------------------------------로그인 처리 로직-------------------------------------------------
		UserDTO uDTO;
		uDTO = new UserDTO(); 
		uDTO.setEmpno(empno);	
		uDTO.setPwd(pwd);
		log.info("empno2 : " + empno);
		log.info("pwd2 : " + pwd);
		uDTO = userService.getLoginInfo(uDTO); 
		uDTO.setEmpno(empno); 
		uDTO.setPwd(pwd); 
		//---------------------------------------------로그인 성공 유무에 따른 메시지와 경로 리턴 로직---------------------------
		String msg = "";
		String url = "";
		if (uDTO == null) {
			msg = "로그인 실패";
			url = "/user/userLogin.do";
		} else {
			log.info("uDTO ID : " + uDTO.getEmpno());
			log.info("uDTO PWD : " + uDTO.getPwd());
			log.info("uDTO NAME : " + uDTO.getName());

			msg = "로그인 성공";
			url = "/main/index.do";
			//----------------------------------차후 유효성 검사를 위해 세션에 값을 추가해줌--------------------------------------
			session.setAttribute("id", uDTO.getEmpno());
			session.setAttribute("name", uDTO.getName());
		}
		model.addAttribute("msg", msg);
		model.addAttribute("url", url);

		log.info(this.getClass() + "---------------------------------------user/userLoginProc END!!---------------------------------");
		return "/user/redirect";
	}
	//---------------------------------------------------------로그아웃 메서드---------------------------------------------------------
	@RequestMapping(value="user/logOut.do")
	public String logOut(HttpSession session, Model model) throws Exception{
		log.info(this.getClass() + "---------------------------------------user/logOut start!!--------------------------------------");
		String msg = "";
		String url = "";
		String accessToken = (String) session.getAttribute("kakaoToken"); // => 세션에서 엑세스토큰을 가져온다.
		//----------------------------------------------카카오로그아웃 로직-------------------------------------------------------------
		int res = kakaoService.kakaoLogOut(accessToken);//accessToken을 kakaoLogOut에 담아 카카오서비스로 보내준다.
		log.info("accessToken : " + accessToken); //엑세스 토큰 값 확인
	
		if (res == 1) {
			log.info("res : " + res);//1이면 성공
			log.info("res : " + res);
			
			msg = "로그아웃 성공";	
			url = "/user/userLogin.do";
			session.invalidate(); // 세션 정보 초기화		

			model.addAttribute("msg", msg);
			model.addAttribute("url", url);
		} else {
			msg = "로그아웃 실패";
			url = "/";
		}
		log.info(this.getClass() + "-------------------------------------------user/loginOut end!!-----------------------------------");
		return "/user/redirect";
	}
	
	/*###################################################################################################################################
	 *################################################################################################################################### 
	 *--------------- 원래 로그인 성공 후 메인페이지를 따로 찢는게 좋으니 차 후 찢는 작업 실시(21.09.13, by 최별규)
	 * ###################################################################################################################################
	 * ###################################################################################################################################
	 * */
	//------------------------------------------------로그인 성공 후 메인 페이지 보여주는 메서드----------------------------------------
	@RequestMapping(value="main/index")
	public String mainIndex(HttpServletRequest request, ModelMap model) throws Exception{
		log.info(this.getClass() + "---------------------------------------main/mainPage start!!---------------------------------------");
		log.info(this.getClass() + "------------------------------------------main/mainPage end!!--------------------------------------");
		return "/main/index"; 
	}
	//로그인 시 유저 정보 확인을 위한 아작스 처리 로직
	@RequestMapping(value = "user/loginEmpnoCheck")
	@ResponseBody
	public int userLoginEmpnoCheck(HttpServletRequest request, ModelMap model) throws Exception {
		log.info(this.getClass().getName() + "-------------------------------------user/loginEmailCheck Start!!----------------------");
		String empno = CmmUtil.nvl(request.getParameter("empno"));
		log.info("empno : " + empno);

		int res = userService.getEmpnoCheck(empno);
		log.info("res : " + res); //res 값을 확인

		log.info(this.getClass().getName() + "-------------------------------user/loginEmailCheck End!!--------------------------------");
		return res;
	}
	//------------------------------------------비밀번호 찾기 보여주는 페이지----------------------------------------------------------
	@RequestMapping(value = "user/findPassword")
	public String sodoi(HttpServletRequest request, ModelMap model) throws Exception {
		log.info(this.getClass() + "---------------------------user/findPassword Start!!-------------------");
		log.info(this.getClass() + "------------------------------user/findPassword end!!-------------------");
		return "/user/findPassword"; 
	}
	//----------------------------------------로그인 시 유저 정보 확인을 위한 아작스 처리 로직------------------------------------------
	@RequestMapping(value = "user/emailCheck")
	@ResponseBody
	public int userLoginEmilCheck(HttpServletRequest request, ModelMap model) throws Exception {
		log.info(this.getClass().getName() + "-------------------------------user/emailCheck Start!!--------------");
		String email = CmmUtil.nvl(request.getParameter("email"));	
		log.info("email : " + email);
		int res = userService.getEmailCheck(email);	
		log.info("res : " + res);
		log.info(this.getClass().getName() + "-------------------------------user/emailCheck End!!-------------------");
		return res; //함수를 마치면 res 값을 리턴한다.
	}
	//---------------------------------------회원가입 페이지-----------------------------------------------------
	@RequestMapping(value="/user/regUserPage")
	public String regUserPage() {
		log.info("-----------------------------regUserInfo page start!!-------------------------------");
		log.info("-----------------------------regUserInfo page end!!----------------------------------");
		return "/user/regUserInfo";
	}
	//--------------------------------------------------------회원가입 처리(가입 처리 프로세스)-------------------------------------------
	@RequestMapping(value = "user/regUserInfo")
	public String RegAdminProc(HttpServletRequest request, Model model) throws Exception {
		log.info(this.getClass() + "----------------------------------regAdmin Proc start!!---------------------");
		log.info(this.getClass() + "-----------------------------------regAdmin Proc start!!---------------------");
		String msg = "";
		String url = "";

		UserDTO pDTO = null;
		int res = 0; // 데이터 들어갔나 확인용
		//------------------------------------------------------HttpServ에서 값을 가져오는 부분-----------------------------------------
		// null 확인을 하고, 민감한 정보는 암호화 하였음
		String empno = CmmUtil.nvl(request.getParameter("empno"));
		String name = CmmUtil.nvl(request.getParameter("name"));
		String password = CmmUtil.nvl(EncryptUtil.encHashSHA256(request.getParameter("password"))); 
		String email = CmmUtil.nvl(request.getParameter("email"));
		String phone = CmmUtil.nvl(request.getParameter("phone"));
		//------------------------------------------------------------------------------------------------------------------------------
		log.info("empno : " + empno);
		log.info("name : " + name);
		log.info("password : " + password);
		log.info("email : " + email);
		log.info("phone : " + phone); 
		//-------------------------------------------------DTO에 모아서 DB로 저장시키기 위한 작업---------------------------------------
		pDTO = new UserDTO();
		pDTO.setEmpno(empno);
		pDTO.setName(name);
		pDTO.setEmail(email);
		pDTO.setPwd(password);
		pDTO.setPhone(phone);
		res = userService.insertUserInfo(pDTO); // DB저장을 위한 서비스 호출
		//------------------------------------------------------------------------------------------------------------------------------
		log.info("res 0이면 문제 발생 : " + res); 
		if (res == 1) { // 리턴 값이 1이면 성공이기 때문에 실행
			msg = "회원가입이 완료되었습니다.";
			url = "/user/userLogin.do";
			log.info("가입자 이름은 : " + pDTO.getName());
		} else { // 실패하면 실행
			msg = "가입 실패";
			url = "/user/regAdmin.do";
			log.info("실패");
		}
		model.addAttribute("msg", msg);
		model.addAttribute("url", url);
		pDTO = null;
		return "/user/redirect"; 
	}
	//--------------------------------------------비밀번호를 잊어버려서 변경을 위한 인증메일 발송---------------------------------------- 
	@RequestMapping(value="/user/changePassword")
	public String changePasswordPage(HttpServletRequest request, HttpSession session) {
		log.info("--------------------------------------changePasswordPage Start-------------------------");
		session.invalidate(); // 세션 정보 초기화
		String email = CmmUtil.nvl(request.getParameter("email"));	//이메일 정보를 받아옴
		String title = "GASGASGAS 관리자 입니다."; 
		//----------------------------------------------------------메일발송 로직 작성---------------------------------------------------
		@SuppressWarnings("unused")
		int res = 0;
		if (email != null) {
			UserDTO rDTO = new UserDTO();
			rDTO.setEmail(email);//rDTO에 파라미터로 받은 이메일 던져줌
			rDTO = userService.getFindUserInfo(rDTO);	
			String emailForDB = rDTO.getName();
			String empnoForDB = rDTO.getEmpno();

			if (emailForDB == null) { 
				log.info("가입된 회원정보가 없습니다.");
			} else {
				res = 1;
				UserDTO pDTO = null;
				MailDTO mail = null;
				//-------------------------------------------------메일 DTO에 저장------------------------------------------------------
				pDTO = new UserDTO();
				pDTO.setEmail(email);
				//----------------------------------------------------------------------------------------------------------------------
				//--------------------------------------------------메일 발송을 위한 로직-----------------------------------------------
				mail = new MailDTO();
				mail.setTitle(title);
				mail.setToMail(email);
				String random = RamdomMail.SendRamdomMail();
				mail.setContents("인증문자는 \n" + random + "\n입니다.");
				mailService.doSendMail(mail); // 메일 발송 시작
				log.info("random : " + random); // random 값을 확인
				//------------------------------------------------------추가 확인을 위한 세션 값 추가----------------------------------
				session = request.getSession();
				session.setAttribute("random", random); //세션이 랜덤값 저장해서, 확인을 위함
				session.setAttribute("sessionEmail", email);
				session.setAttribute("empno", empnoForDB);
			}
		}
		log.info("-----------------------------changePasswordPage END----------------------");
		return "/user/changePassword"; //함수가 끝나면 /user/changePassword 지점으로 반환한다.
	}
	//-------------------------------------------------------비밀번호 변경 처리-------------------------------------------------------
	@RequestMapping(value="/user/changePasswordProc")
	public String changePwdProc(HttpServletRequest request, HttpSession session, ModelMap model) throws Exception {
		log.info("-----------------------------------changePwdProc start!!-----------------------------------------");
		String empno = (String) session.getAttribute("empno");
		String password = CmmUtil.nvl(EncryptUtil.encHashSHA256(request.getParameter("password")));
		log.info("empno : " + empno);
		log.info("password : " + password);
		//--------------------------------------------------DB 저장을 위한 DTO 선언과 값 저장------------------------------------------
		UserDTO pDTO = new UserDTO();
		pDTO.setEmpno(empno);
		pDTO.setPwd(password);
		//-----------------------------------------------------------------------------------------------------------------------------
		int success = userService.updateAdminInfo(pDTO);//pDTO값을 updateAdminInfo에 넣어서 userService로 보낸다.
		//----------------------------------------------------------변경 성공 유무 처리--------------------------------------------------
		String msg = "";
		String url ="";
		if(success == 1) {
			msg = "정보 변경이 완료되었습니다. 로그인 해주세요.";
			url = "/user/userLogin.do";
		}
		//--------------------------------------------------Model 객체에 값을 넣어줌-----------------------------------------------------
		model.addAttribute("msg", msg);
		model.addAttribute("url", url);
		//---------------------------------------------------------------------------------------------------------------------------------
		log.info(this.getClass() + "-------------------------------------------regAdmin Page end!!-----------------");
		log.info("----------------------------------changePwdProc end!!-----------------------------");
		return "user/redirect";
	}
	//--------------------------------------------------------------추가?
}
