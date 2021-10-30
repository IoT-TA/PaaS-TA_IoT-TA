package poly.dto;

/* @author 최별규
 * @Version 1.1
 * 사용자 정보를 담는 객체 DTO
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.26   |  최별규     | 초안 작성
 * |              |             |
 * */
// 캡슐화를 위해 모두 private로 데이터 접근은 get, set 메서드로 한다.
public class UserDTO { // => 클래스 이름이 mapper.xml의 resulttype 임
	// private Logger log = Logger.getLogger(this.getClass()); // DTO에 에러 있나 확인용
	//-------------------------------------변수 선언 부--------------------------------------
	private String empno; // => 아이디	
	private String pwd;   // => 비번
	private String name;  // => 이름
	private String email; // => 이름
	private String phone; // => 이름
	//---------------------------------Get, Set ----------------------------------------------
	public String getEmpno() {
		return empno;
	}
	public void setEmpno(String empno) {
		this.empno = empno;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
}
