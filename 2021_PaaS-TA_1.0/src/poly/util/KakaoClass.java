package poly.util;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;

/* @Auth 최별규
 * @Version 1.1
 * 센서데이터와 몽고 비동기 처리를 위한 컨트롤러
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.09.11   |  최별규     | 몽고에서 센서 데이터 가져오기 초안 작성
 * | 2021.09.13   |  최별규     | 센서 데이터가 기준 값 이상이면 알림(모달, 카카오) 보내기
 * |              |             |
 * */
//=> 푸시 알림은 유료라서 로그인 완료 후 친구 or 나에게 톡 보내는 것으로 대신 작업합니다.
/* TIP !!
 * 추가 동의 받는 양식 아래 양식 지키기
 * https://kauth.kakao.com/oauth/authorize?client_id={REST_API_KEY}&redirect_uri={REDIRECT_URI}&response_type=code&scope=account_email 
 * */

public class KakaoClass implements AutoCloseable{
	//-------------------------------------------------------리소스 선언부-------------------------------------------------
	String Redirect_URI = "{ 카카오에 등록된 리다이렉트 주소 }"; // 실제 서버에 올릴 때는 이 주소 사용
	private final String RESTAPI_KEY = "{ key }"; // 키
	private final String SEND_TALK_URL = "https://kapi.kakao.com/v2/api/talk/memo/default/send"; // 톡 보내는 URL
	private Logger log = Logger.getLogger(this.getClass().getName());
	private String accessToken = ""; // 메시지 보내기 위한 토큰을 저장하는 곳 로그인마다 갱신...
	//---------------------------------------------------------------------------------------------------------------------
	// 기본 생성자
	public KakaoClass() {
		
	}
	//--------------------------------------------내 자신에세 카카오톡 보내기-----------------------------------------------
	@SuppressWarnings({ "unchecked"})
	public String sendMyKakaoTalk(String accessToken, String message, String moveUrl){ 
		log.info("엑세스 토큰 : " + accessToken);
		this.setAccessToken(accessToken);
		// 메시지 입력 부
		String contents = message;
		String web_link = moveUrl;
		String mobile_web_link = moveUrl;
		//-----------------------------------link 키 value는 웹과 모바일로 나누어져 있어 맵에다 담았음---------------------
		HashMap<String, String> linkMap = new HashMap<String, String>();
		linkMap.put("web_url", web_link);
		linkMap.put("mobile_web_url", mobile_web_link);
		//--------------------------------------제이슨 형식의 데이터 생성을 위한 작업--------------------------------------- 
		JSONObject dataOne = new JSONObject();
		dataOne.put("object_type", "text");
		dataOne.put("text", contents);
		dataOne.put("link", linkMap);
		dataOne.put("button_title", "사이트이동");
		//----------------------------------------------접속을 위한 객체 선언부----------------------------------------------
		URL url = null; 
		HttpURLConnection conn = null;
		JSONObject template_object = null; // 가장 바깥 쪽의 JSON 최종 결과물 담을 곳임
		try {
			url = new URL(SEND_TALK_URL); // 카카오 접속 URL
			conn = (HttpURLConnection) url.openConnection();
			template_object = new JSONObject();
			template_object.put("template_object", dataOne); // 최종 JSON으로 만들기
			
			log.info("template_object  : " + template_object.toString());
			
			conn.setRequestMethod("POST");
			//--------------------------------------요청에 필요한 Header에 포함될 내용 헤더에 포함----------------------------
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			// conn.setRequestProperty("template_object", template_object.toString());
			//---------------------------------------------------데이터를 보내는 작업부분------------------------------------
			conn.setDoOutput(true);
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream())); // json 버퍼스트림으로 넣기
			StringBuilder sb = new StringBuilder();			
			sb.append("&template_object=");
			sb.append(dataOne);
			bw.write(sb.toString()); // 형변환하여 쓰기
			bw.flush(); // 결과물 버퍼에서 보내기
			bw.close(); // 리소스 닫기
			//--------------------------------------------응답코드 받는 곳-----------------------------------------------------
			int responseCode = conn.getResponseCode();
			log.info("responseCode : " + responseCode);
			//------------------------------------------------------------------------------------------------------------------
		} catch(IOException e) {
			log.info(e);
		}
		return "카톡에 메시지 전송 성공";
	}
	
	// 자동 리소스 닫기
	@Override
	public void close() throws Exception {
		log.info("Auto Close");
		
	}
	// 전역 변수 데이터 입력 출력을 위한 겟셋터
	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
	// 전역 변수 카카오로 보낼 주소 
	public String getSEND_TALK_URL() {
		return accessToken;
	}
}
