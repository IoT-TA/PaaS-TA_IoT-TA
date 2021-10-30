package poly.util;

import java.util.Random;

/* @Auth 최별규
 * @Version 1.1
 * 랜덤문자를 생성하는 클래스
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.00.00   |  최별규     | 초안 작성
 * */

public class RamdomMail {
	// 랜덤 값을 생성하기 코드 // 
	public static String SendRamdomMail() {
		// 랜덤 생성 메서드
		Random rand = new Random();
		// 랜덤 값 담을 변수 
		StringBuffer strBu = new StringBuffer();
		String result = "";
		// 반복문으로 6자리 생성 대뮨자, 소문자, 숫자 케이스 3개
		for (int i = 0; i < 6; i++) {
			int index = rand.nextInt(3);
			switch (index) {
			case 0:
				strBu.append((char)(rand.nextInt(26)+97));
				break;
			case 1:
				strBu.append((char)(rand.nextInt(26)+65));
				break;
			case 2:
				strBu.append(rand.nextInt(10));
				break;
			}
		}
		// 스트링버퍼를 스트링으로 변환
		result = strBu.toString();
		// 값 담아 리턴  -> 차후 메일 발송 및 패스워드 변결 시 사용 예정
		return result;
	}
}
