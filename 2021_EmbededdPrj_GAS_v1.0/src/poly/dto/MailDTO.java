package poly.dto;

/* @Auth 최별규
 * @Version 1.1
 * 메일 발송을 위한 데이터를 담기 위한 DTO
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.26   |  최별규     | 초안 작성
 * |              |             |
 * */
// 캡슐화를 위해 모두 private로 데이터 접근은 get, set 메서드로 한다.
public class MailDTO {
		//-------------------------------------변수 선언 부--------------------------------------
		private String toMail;   // => 받는 사람 이메일
		private String title;    // => 제목
		private String contents; // => 내용
		//---------------------------------Get, Set ----------------------------------------------
		public String getToMail() {
			return toMail;
		}
		public void setToMail(String toMail) {
			this.toMail = toMail;
		}
		public String getTitle() {
			return title;
		}
		public void setTitle(String title) {
			this.title = title;
		}
		public String getContents() {
			return contents;
		}
		public void setContents(String contents) {
			this.contents = contents;
		}
		
}
