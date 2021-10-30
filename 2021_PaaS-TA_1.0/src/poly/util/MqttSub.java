package poly.util;

import java.util.HashMap;
import java.util.function.Consumer;

/* @Auth 최별규
 * @Version 1.1
 * MQTT 발행을 위한 코드부분 
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.00.00   |  최별규     | 초안 작성
 * |              |  홍석민     | 초안 작성
 * |              |  양원석     | 초안 작성 
 * */

public class MqttSub {

	public static void main(String[] args) {
		//----------------------------------------------MQTT 셋팅부------------------------------------
		String mqttServer = "{  }"; //브로커 주소
		String client_id = "admin"; // 이름
		String userName = "{  }"; // 아이디
		String pasword = "{  }"; // 비번
		String topic = "test"; // 토픽
		//----------------------------------------------------------------------------------------------
		 final Consumer<HashMap<Object, Object>> pdk = (arg)->{  //해쉬맵을 받는 함수를 정의하자.
		     arg.forEach((key, value)->{
				System.out.println( String.format("대상, 키 -> %s, 값 -> %s", key, value.toString()) );
		     });			
		  };
		 MyMqttClient client = new MyMqttClient(pdk);
		
		 // 접속아이디, 비번, 발행 주소(ip:1883), 토픽은 콤마로 여러개 가능
		 client.init(userName, pasword, mqttServer, client_id).subscribe(new String[] {topic});
		 
		 /*
		  client.initConnectionLost( (arg)->{  //콜백행위1, 서버와의 연결이 끊기면 동작
	            arg.forEach((key, value)->{
	                System.out.println( String.format("커넥션 끊김~! 키 -> %s, 값 -> %s", key, value) );
	            });
	        });

	        client.initDeliveryComplete((arg)-> {  //콜백행위2, 메시지를 전송한 이후 동작
	            arg.forEach((key, value)->{
	                System.out.println( String.format("메시지 전달 완료~! 키 -> %s, 값 -> %s", key, value) );
	            });
	        });


	        new Thread( ()->{
	            try {
	                Thread.sleep(9000);
	                client.sender("new_topic", "Hello world! 한글한글!");  //이런식으로 보낸다.
	                client.close();  //종료는 이렇게!
	            } catch (Exception e) {
	                e.printStackTrace();
	            }
	        } ).start();        
		*/

	}

}
