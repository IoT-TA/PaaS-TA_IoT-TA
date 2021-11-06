# PaaS-TA_IoT-TA

### Config Repository : [PaaS-TA_IoT-TA(Private)](https://github.com/senor14/PaaS-TA_IoT-TA_config)

### Wiki : [WIKI](https://github.com/senor14/PaaS-TA_IoT-TA_config/wiki)

#

### 📒 [개발문서](https://www.notion.so/IoT-TA-71624201a9204f608d0e7bea77766171) (API 설계, DB 설계, 화면 설계, Convention 등)

### **🏠 소개**

- 아두이노를 이용하여 이산화탄소 수치를 측정하고 자동으로 환기를 해주는 시스템 및 모니터링 서비스입니다.

### **⏲️ 개발기간**

- 2021-10-18 ~ 2021-11-19(제출 마감일)

### **🧙 멤버구성**

- [최별규](https://github.com/me940728)
- [김선열](https://github.com/senor14)
- [홍석민](https://github.com/ghdtjrals3)
- [양원석](https://github.com/sct213)
- [김하윤](https://github.com/hiyun02)

### **📌 기술 스택**

- Software Tool
  - IDE : Eclipse, STS, VS Code, Arduino Sketch
  - Database Tool : Studio 3T, MySQL Workbench 8.0 CE
  - API : Postman
  - Server : PuTTY, WinSCP
  - 형상관리 : Github, Git bash
  - 소통 : Slack, GatherTown
  - 브라우저 : Chrome
  - 기타 : Atom, Hancom Office(2016이상)
- Hardware
  - Arduino Uno Board
  - MQ2, MQ4 Gas sensor(실험에는 CO2 센서사용)
  - 환풍기(EKS-200SAP)
  - Electric Motor(SG90)
  - Buzzer(Digital Buzzer V2)
  - breadboard
- Software
  - Spring framework / v4.3
  - Maven / v4.0
  - Mosquito / v1.6.9
  - java / jdk_1.8.0_291
  - mongoDB / 4.4.7
  - MariaDB / AWS RDS
  - node.js / v14.17.6 (반드시 14이상)
  - Tomcat / v8.5
  - AWS EC2 Ubuntu / 20.LTS
- Libraries
  - MQTT lib / org.eclipse.paho v1.2.2
  - mongo-java-driver / 3.2.2
  - spring-data-mongodb / 1.9.1.RELEASE
  - Kakao REST API / OAUTH2, SendTalk(개인)

### **📌 주요 기능**

### **User**

- OAuth 2.0 기반 카카오 로그인
- SMTP 메일인증

### Arduino

- 이산화탄소 ppm 측정
- 측정 데이터 수집
- 이산화탄소 임계값 이상 측정 시 환풍기 작동
- 사용자의 환풍기 작동 배치 설정
- WIFI 통신

### Monitoring

- 센서의 CO2 측정 그래프
