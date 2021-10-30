package poly.service.impl;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import poly.service.IMqttService;

/* @Auth 최별규
 * @Version 1.1
 * MQTT 처리 확인 비즈니스로직 서비스클래스 => 테스트용
 * ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.23   |  최별규     |  초안 작성
 * |              |             |
 * */

@Service("MqttService") 
public class MqttdService implements IMqttService{
	private Logger log = Logger.getLogger(this.getClass().getName()); 
	
	@RequestMapping(value="/mqtt/getMessage")
	public String mqttSub() {
		log.info(this.getClass().getName() + "mqttSub Start!!"); 
		log.info(this.getClass().getName() + "mqttSub END!!");
		return "";
	}
	
	
}
