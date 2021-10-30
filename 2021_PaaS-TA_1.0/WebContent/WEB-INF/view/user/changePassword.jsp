<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="poly.util.CmmUtil"%>
<%
    String random = CmmUtil.nvl((String) session.getAttribute("random"));
%>
<!DOCTYPE html>
<html lang="en">

<head>
    <title>changePassword</title>
	<%@ include file="/WEB-INF/view/user/bootTop.jsp"%>
</head>

<body class="bg-gradient-primary">

    <div class="container">

        <!-- Outer Row -->
        <div class="row justify-content-center">

            <div class="col-xl-10 col-lg-12 col-md-9">

                <div class="card o-hidden border-0 shadow-lg my-5">
                    <div class="card-body p-0">
                        <!-- Nested Row within Card Body -->
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="p-5">
                                    <div class="text-center">
                                        <h1 class="h4 text-gray-900 mb-2">인증번호 입력 / 비밀번호 변경</h1>
                                        <p class="mb-4">인증번호를 입력해주세요.</p>
                                    </div>
              				<!-- 이메일 등록 여부 확인 -->
	                     <div id='auth_check'></div>
                                    <div>
 		                           <div class="form-group">
                                      <input type="text" class="form-control form-control-user"
                                                id="authText" name='authText'aria-describedby="emailHelp" 
                                                placeholder="인증번호를 입력해주세요.">
                                    </div> 
                     <!-- 인증번호 맞으면 활성화 되는 구역 -->               

                                    <form name="f" class="user" action="/user/changePasswordProc.do" onsubmit="return doChangePwdCheck(this)">
                                        <div class="form-group">
                                            <input type="password" class="form-control form-control-user"
                                                id="password" name='password'aria-describedby="emailHelp" 
                                                placeholder="비밀번호를 입력하세요.">
                                        </div> 
                                        <div class="form-group">
                                            <input type="password" class="form-control form-control-user"
                                                id="password2" name='password2'aria-describedby="emailHelp" 
                                                placeholder="비밀번호를 다시 입력해주세요.">
                                        </div> 
	                                       <!-- 비번 비교 확인 -->
	                                        <div id='password_check'></div>
                                        <button type="submit" class="btn btn-primary btn-user btn-block" id="chgPasswordSubmit">
                                            비밀번호 변경
                                        </button>
                     <!-- 인증번호 맞으면 활성화 되는 구역 -->                   
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
    <script type="text/javascript">
    // 이메일 인증 서비스 만들기
	// 회원가입 유효성 체크 
	function doChangePwdCheck(f) {

		if (password.value != password2.value) {
			alert("비밀번호가 서로 다릅니다.");
			f.password.focus();
			return false;
		}

	}
    </script>
    <!-- 인증번호를 확인해서 비밀번호 변경 활성화 시키기 위한 JS -->
   <script type="text/javascript">
   $('#authText').blur(function () {
		let auth = $('#authText').val();
		let random = "<%=random%>";
		if(auth != random){
			console.log(random);
			console.log(auth);
			alert("인증번호가 다릅니다.다시 확인해주세요");
			$('#auth_check').text('인증번호가 다릅니다.');
			$('#auth_check').css('color', 'red');
			$('#chgPasswordSubmit').attr('disabled', false);
		}else{
			alert("인증번호가 이상없습니다.");
			$('#auth_check').text('인증번호 확인 완료');
			$('#auth_check').css('color', 'blue');
			$('#chgPasswordSubmit').attr('disabled', ture);
		}
	});
  	</script>

</html>