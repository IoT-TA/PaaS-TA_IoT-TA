<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="poly.util.CmmUtil"%>
<%
    String random = CmmUtil.nvl((String) session.getAttribute("random"));
%>
<!DOCTYPE html>
<html lang="en">

<head>
    <title>regUserInfo</title>
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
                                        <h1 class="h4 text-gray-900 mb-2">GASGASGAS 회원 등록</h1>
                                        <p class="mb-4">"GAS 회사의" 직원 이시면 아래에 정보를 입력해주세요.</p>
                                    </div>
                                    <div>
                                    <form name="f" class="user" action="/user/regUserInfo.do" onsubmit="return doRegUserInfoCheck(this);">
                                        <div class="form-group">
                                            <input type="text" class="form-control form-control-user"
                                                id="empno" name='empno'aria-describedby="emailHelp" 
                                                placeholder="사원번호를 입력하세요.">
                                        </div>
                                  <!-- 직원 중복 등록 여부 확인 -->
	                                    <div id='empno_check'></div>
                                        <div class="form-group">
                                            <input type="password" class="form-control form-control-user"
                                                id="password" name='password'aria-describedby="emailHelp" 
                                                placeholder="비밀번호를 입력하세요.">
                                        </div>
                                        <div class="form-group">
                                            <input type="password" class="form-control form-control-user"
                                                id="password2" name='password2'aria-describedby="emailHelp" 
                                                placeholder="비밀번호를 다시 입력하세요.">
                                        </div>
                                        <div class="form-group">
                                            <input type="email" class="form-control form-control-user"
                                                id="email" name='email'aria-describedby="emailHelp" 
                                                placeholder="이메일을 입력하세요.">
                                        </div>
                                        <div class="form-group">
                                            <input type="text" class="form-control form-control-user"
                                                id="phone" name='phone'aria-describedby="emailHelp" 
                                                placeholder="전화번호을 입력하세요.">
                                        </div>  

                                        <button type="submit"  class="btn btn-primary btn-user btn-block" id="regUserInfoButton">
                                            회원가입
                                        </button>                            
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
<!--  인증메일 확인 -->
    <script type="text/javascript">
	    function doRegUserInfoCheck(f) {
			if (f.empno.value.trim()==""){
				alert("사원번호를 입력하세요.");
				f.empno.focus();
				return false;
			}
			if (f.password.value.trim()==""){
				alert("비밀번호를 입력하세요.");
				f.password.focus();
				return false;
			}
			if (password.value.trim() != password2.value) {
				alert("비밀번호가 서로 다릅니다.");
				f.password.focus();
				return false;
			}
			if (f.email.value.trim()==""){
				alert("이메일을 입력하세요.");
				f.email.focus();
				return false;
			}
			if (phone.value.trim() = "") {
				alert("전화번호를 입력해주세요");
				f.phone.focus();
				return false;
			}
		}
    </script>
    <!-- 이메일 등록여부 확인용 아작스 -->
   <script type="text/javascript">
   $('#empno').blur(function () {
		var empno = $('#empno').val();
		$.ajax({
			url : '/user/loginEmpnoCheck.do?empno=' + empno,
			type : 'get',
			dataType : 'text',
			success : function (data) {
				if(data == 0){
					$('#empno_check').text('이상없습니다.');
					$('#empmo_check').css('color', 'blue');
					$('#regUserInfoButton').attr('disabled', false);
				}else if(data == 1){
					$('#empno_check').text('이미 등록된 직원이 있습니다.');
					$('#empno_check').css('color', 'red');
					$('#regUserInfoButton').attr('disabled', true);
					document.getElementById("empno").focus();
				}
			}
		})
	});
  	</script>

</body>

</html>