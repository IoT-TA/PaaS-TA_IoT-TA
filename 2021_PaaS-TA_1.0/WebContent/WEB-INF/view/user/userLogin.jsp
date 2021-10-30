<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<meta property="og:image" content="https://code-study.tistory.com/images/img_share.png">
<head>
<%@ include file="/WEB-INF/view/user/bootTop.jsp"%>
<title>DetectionGas</title>
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
                                        <h1 class="h4 text-gray-900 mb-4"><img src="/resources/image/Logo.png" style="width:40px"> GASGASGAS</h1>
                                    </div>
	                                    <form class="user" action="/user/userLoginProc.do" name="formTag" onsubmit="return doLoginCheck(this);">
	                                        <div class="form-group">
	                                            <input type="text" class="form-control form-control-user"
	                                                id="empno" name ='empno' aria-describedby="emailHelp"
	                                                placeholder="사원번호를 입력하세요.">
	                                        </div>
	                                        <!--@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@직원 등록 여부 확인띄워주는 스팟@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-->
	                                        <div id='empno_check'></div>
	                                        <!--@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-->
	                                        <div class="form-group">
	                                            <input type="password" class="form-control form-control-user"
	                                                id="pwd" name='pwd' placeholder="비밀번호를 입력하세요.">
	                                        </div>
	                                        <div class="form-group">
	                                            <div class="custom-control custom-checkbox small">
	                                                <input type="checkbox" class="custom-control-input" id="customCheck">
	                                      <!--  <label class="custom-control-label" for="customCheck">아이디 기억하기</label> -->
	                                            </div>
	                                        </div>
	                                        <button class="btn btn-primary btn-user btn-block" id="loginSubmit" >로그인</button>
	                                        <!-- 카카오 로그인 kakaoLoginProc-->
	                                  		<button type="button" 
	                                      		class="btn btn-primary1 btn-user btn-block" value="카카오로그인" onclick="location.href='/kakaoLoginProc.do'" style="background-color:#F8DF00;  
	                                      		 padding-top: 3px; padding-bottom: 3px;">
	                                      		<img src="/resources/image/kakao.png" style="width:40px">
	                                  		     카카오로그인     	
	                                       </button> 
	                                    </form>
                                    <hr> 	
                                    <div class="text-center">
                                        <a class="small" href="/user/findPassword.do">비밀번호 찾기</a>
                                    </div>
                                    <div class="text-center">
                                        <a class="small" href="/user/regUserPage.do">회원가입</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<!--################################################################################# 유저 아이디 확인용 아작스 스크립트 영역 #####################################################################-->
   <script type="text/javascript">
   //--------------------유저 가입 여부 확인 AJAX 처리 -----------------------------------------
   $('#empno').blur(function () // => 제이쿼리 선택이 해제 되면 함수가 동작
	{
	  //--------------------id가 empno인 값을 가져와 담는다.------------------------------------ 
      var empno = $('#empno').val(); // => 컨트롤러로 같이 보낼 데이터
      //----------------------------------------------------------------------------------------
      $.ajax({
         url : '/user/loginEmpnoCheck.do?empno=' + empno,
         type : 'get',
         dataType : 'text',
         success : function (data) {
            if(data == 0){
               $('#empno_check').text('사원번호를 확인해주세요');
               $('#empno_check').css('color', 'red');
               $('#loginSubmit').attr('disabled', true);
            }else if(data == 1){
               $('#empno_check').text('등록된 직원입니다.');
               $('#empno_check').css('color', 'blue');
               $('#loginSubmit').attr('disabled', false);
            }
         }
      })
   });
   //--------------------------------------- null 체크 -------------------------------------------
  	function doLoginCheck(formTag)
   {
	   if(empno.value == "")
	   {
		   alert("아이디를 입력해주세요.");
		   formTag.empno.focus();
		   return false;
	   }
	   if(pwd.value == "")
	   {
		   alert("비밀번호를 입력해주세요.");
		   formTag.pwd.focus();
		   return false;
	   }
   }
     </script>   
</body>
</html>