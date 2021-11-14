package poly.dto;

/* @Auth 최별규
 * @Version 1.1
 * limit데이터를 저장하는 DTO
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.11.10   |  최별규     | 초안 작성
 * |              |             |
 * */
// 캡슐화를 위해 모두 private로 데이터 접근은 get, set 메서드로 한다.
public class LimitDTO {
	//-------------------------------------변수 선언 부--------------------------------------
	private String id;	     // => id
	private String limitValue;    // => 임계값
	//---------------------------------Get, Set ----------------------------------------------
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getLimit() {
		return limitValue;
	}
	public void setLimit(String limitValue) {
		this.limitValue = limitValue;
	}
	

}
