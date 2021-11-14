<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!DOCTYPE html>
<html>
<head>

    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="Landing PAGE Html5 Template">

    <meta name="keywords" content="landing,startup,flat">

    <meta name="author" content="Made By GN DESIGNS">


    <title>2021YPaasTA_IoTTA</title>


    <!-- // PLUGINS (css files) // -->

    <link href="/resources/assets/js/plugins/bootsnav_files/skins/color.css" rel="stylesheet">

    <link href="/resources/assets/js/plugins/bootsnav_files/css/animate.css" rel="stylesheet">

    <link href="/resources/assets/js/plugins/bootsnav_files/css/bootsnav.css" rel="stylesheet">

    <link href="/resources/assets/js/plugins/bootsnav_files/css/overwrite.css" rel="stylesheet">

    <link href="/resources/assets/js/plugins/owl-carousel/owl.carousel.css" rel="stylesheet">

    <link href="/resources/assets/js/plugins/owl-carousel/owl.theme.css" rel="stylesheet">

    <link href="/resources/assets/js/plugins/owl-carousel/owl.transitions.css" rel="stylesheet">

    <link href="/resources/assets/js/plugins/Magnific-Popup-master/Magnific-Popup-master/dist/magnific-popup.css" rel="stylesheet">

    <!--// ICONS //-->

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.css" rel="stylesheet">

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!--// BOOTSTRAP & Main //-->

    <link href="/resources/assets/bootstrap-3.3.7/bootstrap-3.3.7-dist/css/bootstrap.min.css" rel="stylesheet">

    <link href="/resources/assets/css/main.css" rel="stylesheet">

</head>
<body>

    <!--======================================== 

           Preloader

    ========================================-->

    <div class="page-preloader">

        <div class="spinner">

            <div class="rect1"></div>

            <div class="rect2"></div>

            <div class="rect3"></div>

            <div class="rect4"></div>

            <div class="rect5"></div>

        </div>

    </div>

    <!--======================================== 

           Header

    ========================================-->

    <!--//** Navigation**//-->

    <nav class="navbar navbar-default navbar-fixed white no-background bootsnav navbar-scrollspy" data-minus-value-desktop="70" data-minus-value-mobile="55" data-speed="1000">

        <div class="container">

            <!-- Start Header Navigation -->

            <div class="navbar-header">

                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu">

                    <i class="fa fa-bars"></i>

                </button>

  <!--               <a class="navbar-brand" href="#brand">

                    <img src="/resources/assets/img/logo.png" class="logo" alt="logo">

                </a> -->

            </div>

            <!-- End Header Navigation -->

            <!-- Collect the nav links, forms, and other content for toggling -->

            <div class="collapse navbar-collapse" id="navbar-menu">

                <ul class="nav navbar-nav navbar-right">

                    <li class="button-holder">

                        <button type="button" class="btn btn-blue navbar-btn" data-toggle="modal" data-target="#SignIn">�α���</button>
                        <button type="button" class="btn btn-blue navbar-btn" onclick="location.href='/kakaoLoginProc.do'" 
                        		style="background-color:#F8DF00; padding-top: 3px; padding-bottom: 3px;">
                                <img src="/resources/image/kakao.png" style="width:40px"> KaKao�α���
                        </button>

                    </li>

                </ul>

            </div>
            <!-- /.navbar-collapse -->
        </div>

    </nav>

    <!--//** Banner**//-->

    <section id="home">

        <div class="container">

            <div class="row">

                <!-- Introduction -->

                <div class="col-md-6 caption">

                    <h1>Paas-TA�����</h1>
                    <h1>�Ƶ��̳븦 Ȱ����</h1> 
                    <h1>�ڷγ� ���� ���� �ý���</h1>

                    <h2>

                           IoT-TA  

                            <span class="animated-text"></span>

                            <span class="typed-cursor"></span>

                        </h2>

                    <!-- <a href="#" class="btn btn-transparent">Get Started</a> -->
                    <!-- <a class="btn btn-blue popup-youtube" href="https://www.youtube.com/watch?v=Q8TXgCzxEnw"> -->

                </div>

                <!-- Sign Up -->

                <div class="col-md-5 col-md-offset-1">

                    <form class="signup-form" name="f" action="/user/regUserInfo.do" onsubmit="return doRegUserInfoCheck(this);">

                        <h2 class="text-center">ȸ������</h2>

                        <hr>

                        <div class="form-group">

                            <input type="email" class="form-control" placeholder="�̸���" required="required" id="email" name ="email">

                        </div>
                        
	                    <!-- ���� �ߺ� ��� ���� Ȯ�� -->
	                    <div id='email_check'></div>
	                    
	                    
                        <div class="form-group">

                            <input type="password" class="form-control" placeholder="��й�ȣ" required="required" id="password" name ="password">

                        </div>

                        <div class="form-group">

                            <input type="password" class="form-control" placeholder="��й�ȣ Ȯ��" required="required" id="password2" name ="password2">

                        </div>

                        <div class="form-group">

                            <input type="text" class="form-control" placeholder="�޴���ȭ��ȣ" required="required" id="phone" name ="phone">

                        </div>

                        <div class="form-group text-center">

                            <button type="submit" class="btn btn-blue btn-block" id="regUserInfoButton">���� �Ϸ�</button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    </section>

    <!--======================================== 

           Footer

    ========================================-->

    <footer>
        <div class="container">
            <div class="row">
                <div class="footer-caption">
                    <hr>
                    <h5 class="pull-left">OpenPaas, &copy;2021PaasTA IoT TA</h5>
                </div>
            </div>
        </div>
    </footer>

    <!--======================================== 

           Modal

    ========================================-->

    <!-- Modal -->

    <div class="modal fade" id="SignIn" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">

        <div class="modal-dialog" role="document">

            <div class="modal-content">

                <div class="modal-header">

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>

                    <h4 class="modal-title text-center" id="myModalLabel">�α��� ���� �Է�</h4>

                </div>

                <div class="modal-body">

                    <form class="signup-form" action="/user/userLoginProc.do">

                        <div class="form-group">

                            <input type="text" class="form-control" placeholder="����ھ��̵�" required="required" id="loginEmail" name="loginEmail">

                        </div>
                        
                        
