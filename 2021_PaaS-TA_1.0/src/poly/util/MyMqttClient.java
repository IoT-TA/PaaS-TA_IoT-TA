package poly.util;

import java.util.HashMap;
import java.util.function.Consumer;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;

/*
 * Mqtt 사용을 위한 인터페이스 상속
 * */
public class MyMqttClient implements MqttCallback{
	
	private MqttClient client;
	private MqttConnectOptions option;	
    private Consumer<HashMap<Object, Object>> FNC = null;  //메시지 도착 후 응답하는 함수
    private Consumer<HashMap<Object, Object>> FNC2 = null;  // 커넥션이 끊긴 후 응답하는 함수
    private Consumer<HashMap<Object, Object>> FNC3 = null;  //전송 완료 후 응답하는 함수

    public MyMqttClient(){}; // 기본 생성자 생성
    
    public MyMqttClient (Consumer<HashMap<Object, Object>> fnc){  //생성자
        this.FNC = fnc;
    }
	
	//전송
	public boolean sender(String topic, String msg) throws MqttPersistenceException, MqttException{
		MqttMessage message = new MqttMessage();
		message.setPayload(msg.getBytes());  //보낼 메시지
		client.publish(topic, message);  //토픽과 함께 보낸다.
		return false;
	}
	
	//구독 대상 전달
	public boolean subscribe(String... topics){
		try {
			if(topics != null){
				for(String topic : topics){
					client.subscribe(topic,0);  //구독할 주제, 숫자는 품질 값
				}
			}			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	/* 옵션 객체에 접속 하기 위한 세팅 
	 * 파라미터로 4개 필요(사용자이름, 비밀번호, 주소, 접속 후 사용할 아이디)
	*/
	public MyMqttClient init(String userName, String password, String serverURI, String clientId){
		option = new MqttConnectOptions();
		option.setCleanSession(true);
		option.setKeepAliveInterval(30);
		option.setUserName(userName);
		option.setPassword(password.toCharArray());  //옵션 객체에 접속하기위한 세팅끝!
		try {
			client = new MqttClient(serverURI, clientId);
			client.setCallback(this);
			client.connect(option);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return this;
	}
    /**
     * 커넥션이 끊어진 이후의 콜백행위를 등록합니다.<br>
     * 해쉬맵 형태의 결과에 키는 result, 값은 Throwable 객체를 반환 합니다. 
     * **/
    public void initConnectionLost (Consumer<HashMap<Object, Object>> fnc){
        FNC2 = fnc;
    }
	

    /**
     * 커넥션이 끊어진 이후의 콜백행위를 등록합니다.<br>
     * 해쉬맵 형태의 결과에 키는 result, 값은 IMqttDeliveryToken 객체를 반환 합니다. 
     * **/
    public void initDeliveryComplete (Consumer<HashMap<Object, Object>> fnc){
        FNC3 = fnc;
    }
	
	// 클라이언트 종료 기능
    public void close(){
        if(client != null){
            try {
                client.disconnect();
                client.close();
            } catch (MqttException e) {
                e.printStackTrace();
            }
        }
    }
	
	@Override
	public void connectionLost(Throwable arg0) {
        if(FNC2 != null){
            HashMap<Object, Object> result = new HashMap<>();
            result.put("result", arg0);
            FNC2.accept(result);
            arg0.printStackTrace();
        }
	}
	
	// 메시지를 받아서 동작하는 메서드 첫 번쨰 인자는 토픽, 두 버째 인자는 메시지
	@Override
	public void messageArrived(String arg0, MqttMessage arg1) throws Exception {
        if(FNC != null){
            HashMap<Object, Object> result = new HashMap<>();
            result.put("topic", arg0);
            result.put("message", new String(arg1.getPayload(),"UTF-8"));
            FNC.accept(result);  //콜백행위 실행
        }
		
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken token) {
        if(FNC3 != null){
            HashMap<Object, Object> result = new HashMap<>();
            try {
                result.put("result", token);
            } catch (Exception e) {
                e.printStackTrace();
                result.put("result", "ERROR");
                result.put("error", e.getMessage());
            }
            FNC3.accept(result);
        }
		
	}

}
