package poly.controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.apache.tomcat.jni.User;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import poly.dto.MongoDTO;
import poly.dto.UserDTO;
import poly.mongo.IMongoMapper;
import poly.service.IUserService;
import poly.util.AlertClass;
import poly.util.HardwareCont;
import sun.util.resources.cldr.aa.CalendarData_aa_ER;

/* @Auth 최별규
 * @Version 1.1
 * 센서데이터와 몽고 비동기 처리를 위한 컨트롤러
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.09.11   |  최별규     | 몽고에서 센서 데이터 가져오기 초안 작성
 * | 2021.09.13   |  최별규     | 센서 데이터가 기준 값 이상이면 알림(모달, 카카오) 보내기
 * | 2021.09.15   |  최별규     | 최종 수정
 * */

@Controller
public class AsyncSensorController {
	private Logger log = Logger.getLogger(this.getClass().getName());
	// --------------------------------------------------------------리소스선언부--------------------------------------------------------
	@Resource(name = "MongoMapper")
	private IMongoMapper mongoMapper;
	@Resource(name = "UserService")
	private IUserService userService;
	static int mqttNum = 0; // => 하드웨어 통제 변수
	static final int LIMIT = 250; // => 임계값

	static boolean operationFlag;
	static int fanStopTime;
	static int fanStartTime;

