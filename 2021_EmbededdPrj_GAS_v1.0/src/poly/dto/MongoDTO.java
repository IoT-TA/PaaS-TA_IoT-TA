package poly.dto;

/* @author 최별규
 * @Version 1.1
 * 몽고디비에서 데이터를 가져오거나 보내기위한 저장 객체 DTO
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.26   |  최별규     | 초안 작성
 * |              |             |
 * */
// 캡슐화를 위해 모두 private로 데이터 접근은 get, set 메서드로 한다.
public class MongoDTO {
	//-------------------------------------변수 선언 부--------------------------------------
    private String date;            // => 입력된 날짜
    private String SENSOR_NUMBER;   // => 센서 번호
    private String SENSOR_DATA;     // => 센서에 입력된 값
	//---------------------------------Get, Set ----------------------------------------------
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }
    public String getSENSOR_NUMBER() {
        return SENSOR_NUMBER;
    }
    public void setSENSOR_NUMBER(String SENSOR_NUMBER) {
        this.SENSOR_NUMBER = SENSOR_NUMBER;
    }
    public String getSENSOR_DATA() {
        return SENSOR_DATA;
    }
    public void setSENSOR_DATA(String SENSOR_DATA) {
        this.SENSOR_DATA = SENSOR_DATA;
    }
}
