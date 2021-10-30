<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String Date = (String) request.getAttribute("Date");
    String Number = (String) request.getAttribute("SENSOR_NUM");
    String Data = (String) request.getAttribute("SENSOR_DATA");
%>
<html>
<head>
    <title>Title</title>
</head>
<body>
Date : <%=Date%><br>
Sensor_num : <%=Number%><br>
Sensor_Data : <%=Data%>
</body>
</html>