	// -----------------------------------------------------------------------------------------------------------------------------------
	// -------------------------------------------------------------------비동기로 몽고에서
	// 값 가져옴-------------------------------------
	@SuppressWarnings({ "null", "unchecked" })
	@RequestMapping(value = "/sensor/getAsyncSensorData", method = RequestMethod.GET)
	public @ResponseBody Object sensorDataAsycUpdate(HttpServletRequest request, ModelMap model, HttpSession session)
			throws Exception {
		log.info("----------------------------------sensorDataAsycUpdate Start------------------------------");
		JSONObject sensorObj = new JSONObject(); // => 화면에 JSON 형식으로 뿌려주기 위한 객체
		HardwareCont hard = null; // => 하드웨어 컨트롤 객체
		@SuppressWarnings("resource")
		AlertClass alert = new AlertClass();
		String accessToken = (String) session.getAttribute("kakaoToken"); // 카톡 발송을 위한 세션 값 가져오기
		log.info("accessToken : " + accessToken);
		String message = "";
		// ------------------------------------------------------------------------------------------------------------------------------
		// ----------------------------------------------몽고에서 데이터 가져오는
		// 로직----------------------------------------------------
		List<MongoDTO> dailySensor;
		// < 가장 최근의 센서 번호와 시간 가져오기
		dailySensor = mongoMapper.getDailySensorData();
		for (MongoDTO e : dailySensor) { // 데이터 확인
			log.info(e.getDate());
			log.info(e.getSENSOR_NUMBER());
		}
		// < 최근 정보에 해당하는 센서 데이터 가져오기 WHERE로 뽑힌 가스농도 가져오기 >
		List<MongoDTO> sensorDataMatch;
		sensorDataMatch = mongoMapper.getSensorDataMatch(dailySensor);
		// --------------------------------------------------------List를 JSON으로
		// 변환해주기----------------------------------------------
		int cnt = 1;
		for (MongoDTO e : sensorDataMatch) {
			sensorObj.put(e.getSENSOR_NUMBER(), e.getSENSOR_DATA());
			log.info(cnt + "번 센서번호 : " + e.getSENSOR_NUMBER());
			log.info(cnt + "번 가스농도 : " + e.getSENSOR_DATA());
			// -----------------------------------임계값 이상의 센서 농도가 들어온다면 kakaoTalk을
			// 발송한다.--------------------------------
			if (Integer.parseInt(e.getSENSOR_DATA()) <= LIMIT) {
				message = e.getSENSOR_NUMBER() + "번 센서에서 많은 양의 가스가 탐지되었습니다.";
				String resStr = alert.sendAlertMessageForKakao(accessToken, message, "/");
				log.info(resStr);
			}
			// -----------------------------------------------------------------------------------------------------------------------------
			cnt++;
		}
		// --------------------------------------------------------------------------------------------------------------------------------
		int indexNum = 0;
		int[] resNumArr = new int[3];
		int[] resHourMinute = new int[3];

		for (MongoDTO e : sensorDataMatch) {
			resNumArr[indexNum] = Integer.parseInt(e.getSENSOR_DATA());
			String time = e.getDate();
			int dateLen = time.length();
			int hour = Integer.parseInt(time.substring(dateLen-8, dateLen-6)) * 60;
			int minute = Integer.parseInt(time.substring(dateLen-5, dateLen-3));

			resHourMinute[indexNum++] = hour + minute;
//			indexNum++;
		}
		int avgCO2 = (resNumArr[0] + resNumArr[1]) / 2;

		UserDTO pDTO = new UserDTO();
		log.info("email : "+(String) session.getAttribute("email"));
		pDTO.setEmail(((String) session.getAttribute("email")).trim());
		log.info("pDTO : "+pDTO);
		UserDTO rDTO = userService.getMinutesLineByEmail(pDTO);
		log.info("rDTO : "+rDTO);
		String[] split = rDTO.getMinutesLine().split(" ");
		int minutesCycle = Integer.parseInt(split[0]); // 환풍기 배치 순환주기
		int uptime = Integer.parseInt(split[1]); // 환풍기 가동시간
		Calendar cal = Calendar.getInstance();
		int currentHour = cal.get(Calendar.HOUR_OF_DAY);
		int currentMinute = cal.get(Calendar.MINUTE);
		int currentHourMinute = currentHour * 60 + currentMinute;
		
		int startDiff = currentHourMinute - fanStartTime;
		if (startDiff < 0) startDiff += 24*60;
		int stopDiff = currentHourMinute - fanStopTime;
		if (stopDiff < 0) startDiff += 24*60;

//		log.info("fanStartTime : "+fanStartTime);
//		log.info("fanStopTime : "+fanStopTime);
//		log.info("currentHourMinute : "+currentHourMinute);
//		log.info("startDiff : "+startDiff);
//		log.info("stopDiff : "+stopDiff);
//		log.info("operationFlag : "+operationFlag);
//		log.info("currentHour : "+currentHour);
//		log.info("currentMinute : "+currentMinute);
		
		if (operationFlag) {
			if (avgCO2 > LIMIT) {
				fanStartTime = 0;
			} else if (fanStartTime == 0 || startDiff >= uptime) {
				mqttNum = 0;
				hard = new HardwareCont();
				hard.sendForArduino(mqttNum);
				operationFlag = false;
				fanStartTime = 0;
				fanStopTime = currentHourMinute;
			}
		} else {
			if (avgCO2 > LIMIT) {
				mqttNum = 1;
				hard = new HardwareCont();
				hard.sendForArduino(mqttNum);
				operationFlag = true;
				fanStartTime = 0;
				fanStopTime = 0;
			} else {
				if (fanStopTime == 0) {
					fanStopTime = currentHourMinute;
				}
				if (stopDiff >= minutesCycle) {
					mqttNum = 1;
					hard = new HardwareCont();
					hard.sendForArduino(mqttNum);
					operationFlag = true;
					fanStartTime = currentHourMinute;
					fanStopTime = 0;
				}
			}
		}

//		if (resNumArr[0] < limit || resNumArr[1] < limit || resNumArr[2] < limit) {
//			++mqttNum;
//			log.info("------------------------------------------mqttNum------------------------------------------ : " + mqttNum);
//			hard = new HardwareCont();
//			log.info("200이상 : " + resNumArr);
//			if (mqttNum == 1) {
//				log.info("한번만 돔? : " + resNumArr); 
//				hard.sendForArduino(mqttNum);
//			}
//		} else if (resNumArr[0] >= limit && resNumArr[1] >= limit && resNumArr[2] >= limit && mqttNum >= 1) {
//			log.info("200이하 : " + resNumArr);
//			hard = new HardwareCont();
//			mqttNum = 0;
//			hard.sendForArduino(mqttNum);
//		}
		// --------------------------------------------------------------------------------------------------------------------------------
		log.info("----------------------------------sensorDataAsycUpdate End--------------------------------");
		return sensorObj;
	}
}
