<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>MailPaeg</title>
</head>
<body>
	<div>
		<!-- Top Start-->
		<%@ include file="/WEB-INF/view/user/top.jsp"%>
		<!-- Top END-->
	</div>
<h1>SendMail</h1>
<div class="area">
	<div class="divTable">
		<!-- 테이블 머리 -->
		<div class="divTableHead">메일 발송하기</div>
		<!--테이블 바디-->
		<div class="divTableBody">
			<!-- 테이블 로우 -->
			<div class="divTableRow" id="rowBgColor">
				<div class="divTableCell" class="no">
					<form action="/mail/sendMailProc.do" class="sendMailAction" name="f" onsubmit="return check(this);">
						<div class="inputTitle">제목 : <input type="text" id="title" name="title" value=""></div>
						<div class="inputMail">받는사람 이메일 : <input type="email" id="email" name="email" value=""></div>
						<div style="color:black;" id="title" class="title"></div>
						<div class="contentsStyle"><textarea id="contents" name="contents" rows="20" cols="50"></textarea></div>
						<input type="submit" value="메일발송">    
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
</body>

<script type="text/javascript">
// 유효성 체크는 반드시 해줄 것
	function check(f) {
		console.log("함수 실행");
	
		if (title.value == "") {
			alert("제목을 입력해주세요");
			f.title.focus();
			return false;
		}
		if (email.value == "") {
			alert("이메일을 입력해주세요");
			f.email.focus();
			return false;
		}
		if (contents.value == "") {
			alert("내용을 입력해주세요");
			f.contents.focus();
			return false;
		}
	}

</script>
</html>