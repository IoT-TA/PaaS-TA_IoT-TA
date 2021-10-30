package poly.controller;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import poly.util.MqttPub;

/* @Auth 최별규
 * @Version 1.1
 * MQTT TEST를 위한 컨트롤러 테스트 
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.11   |  최별규     | 초안 작성
 * |              |             |
 * */

@Controller
public class MqttController {
	private Logger log = Logger.getLogger(this.getClass().getName()); //로그 찍는 메서드
	//--------------------------------------------------------------리소스선언부--------------------------------------------------------
	//----------------------------------------------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------------------------------------------


	// 테스트용 url
	@RequestMapping("/test/test")
	public String test() throws Exception {
		log.info(this.getClass().getName()+".test Start!");

		// MqttPub.mqttPub("username", "password", "topic", "content");
		MqttPub.mqttPub("admin", "1234", "hardwareCon", "popopo");
		log.info(this.getClass().getName()+".test End!");
		return null;
	}
}
