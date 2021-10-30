package poly.service.impl;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import poly.dto.MailDTO;
import poly.service.IMailService;
import poly.util.CmmUtil;

/* @Auth 최별규
 * @Version 1.1
 * 메일 발송 처리 비즈니스로직 서비스클래스
 * ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.23   |  최별규     |  초안 작성
 * |              |             |
 * */

@Service("MailService")
public class MailService implements IMailService{
	private Logger log = Logger.getLogger(this.getClass());
	//-------------------------------------------------------------------------전역 변수--------------------------------------------------------------
	// 메일 보안 유의 하기
	final String host = "smtp.naver.com";     // => 엔드 유저 
	final String user = "{ 이메일 }"; // => 이메일 넣기 format : 아이디@naver.com
	final String password = "{ 패스워드 }!1";             // => 비번 넣기
	// final String port = "587"; // google은 465, naver는 587
	//------------------------------------------------------------------------------------------------------------------------------------------------
	//-------------------------------------------------------------------메일 발송--------------------------------------------------------------------
	@Override
	public int doSendMail(MailDTO pDTO) {
		log.info(this.getClass().getName()+ "do.sendMail start!!");
		log.info(this.getClass().getName()+ " 보내는 사람 email : " + user);
		//메일 방송 성공여부 확인용 변수
		int res = 1;
		// 만약 DTO에 값이 없으면 강제로 메모리에 올림
		if (pDTO == null) {
			pDTO = new MailDTO();
		}
		
		String toMail = CmmUtil.nvl(pDTO.getToMail()); // 받는 사람
		log.info(this.getClass().getName()+ "받는 사람 이메일 : " + toMail);
		
		Properties props = new Properties();
		props.put("mail.smtp.host", host); // javax 외부 라이브러리에 보내는 사람 정보 설정
		props.put("mail.smtp.auth", "true"); // 인증여부 false는 인증 안함 무조건 true 하기
		//props.put("mail.smtp.port", port); // 포트 연결
		
		//--------------------------네이버 SMTP 서버 인증 처리 로직---------------------------
		Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(user, password);
			}
		});
		try {
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(user));
			message.setRecipient(Message.RecipientType.TO, new InternetAddress(toMail));
			//메일 제목
			message.setSubject(CmmUtil.nvl(pDTO.getTitle()));
			// 메일 내용
			message.setText(CmmUtil.nvl(pDTO.getContents()));
			// 메일 발송
			Transport.send(message);
		} catch (MessagingException e) {
			res = 0; // 메일발송이 실패하기 때문에 0으로 변경
			log.info("[ERROR]" + this.getClass() + ".doSendMail : " + e);
		} catch (Exception e) {
			res = 1;
			log.info("[ERROR]" + this.getClass() + ".doSendMail : " + e);
		}
		log.info(this.getClass() + "doSendMail end!!");
		return res;
	}
}
