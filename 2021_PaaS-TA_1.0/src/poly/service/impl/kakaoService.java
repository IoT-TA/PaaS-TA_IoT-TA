package poly.service.impl;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import poly.service.IKakaoService;
import poly.util.KakaoClass;

/* @Auth 최별규
 * @Version 1.1
 * 카카오로그인 처리 비즈니스로직 서비스클래스
 * ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.23   |  최별규     |  초안 작성
 * |              |             |
 * */

@Service("kakaoSerivce")
public class kakaoService implements IKakaoService{
	private Logger log = Logger.getLogger(getClass());
	//--------------------------------------------------------------------------리다이렉트 주소, key 전역 변수--------------------------------------------------------------
	// String Redirect_URI = "http://www.detectiongas.com/kakaoLogin.do"; // 실제 서버에 올릴 때는 이 주소 사용
	private final String Redirect_URI = "http://localhost:8080/kakaoLogin.do"; // 로컬 테스트용
	private final String RESTAPI_KEY = "27c978dd34db046ade506b3d1fb46013"; // RESTAPI_KEY 키
	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------로그인 후 사용자 인증코드 발급을 위한 코드----------------------------------------------------------------
	@Override
	public String getAuthcode() throws Exception {
		// 카카오 SAMPLE Request 예제 참고
		final String SampleRequest= "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id="; // 카카오 접속 앤드포인트  url
		final String forKakao = SampleRequest + RESTAPI_KEY + "&redirect_uri=" + Redirect_URI + "&response_type=code"; // 최종으로 카카오로 보낼 주소
		return forKakao;
	}
	//---------------------------------------토큰 발급 받기 인증코드를 매개변수로 받고, 인증토큰을 받기 위한 작업을 실시---------------------------------------------------------
	@Override
	public String getAccessToken(String code) throws Exception {
		String accessToken = ""; 
		//String refreshToken = "";
		final String reqURL = "https://kauth.kakao.com/oauth/token";

		try {
			URL url = new URL(reqURL); // URL로 보내야 하니깐 URL 객체 생성
			HttpURLConnection conn = (HttpURLConnection) url.openConnection(); // HttpURLConnection은 혼자 갹체를 생성하여 사용하지 못하고, 반드시 url 객체로 생성된 값을 
			conn.setRequestMethod("POST");									// 리턴 받아 형변환 하여 사용하여야 한다.
			conn.setDoOutput(true);											// 요청 방식은 post, url 연결을 출력용으로 사용하기 때문에 true 그렇지 않으면 false
			
            // buffer 스트림 객체 값 셋팅 후 요청 버퍼에 적제
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder(); // 스트링끼지 합치는 연산은 객체를 합쳐서 새로만드는 연산을 함 빌더는 기존 객체에 붙히는 연산으로 부하 적음 
            sb.append("grant_type=authorization_code");
            sb.append("&client_id=" + RESTAPI_KEY);  //앱 KEY VALUE
            sb.append("&redirect_uri=" + Redirect_URI); // 앱 CALLBACK 경로
            sb.append("&code=" + code);
            bw.write(sb.toString()); // 스트링 빌더로 데이터를 한곳에 적재 한 후
            log.info("보내기 : " + sb.toString());
            bw.flush(); // 버퍼에 담긴 값들을 실제로 넘김(버퍼를 비움)
            
            //  RETURN 값 result 변수에 저장
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream())); // 리턴 한 값 받음
            String br_line = ""; 
            String result = "";

            while ((br_line = br.readLine()) != null) { // 데이터가 null 이 아닐때 까지 계속해서 데이터를 불러오고
                result += br_line;
            }
            // 데이터를 다 불러 왔으면 
            JsonParser parser = new JsonParser(); // 제이슨을 파싱하여 오브젝트로 변환해준다. => 문자열 쪼개기로 하면 되지 않겠나? 데이터가 적으면 상관 없지만 많다면?
            log.info("parser : " + parser);
            JsonElement element = parser.parse(result); // (제이슨오브젝트 상속 받음)넘어온 데이터에서 제이슨 파싱을 한 후 값을 넣어준다. 
            log.info("Element : " + element);

            
            // 토큰 값 저장 및 리턴
            accessToken = element.getAsJsonObject().get("access_token").getAsString(); // 
            //refreshToken = element.getAsJsonObject().get("refresh_token").getAsString();

            br.close();
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
			log.info("토큰 발급 종료");
		}
        return accessToken;
	}
	//-----------------------------------------------------------------------------토큰을 매개로 유저 정보 가져오기-----------------------------------------------------------------
	@SuppressWarnings("resource")
	@Override
	public Map<String, Object> getUserInfo(String accessToken) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		String reqURL = "https://kapi.kakao.com/v2/user/me";

		try {
			URL url = new URL(reqURL);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			//요청에 필요한 Header에 포함될 내용
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			//----------------------------------------------------------로그인 성공 알림을 하는 카톡 메시지 전송---------------------------------------------------------------------
			KakaoClass kc = new KakaoClass();
			String resStr = kc.sendMyKakaoTalk(accessToken, "카카오톡 로그인 성공", "/");
			log.info(resStr);
			
			int responseCode = conn.getResponseCode();
			System.out.println("responseCode : " + responseCode);

			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

			String br_line = "";
			String result = "";

			while ((br_line = br.readLine()) != null) {
				result += br_line;
			}
			System.out.println("response:" + result);

			JsonParser parser = new JsonParser();
			JsonElement element = parser.parse(result);

			// JsonObject properties = element.getAsJsonObject().get("properties").getAsJsonObject(); // 카카오 설명서 참고
			// String nickname = properties.getAsJsonObject().get("nickname").getAsString();
			// String profile_image = properties.getAsJsonObject().get("profile_image").getAsString();
			JsonObject kakaoAccount = element.getAsJsonObject().get("kakao_account").getAsJsonObject();
			String kakaoEmail = kakaoAccount.getAsJsonObject().get("email").getAsString();

			resultMap.put("kakaoEmail", kakaoEmail);
		
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			log.info("사용자 정보 가져오기 완료");
		}
		return resultMap;
	}
	//------------------------------------------------------------------------------카카로 로그아웃 처리--------------------------------------------------------------------------------
	@Override
	public int kakaoLogOut(String accessToken) throws Exception {
		String reqURL = "https://kapi.kakao.com/v1/user/logout";
		int res = 0;
		try {
			URL url = new URL(reqURL);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");

			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			int responseCode = conn.getResponseCode();
			System.out.println("responseCode : " + responseCode);

			if (responseCode == 400) {
				throw new RuntimeException("카카오 로그아웃 도중 오류 발생");
			} else {
				res = 1;
				BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

				String br_line = "";
				String result = "";
				while ((br_line = br.readLine()) != null) {
					result += br_line;
				}
				log.info("결과 : " + result);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			log.info("로그아웃 종료");
		}
		return res;
	}
	
}
