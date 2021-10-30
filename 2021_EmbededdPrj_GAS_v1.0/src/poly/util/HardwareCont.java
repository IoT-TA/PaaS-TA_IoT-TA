package poly.util;

import org.apache.log4j.Logger;

/* @Auth 최별규
 * @Version 1.1
 * 하드웨어컨트롤을 위한 객체 싱글톤으로 형성되어야 한다.
 * ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.09.21   |  최별규     |  초안 작성
 * |              |             |
 * */

public class HardwareCont {
	private Logger log = Logger.getLogger(this.getClass());
	@SuppressWarnings("static-access")
	public void sendForArduino(int sensorData) {
		MqttPub pub = new MqttPub(); // => mqtt pub 객체
		String userName = "admin";
		String password = "1234";
		String topic = "hardwareCon";
		String sensorDataToString = String.valueOf(sensorData);
		pub.mqttPub(userName, password, topic, sensorDataToString);
		log.info("topic : " + topic + "message : " + sensorDataToString);
	}
}
