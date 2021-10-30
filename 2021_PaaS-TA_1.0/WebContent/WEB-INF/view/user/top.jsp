<%@page import="poly.util.CmmUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<% 
	String user_name = CmmUtil.nvl((String)session.getAttribute("name"));
%>
	<div style="background-color: green; height: 50px">

		<%if(user_name.isEmpty()) {%>
		<a href="/user/userLogin.do" style="color: #2b2b2b;"> 로그인 </a>
		<%} else{ %>
		<%=user_name %>님 환영합니다.
		<a href="/user/logOut.do" style="color: #2b2b2b;"> 로그아웃</a>
		<%} %>
		
	</div>
</body>
</html>