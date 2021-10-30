/*
 Basic MQTT example with Authentication

  - connects to an MQTT server, providing username
    and password
  - publishes "hello world" to the topic "outTopic"
  - subscribes to the topic "inTopic"
*/

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.
byte mac[]    = {  0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 181);
IPAddress server(13,125,190,107);
char msg[50];
String stringSensorData;

void callback(char* topic, byte* payload, unsigned int length) {
  // handle message arrived
}

EthernetClient ethClient;
PubSubClient client(server, 1883, callback, ethClient);
int sensorData = 0;

void setup()
{
  Serial.begin(115200);
  Ethernet.begin(mac, ip);
  // Note - the default maximum packet size is 128 bytes. If the
  // combined length of clientId, username and password exceed this,
  // you will need to increase the value of MQTT_MAX_PACKET_SIZE in
  // PubSubClient.h
  
  if (client.connect("arduinoClient", "admin", "1234")) {
    Serial.println("connect!!");
    client.publish("test","연결 성공시에 처음 보내는 메세지");
  }
}
void loop()
{
  if(!client.connected()) {
    reconnect();
  }
  getSensorData(); 
  client.loop();
}

void getSensorData() {
  //센서 코딩 하면 됩니다.
  stringSensorData = "1/" + String(analogRead(0));
  stringSensorData.toCharArray(msg,50);
  client.publish("test",msg);
  
  Serial.println(msg);
  sensorData++;
  if(sensorData > 49) {
    sensorData=0;
  }
  delay(10000);
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("arduinoClient", "admin", "1234")) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("outTopic", "hello world");
      // ... and resubscribe
      client.subscribe("inTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void getGasData() {
  Serial.print("Sample value:");
  Serial.println(analogRead(0));
  stringSensorData = "3/" + String(analogRead(0));
}