<div id="loginEmail_check"></div>


                        <div class="form-group">

                            <input type="text" class="form-control" placeholder="��й�ȣ" required="required" id="loginPassword" name="loginPassword">

                        </div>

                        <div class="form-group text-center">

                            <button type="submit" class="btn btn-blue btn-block" id="loginSubmit">�α���</button>

                        </div>

                    </form>

                </div>

                <div class="modal-footer text-center">

                    <a href="/user/findPassword.do">��й�ȣ ã�� /</a>

                    <a href="#">ȸ������</a>

                </div>

            </div>

        </div>

    </div>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="/resources/assets/bootstrap-3.3.7/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>

    <script src="/resources/assets/js/plugins/owl-carousel/owl.carousel.min.js"></script>

    <script src="/resources/assets/js/plugins/bootsnav_files/js/bootsnav.js"></script>

    <script src="/resources/assets/js/plugins/typed.js-master/typed.js-master/dist/typed.min.js"></script>

    <script src="/resources/assets/js/plugins/Magnific-Popup-master/Magnific-Popup-master/dist/jquery.magnific-popup.js"></script>

    <script src="/resources/assets/js/main.js"></script>
    
<!-- ====================================== �������� Ȯ�� ====================================== -->
    <script type="text/javascript">
	    function doRegUserInfoCheck(f) {
			if (f.email.value.trim()==""){
				alert("�̸����� �Է��ϼ���.");
				f.email.focus();
				return false;
			}
			if (f.password.value.trim()==""){
				alert("��й�ȣ�� �Է��ϼ���.");
				f.password.focus();
				return false;
			}
			if (password.value.trim() != password2.value) {
				alert("��й�ȣ�� ���� �ٸ��ϴ�.");
				f.password.focus();
				return false;
			}
			if (phone.value.trim() = "") {
				alert("��ȭ��ȣ�� �Է����ּ���");
				f.phone.focus();
				return false;
			}
		}
    </script>
<!-- ====================================== �̸��� ��Ͽ��� Ȯ�ο� ���۽� =========================================== -->
   <script type="text/javascript">
   $('#email').blur(function () {
		var empno = $('#email').val();
		$.ajax({
			url : '/user/loginEmpnoCheck.do?empno=' + empno, // => ���� �̸��Ϸ� �����ϱ�
			type : 'get',
			dataType : 'text',
			success : function (data) {
				if(data == 0){
					$('#email_check').text('�̻�����ϴ�.');
					$('#email_check').css('color', 'blue');
					$('#regUserInfoButton').attr('disabled', false);
				}else if(data == 1){
					$('#email_check').text('�̹� ��ϵ� ����ڰ� �ֽ��ϴ�.');
					$('#email_check').css('color', 'red');
					$('#regUserInfoButton').attr('disabled', true);
					document.getElementById("empno").focus();
				}
			}
		})
	});
  	</script>
<!--  �α��� �� ���� ���̵� Ȯ�ο� ���۽� ��ũ��Ʈ ����-->
   <script type="text/javascript">
   //--------------------���� ���� ���� Ȯ�� AJAX ó�� -----------------------------------------
   $('#loginEmail').blur(function () // => �������� ������ ���� �Ǹ� �Լ��� ����
	{
	  //--------------------id�� empno�� ���� ������ ��´�.------------------------------------ 
      var empno = $('#loginEmail').val(); // => ��Ʈ�ѷ��� ���� ���� ������
      //----------------------------------------------------------------------------------------
      $.ajax({
         url : '/user/loginEmpnoCheck.do?empno=' + empno, //=> �̸��Ϸ� �����ϱ�
         type : 'get',
         dataType : 'text',
         success : function (data) {
            if(data == 0){
               $('#loginEmail_check').text('�̸����� Ȯ�����ּ���');
               $('#loginEmail_check').css('color', 'red');
               $('#loginSubmit').attr('disabled', true);
            }else if(data == 1){
               $('#loginEmail_check').text('��ϵ� �����Դϴ�.');
               $('#loginEmail_check').css('color', 'blue');
               $('#loginSubmit').attr('disabled', false);
            }
         }
      })
   });
     </script>
</body>
</html>