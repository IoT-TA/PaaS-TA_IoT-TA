#include <Servo.h> //헤더파일 포함

Servo servo1; //servo1 변수 선언
Servo servo2; //servo2 변수 선언

int motor1 = 7; //motor1을 입출력 3번 핀에 연결
int angle1 = 90; //초기 각도값 설정  
int angle2 = 90; //초기 각도값 설정

void setup() {
  servo1.attach(motor1); //servo1에 입출력 3번 핀을 지정
  Serial.begin(9600); //시리얼 모니터 사용
  Serial.println("Enter the w,a,s,d ");
}
void loop() {
  if(Serial.available()) //시리얼 통신이 가능할 경우
  {
    char input = Serial.read(); //시리얼 모니터 입력 값을 읽어옴
    if(input =='w') //입력값이 W일 경우
    {
      Serial.print("+30");
      for(int i = 0; i <25; i++) // 30번 반복
      {
        angle1 = angle1 + 1; // angle1의 값에 1씩 30번을 더함
        if(angle1 >=180) // angle1이 180보다 커지거나 같아질 경우 
        angle1 = 180; // angle1을 180으로 고정
        servo1.write(angle1); // servo1을 angle1 값에 맞추어 동작
        delay(10);
      }
      Serial.print("\t\t");
      Serial.println(angle1);
    }
    else if(input =='a') //입력값이 a일 경우
    {
      Serial.print("+30");
      for(int j = 0; j <30; j++)
      {
        angle2 = angle2 + 1;
        if(angle2 >=180)
         angle2 = 180;
        servo2.write(angle2);
        delay(10);
      }
      Serial.print("\t\t");
      Serial.println(angle2);
    }
     else if(input == 's') //입력값이 s일 경우
     {
      Serial.print("\t-30\t");
      for(int i = 0; i <25; i++) // 30번 반복
      {
        angle1 = angle1 -1; // angle1의 값에 1씩 30번을 빼기
        if(angle1 <= 0) // angle1이 0보다 작아지거나 같을 경우
        angle1 = 0; // angle1을 0으로 고정
        servo1.write(angle1); // servo1을 angle 값에 맞추어 동작
        delay(10);
      }
      Serial.println(angle1);
     }
     else if(input == 'd')  //입력값이 d일 경우
     {
      Serial.print("\t-30\t");
      for(int j = 0; j <30; j++)
      {
        angle2 = angle2 -1;
        if(angle2 <= 0)
        angle2 = 0;
        servo2.write(angle2);
        delay(10);
      }
      Serial.println(angle2);
     }
  }
}
