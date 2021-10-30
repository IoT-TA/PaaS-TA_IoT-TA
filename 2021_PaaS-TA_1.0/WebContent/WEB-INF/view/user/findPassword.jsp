<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="poly.util.CmmUtil"%>
<!DOCTYPE html>
<html lang="en">

<head>
    <title>findPassword</title>
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
                                        <h1 class="h4 text-gray-900 mb-2">비밀번호 변경</h1>
                                        <p class="mb-4">직원정보가 등록되어 있다면 인증메일을 보내드리겠습니다.</p>
                                    </div>
                                    <div>
                                    
                                    <form name="f" class="user" action="/user/changePassword.do" onsubmit="return doCheckEmail(this);">
                                        <div class="form-group">
                                            <input type="text" class="form-control form-control-user"
                                                id="email" name='email'aria-describedby="emailHelp" 
                                                placeholder="이메일을 입력하세요.">
                                        </div> 
	                                       <!-- 이메일 등록 여부 확인 -->
	                                        <div id='email_check'></div>
                                        <button type="submit"  class="btn btn-primary btn-user btn-block" id="chgPasswordSubmit">
                                            인증메일 발송
                                        </button>
                                        <div class="form-group">
                                        <!-- 이메일 인증 됬으면 인증 문자 확인을 위한 아작스 -->
                                        <div id='authText_check'></div>        
                                        </div>                            
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
    <!-- 이메일 등록여부 확인용 아작스 -->
   <script type="text/javascript">
   // ------------------------------------------이메일 등록이 되어 있는지 확인하는 로직--------------------------------
   $('#email').blur(function () {
		var email = $('#email').val();
		$.ajax({
			url : '/user/emailCheck.do?email=' + email,
			type : 'get',
			dataType : 'text',
			success : function (data) {
				if(data == 0){
					$('#email_check').text('등록된 이메일이 없습니다.');
					$('#email_check').css('color', 'red');
					$('#chgPasswordSubmit').attr('disabled', true);
				}else if(data == 1){
					$('#email_check').text('등록된 이메일입니다.');
					$('#email_check').css('color', 'blue');
					$('#chgPasswordSubmit').attr('disabled', false);
				}
			}
		})
	});
   // --------------------------------- 이메일 데이터 null 인지 확인 ---------------------------------------------------
   function doCheckEmail() {
	   if(email.value == "")
	   {
		   alert("이메일을 입력해주세요.");
		   f.email.focus();
		   return false;
	   }
	}
  	</script>

</body>

</html>