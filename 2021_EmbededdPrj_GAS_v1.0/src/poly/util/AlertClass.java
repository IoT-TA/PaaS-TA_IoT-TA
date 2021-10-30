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
 * 센서 값이 기준값 이상이면 모달과 메시지를 보내는 기능을 정의한 클래스 => 모달을 차 후 생각
 * ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.09.13   |  최별규     |  초안 작성
 * |              |             |
 * */
public class AlertClass {
	private String kakaoUrl = "https://kapi.kakao.com/v2/api/talk/memo/default/send"; // 부모클래스의 자원 가져다 쓸 것임(카카오 요청 URL)
	private Logger log = Logger.getLogger(this.getClass());
	//----------------------------------------카카오 메시지 보내는 메서드-----------------------
	@SuppressWarnings("unchecked")
	public String sendAlertMessageForKakao(String accessToken, String message, String moveUrl) throws Exception{
		log.info("---------------------sendAlertMessageForKakao Start--------------------------");
		//----------------------------------------------------------------------------------------
		String contents = message;
		String web_link = moveUrl;
		String mobile_web_link = moveUrl;
		// link :  키 value는 웹과 모바일로 나누어져 있어 맵에다 담았음
		HashMap<String, String> linkMap = new HashMap<String, String>();
		linkMap.put("web_url", web_link);
		linkMap.put("mobile_web_url", mobile_web_link);
		//----------------------------------------------JSON 만들기------------------------------- 
		JSONObject dataOne = new JSONObject();
		dataOne.put("object_type", "text");
		dataOne.put("text", contents);
		dataOne.put("link", linkMap);
		dataOne.put("button_title", "사이트이동");
		//-----------------------------------------------------------------------------------------------
		//----------------------------카카오 서버 접속을 위한 객체 선언부--------------------------------
		URL url = null; 
		HttpURLConnection conn = null;
		JSONObject template_object = null; // 가장 바깥 쪽의 JSON 최종 결과물 담을 곳임
		try {
			url = new URL(kakaoUrl); // 카카오 접속 URL
			log.info("kakaoUrl : " + kakaoUrl);
			conn = (HttpURLConnection) url.openConnection();
			template_object = new JSONObject();
			template_object.put("template_object", dataOne); // 최종 JSON으로 만들기
			log.info("template_object  : " + template_object.toString());
			//-----------------------------------요청에 필요한 Header에 포함될 내용 헤더에 포함----------------------------
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			//----------------------------------------------------------------------------------------------------------------
			conn.setDoOutput(true);
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream())); // json 버퍼스트림으로 넣기
			StringBuilder sb = new StringBuilder();			
			sb.append("&template_object=");
			sb.append(dataOne);
			bw.write(sb.toString()); // 형변환하여 쓰기
			bw.flush(); // 결과물 버퍼에서 보내기
			bw.close(); // 리소스 닫기
			int responseCode = conn.getResponseCode();
			log.info("responseCode : " + responseCode);
		} catch(IOException e) {
			log.info(e);
		}
		log.info("---------------------sendAlertMessageForKakao End----------------------------");
		return "완료";
	}
}
