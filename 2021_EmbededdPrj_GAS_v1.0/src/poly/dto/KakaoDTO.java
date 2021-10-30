package poly.dto;

/* @Auth 최별규
 * @Version 1.1
 * 카카오 로그인을 시도할 때 데이터데이스에서 사용자 정보를 가져오기 위한 임시 DTO
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.26   |  최별규     | 초안 작성
 * |              |             |
 * */
// 캡슐화를 위해 모두 private로 데이터 접근은 get, set 메서드로 한다.
public class KakaoDTO {
	//-------------------------------------변수 선언 부--------------------------------------
	private String kakaoMeail; // => 사용자 이메일
	private String id;         // => 사용자 아이디
	private String name;       // => 사용자 이름
	//---------------------------------Get, Set ----------------------------------------------
	public String getKakaoMeail() {
		return kakaoMeail;
	}
	public void setKakaoMeail(String kakaoMeail) {
		this.kakaoMeail = kakaoMeail;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

}
