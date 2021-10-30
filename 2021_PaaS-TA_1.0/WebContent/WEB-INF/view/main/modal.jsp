<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<script src="https://code.jquery.com/jquery-latest.js"></script>
<!--############################## 몽고에서 데이터를 가져오고 모달을 띄우는 스크립트 연결 부분########################################################-->
<script src="/resources/js/customJs/sensorData.js"></script>
<meta charset="UTF-8">
<style>
        /* 모달 백그라운드 스타일 */
        .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgb(124 20 20 / 93%); /* Black w/ opacity */
        }
        /* 모달 컨텐츠 */
        .modal-content {
            background-color: rgb(124 20 20 / 93%);
            margin: 15% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 30%; /* Could be more or less, depending on screen size */                          
        }
</style>
</head>
<body>
    <div id="myModal" class="modal">
        <!-- 모달 컨텐츠 영역 -->
        <div class="modal-content">
                  <p style="text-align: center;"><span style="font-size: 50pt;"><b><span style="font-size: 30pt; color:red;">위험</span></b></span></p>
                  <p style="text-align: center; line-height: 0.5; font-size: 30pt;"><br />가스농도가 높습니다.</p>
                  <p style="text-align: center; line-height: 1.5; font-size: 28pt;"><br />환풍기가 작동됩니다.</p>
                  <p><br /></p>
              <div style="cursor:pointer;background-color:#DDDDDD;text-align: center;padding-bottom: 10px;padding-top: 10px;" onClick="close_pop();">
                  <span class="pop_bt" style="font-size: 13pt;" >
                       닫기
                  </span>
              </div>
        </div>
     </div>
</body>
</html>