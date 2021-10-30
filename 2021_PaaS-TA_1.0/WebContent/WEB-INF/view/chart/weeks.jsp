<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="poly.util.CmmUtil" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <%
    	String userName = CmmUtil.nvl((String)session.getAttribute("name"));
    %>    
<html>
<head>

    <title>Present</title>

    <!-- Custom fonts for this template-->
    <link href="/resources/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">

    <!-- Custom styles for this template-->
    <link href="/resources/css/sb-admin-2.min.css" rel="stylesheet">

</head>
<body id="page-top">

    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            <!-- Sidebar - Brand -->
            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/main/index.do">
                <div class="sidebar-brand-icon rotate-n-15">
                    <i class="fas fa-laugh-wink"></i>
                </div>
                <div class="sidebar-brand-text mx-3">GASGASGAS</div>
            </a>

            <!-- Divider -->
            <hr class="sidebar-divider my-0">

            <!-- Nav Item - Dashboard -->
            <li class="nav-item active">
                <a class="nav-link" href="/main/index.do">
                    <i class="fas fa-fw fa-tachometer-alt"></i>
                    <span>Dashboard</span></a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">

            <!-- Heading -->
            <div class="sidebar-heading">
                상세보기
            </div>

            <!-- Nav Item - Pages Collapse Menu -->
            <li class="nav-item">
                <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
                    aria-expanded="true" aria-controls="collapseTwo">
                    <i class="fas fa-fw fa-chart-area"></i>
                    <span>그래프</span>
                </a>
                <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">Graph view</h6>
                        <a class="collapse-item" href="/chart/present.do">실시간보기</a>
                        <a class="collapse-item" href="/chart/month.do">월간보기</a>
                        <a class="collapse-item" href="/chart/weeks.do">주간보기</a>
                    </div>
                </div>
            </li>

            <!-- Nav Item - Utilities Collapse Menu -->
            <li class="nav-item">
                <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities"
                    aria-expanded="true" aria-controls="collapseUtilities">
                    <i class="fas fa-fw fa-table"></i>
                    <span>테이블</span>
                </a>
                <div id="collapseUtilities" class="collapse" aria-labelledby="headingUtilities"
                    data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">table view</h6>
                        <a class="collapse-item" href="/table/present.do">실시간보기</a>
                        <a class="collapse-item" href="/table/month.do">월간보기</a>
                        <a class="collapse-item" href="/table/weeks.do">주간보기</a>
                    </div>
                </div>
            </li>

            <!-- Heading -->
            <div class="sidebar-heading">
                개인
            </div>

            <!-- Nav Item - Pages Collapse Menu -->
            <li class="nav-item">
                <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages"
                    aria-expanded="true" aria-controls="collapsePages">
                    <i class="fas fa-fw fa-folder"></i>
                    <span>마이페이지</span>
                </a>
                <div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">Login Screens:</h6>
                        <a class="collapse-item" href="login.html">로그인</a>
                        <a class="collapse-item" href="login.html">로그아웃</a>
                        <a class="collapse-item" href="sensor.html">센서등록</a>
                        <a class="collapse-item" href="sensorinsert.html">센서추가</a>
                </div>
            </li>

        </ul>

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                    <!-- Sidebar Toggle (Topbar) -->
                    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                        <i class="fa fa-bars"></i>
                    </button>

                    <!-- Topbar Navbar -->
                    <ul class="navbar-nav ml-auto">

                        <!-- Nav Item - Search Dropdown (Visible Only XS) -->
                        <li class="nav-item dropdown no-arrow d-sm-none">
                            <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-search fa-fw"></i>
                            </a>
                            <!-- Dropdown - Messages -->
                            <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                aria-labelledby="searchDropdown">
                                <form class="form-inline mr-auto w-100 navbar-search">
                                    <div class="input-group">
                                        <input type="text" class="form-control bg-light border-0 small"
                                            placeholder="Search for..." aria-label="Search"
                                            aria-describedby="basic-addon2">
                                        <div class="input-group-append">
                                            <button class="btn btn-primary" type="button">
                                                <i class="fas fa-search fa-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </li>

                        <!-- Nav Item - Alerts -->
                        <li class="nav-item dropdown no-arrow mx-1">
                            <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-bell fa-fw"></i>
                                <!-- Counter - Alerts -->
                                <span class="badge badge-danger badge-counter">3+</span>
                            </a>
                            <!-- Dropdown - Alerts -->
                            <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="alertsDropdown">
                                <h6 class="dropdown-header">
                                    Alerts Center
                                </h6>
                                <a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="mr-3">
                                        <div class="icon-circle bg-primary">
                                            <i class="fas fa-file-alt text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="small text-gray-500">December 12, 2019</div>
                                        <span class="font-weight-bold">A new monthly report is ready to download!</span>
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="mr-3">
                                        <div class="icon-circle bg-success">
                                            <i class="fas fa-donate text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="small text-gray-500">December 7, 2019</div>
                                        $290.29 has been deposited into your account!
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="mr-3">
                                        <div class="icon-circle bg-warning">
                                            <i class="fas fa-exclamation-triangle text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="small text-gray-500">December 2, 2019</div>
                                        Spending Alert: We've noticed unusually high spending for your account.
                                    </div>
                                </a>
                                <a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                            </div>
                        </li>

                        <!-- Nav Item - Messages -->
                        <li class="nav-item dropdown no-arrow mx-1">
                            <!-- Dropdown - Messages -->
                            <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="messagesDropdown">
                                <h6 class="dropdown-header">
                                    Message Center
                                </h6>
                                <a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="dropdown-list-image mr-3">
                                        <img class="rounded-circle" src="/resources/img/undraw_profile_1.svg"
                                            alt="...">
                                        <div class="status-indicator bg-success"></div>
                                    </div>
                                    <div class="font-weight-bold">
                                        <div class="text-truncate">Hi there! I am wondering if you can help me with a
                                            problem I've been having.</div>
                                        <div class="small text-gray-500">Emily Fowler · 58m</div>
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="dropdown-list-image mr-3">
                                        <img class="rounded-circle" src="/resources/img/undraw_profile_2.svg"
                                            alt="...">
                                        <div class="status-indicator"></div>
                                    </div>
                                    <div>
                                        <div class="text-truncate">I have the photos that you ordered last month, how
                                            would you like them sent to you?</div>
                                        <div class="small text-gray-500">Jae Chun · 1d</div>
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="dropdown-list-image mr-3">
                                        <img class="rounded-circle" src="/resources/img/undraw_profile_3.svg"
                                            alt="...">
                                        <div class="status-indicator bg-warning"></div>
                                    </div>
                                    <div>
                                        <div class="text-truncate">Last month's report looks great, I am very happy with
                                            the progress so far, keep up the good work!</div>
                                        <div class="small text-gray-500">Morgan Alvarez · 2d</div>
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center" href="#">
                                    <div class="dropdown-list-image mr-3">
                                        <img class="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                                            alt="...">
                                        <div class="status-indicator bg-success"></div>
                                    </div>
                                    <div>
                                        <div class="text-truncate">Am I a good boy? The reason I ask is because someone
                                            told me that people say this to all dogs, even if they aren't good...</div>
                                        <div class="small text-gray-500">Chicken the Dog · 2w</div>
                                    </div>
                                </a>
                                <a class="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                            </div>
                        </li>

                        <div class="topbar-divider d-none d-sm-block"></div>

                        <!-- Nav Item - User Information -->
                        <li class="nav-item dropdown no-arrow">
                            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="mr-2 d-none d-lg-inline text-gray-600 small"><%=userName %>님</span>
                                <img class="img-profile rounded-circle"
                                    src="/resources/img/undraw_profile.svg">
                            </a>
                            <!-- Dropdown - User Information -->
                            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="userDropdown">
                                <a class="dropdown-item" href="/main/mypage.do">
                                    <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Profile
                                </a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </a>
                            </div>
                        </li>

                    </ul>

                </nav>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">

                    <!-- Page Heading -->
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
                    </div>

                    
                    <!-- Content Row -->

                    <div class="row">

                        <!-- Area Chart -->
                        <div class="col-xl-12">
                            <div class="card shadow mb-4">
                                <!-- Card Header - Dropdown -->
                                <div
                                    class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 font-weight-bold text-primary">Earnings Overview</h6>
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Dropdown Header:</div>
                                            <a class="dropdown-item" href="#">Action</a>
                                            <a class="dropdown-item" href="#">Another action</a>
                                            <div class="dropdown-divider"></div>
                                            <a class="dropdown-item" href="#">Something else here</a>
                                        </div>
                                    </div>
                                </div>
                                <!-- Card Body -->
                                <div class="card-body">
                                    <div class="chart-area">
                                        <div id="chartdiv" style="height:100%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                    
                    <!-- Content Row -->
					<div class="row">

						

							
					</div>
                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                    <div class="copyright text-center my-auto">
                        <span>Copyright &copy; Your Website 2021</span>
                    </div>
                </div>
            </footer>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>

    <!-- Logout Modal-->
    <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <a class="btn btn-primary" href="/user/logOut.do">Logout</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap core JavaScript-->
    <script src="/resources/vendor/jquery/jquery.min.js"></script>
    <script src="/resources/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Core plugin JavaScript-->
    <script src="/resources/vendor/jquery-easing/jquery.easing.min.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="/resources/js/sb-admin-2.min.js"></script>

    <!-- Page level plugins -->
 <!--    <script src="/resource/vendor/chart.js/Chart.min.js"></script>

    Page level custom scripts
    <script src="/resource/js/demo/chart-area-demo.js"></script>
    <script src="/resource/js/demo/chart-pie-demo.js"></script> -->

	<!--amChart 리소스  -->
	<script src="https://cdn.amcharts.com/lib/4/core.js"></script>
	<script src="https://cdn.amcharts.com/lib/4/charts.js"></script>
	<script src="https://cdn.amcharts.com/lib/4/themes/animated.js"></script>

	<!-- Chart code -->
	<script>
		am4core
				.ready(function() {

					// Themes begin
					am4core.useTheme(am4themes_animated);
					// Themes end

					// Create chart instance
					var chart = am4core.create("chartdiv", am4charts.XYChart);

					//

					// Increase contrast by taking evey second color
					chart.colors.step = 2;

					// Add data
					chart.data = generateChartData();

					// Create axes
					var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
					dateAxis.renderer.minGridDistance = 50;

					// Create series
					function createAxisAndSeries(field, name, opposite, bullet) {
						var valueAxis = chart.yAxes
								.push(new am4charts.ValueAxis());
						if (chart.yAxes.indexOf(valueAxis) != 0) {
							valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
						}

						var series = chart.series
								.push(new am4charts.LineSeries());
						series.dataFields.valueY = field;
						series.dataFields.dateX = "date";
						series.strokeWidth = 2;
						/* series.yAxis = valueAxis; */
						series.name = name;
						series.tooltipText = "{name}: [bold]{valueY}[/]";
						series.tensionX = 0.8;
						series.showOnInit = true;

						var interfaceColors = new am4core.InterfaceColorSet();

						switch (bullet) {
						case "triangle":
							var bullet = series.bullets
									.push(new am4charts.Bullet());
							bullet.width = 12;
							bullet.height = 12;
							bullet.horizontalCenter = "middle";
							bullet.verticalCenter = "middle";

							var triangle = bullet.createChild(am4core.Triangle);
							triangle.stroke = interfaceColors
									.getFor("background");
							triangle.strokeWidth = 2;
							triangle.direction = "top";
							triangle.width = 12;
							triangle.height = 12;
							break;
						case "rectangle":
							var bullet = series.bullets
									.push(new am4charts.Bullet());
							bullet.width = 10;
							bullet.height = 10;
							bullet.horizontalCenter = "middle";
							bullet.verticalCenter = "middle";

							var rectangle = bullet
									.createChild(am4core.Rectangle);
							rectangle.stroke = interfaceColors
									.getFor("background");
							rectangle.strokeWidth = 2;
							rectangle.width = 10;
							rectangle.height = 10;
							break;
						default:
							var bullet = series.bullets
									.push(new am4charts.CircleBullet());
							bullet.circle.stroke = interfaceColors
									.getFor("background");
							bullet.circle.strokeWidth = 2;
							break;
						}

						valueAxis.renderer.line.strokeOpacity = 1;
						valueAxis.renderer.line.strokeWidth = 2;
						valueAxis.renderer.line.stroke = series.stroke;
						valueAxis.renderer.labels.template.fill = series.stroke;
						valueAxis.renderer.opposite = opposite;
					}

					createAxisAndSeries("visits", "센서1", false, "circle");
					createAxisAndSeries("views", "센서2", true, "triangle");
					createAxisAndSeries("hits", "센서3", true, "rectangle");

					// Add legend
					chart.legend = new am4charts.Legend();

					// Add cursor
					chart.cursor = new am4charts.XYCursor();

					// generate some random data, quite different range
					function generateChartData() {
						var chartData = [];
						var firstDate = new Date();
						firstDate.setDate(firstDate.getDate() - 100);
						firstDate.setHours(0, 0, 0, 0);

						var visits = 1000;
						var hits = 1000;
						var views = 1000;

						for (var i = 0; i < 15; i++) {
							// we create date objects here. In your data, you can have date strings
							// and then set format of your dates using chart.dataDateFormat property,
							// however when possible, use date objects, as this will speed up chart rendering.
							var newDate = new Date(firstDate);
							newDate.setDate(newDate.getDate() + i);

							visits += Math.round((Math.random() < 0.5 ? 1 : -1)
									* Math.random() * 10);
							hits += Math.round((Math.random() < 0.5 ? 1 : -1)
									* Math.random() * 10);
							views += Math.round((Math.random() < 0.5 ? 1 : -1)
									* Math.random() * 10);

							chartData.push({
								date : newDate,
								visits : visits,
								hits : hits,
								views : views
							});
						}
						return chartData;
					}

				}); // end am4core.ready()
	</script>




	<script>
		am4core.ready(function() {

			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end

			// create chart
			var chart = am4core.create("chartdiv2", am4charts.GaugeChart);
			chart.innerRadius = am4core.percent(82);

			/**
			 * Normal axis
			 */

			var axis = chart.xAxes.push(new am4charts.ValueAxis());
			axis.min = 0;
			axis.max = 100;
			axis.strictMinMax = true;
			axis.renderer.radius = am4core.percent(80);
			axis.renderer.inside = true;
			axis.renderer.line.strokeOpacity = 1;
			axis.renderer.ticks.template.disabled = false
			axis.renderer.ticks.template.strokeOpacity = 1;
			axis.renderer.ticks.template.length = 10;
			axis.renderer.grid.template.disabled = true;
			axis.renderer.labels.template.radius = 40;
			axis.renderer.labels.template.adapter.add("text", function(text) {
				return text + "%";
			})

			/**
			 * Axis for ranges
			 */

			var colorSet = new am4core.ColorSet();

			var axis2 = chart.xAxes.push(new am4charts.ValueAxis());
			axis2.min = 0;
			axis2.max = 100;
			axis2.strictMinMax = true;
			axis2.renderer.labels.template.disabled = true;
			axis2.renderer.ticks.template.disabled = true;
			axis2.renderer.grid.template.disabled = true;

			var range0 = axis2.axisRanges.create();
			range0.value = 0;
			range0.endValue = 50;
			range0.axisFill.fillOpacity = 1;
			range0.axisFill.fill = colorSet.getIndex(0);

			var range1 = axis2.axisRanges.create();
			range1.value = 50;
			range1.endValue = 100;
			range1.axisFill.fillOpacity = 1;
			range1.axisFill.fill = colorSet.getIndex(2);

			/**
			 * Label
			 */

			var label = chart.radarContainer.createChild(am4core.Label);
			label.isMeasured = false;
			label.fontSize = 45;
			label.x = am4core.percent(50);
			label.y = am4core.percent(100);
			label.horizontalCenter = "middle";
			label.verticalCenter = "bottom";
			label.text = "50%";

			/**
			 * Hand
			 */

			var hand = chart.hands.push(new am4charts.ClockHand());
			hand.axis = axis2;
			hand.innerRadius = am4core.percent(20);
			hand.startWidth = 10;
			hand.pin.disabled = true;
			hand.value = 50;

			hand.events.on("propertychanged", function(ev) {
				range0.endValue = ev.target.value;
				range1.value = ev.target.value;
				label.text = axis2.positionToValue(hand.currentPosition)
						.toFixed(1);
				axis2.invalidate();
			});

			setInterval(function() {
				var value = Math.round(Math.random() * 100);
				var animation = new am4core.Animation(hand, {
					property : "value",
					to : value
				}, 1000, am4core.ease.cubicOut).start();
			}, 2000);

		}); // end am4core.ready()
	</script>
	<!--Fan 동작 스크립트  -->
	<script type="text/javascript">
    function changeFan(index) { 
    	if(index==1) {
    		document.getElementById("fanImg").src = "/resources/img/fan.gif";
    	} else if(index==2) {
    		document.getElementById("fanImg").src = "/resources/img/fan.jpg";
    	}
    }
    </script>
    	<script>
		am4core.ready(function() {

			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end

			// create chart
			var chart = am4core.create("chartdiv3", am4charts.GaugeChart);
			chart.innerRadius = am4core.percent(82);

			/**
			 * Normal axis
			 */

			var axis = chart.xAxes.push(new am4charts.ValueAxis());
			axis.min = 0;
			axis.max = 100;
			axis.strictMinMax = true;
			axis.renderer.radius = am4core.percent(80);
			axis.renderer.inside = true;
			axis.renderer.line.strokeOpacity = 1;
			axis.renderer.ticks.template.disabled = false
			axis.renderer.ticks.template.strokeOpacity = 1;
			axis.renderer.ticks.template.length = 10;
			axis.renderer.grid.template.disabled = true;
			axis.renderer.labels.template.radius = 40;
			axis.renderer.labels.template.adapter.add("text", function(text) {
				return text + "%";
			})

			/**
			 * Axis for ranges
			 */

			var colorSet = new am4core.ColorSet();

			var axis2 = chart.xAxes.push(new am4charts.ValueAxis());
			axis2.min = 0;
			axis2.max = 100;
			axis2.strictMinMax = true;
			axis2.renderer.labels.template.disabled = true;
			axis2.renderer.ticks.template.disabled = true;
			axis2.renderer.grid.template.disabled = true;

			var range0 = axis2.axisRanges.create();
			range0.value = 0;
			range0.endValue = 50;
			range0.axisFill.fillOpacity = 1;
			range0.axisFill.fill = colorSet.getIndex(0);

			var range1 = axis2.axisRanges.create();
			range1.value = 50;
			range1.endValue = 100;
			range1.axisFill.fillOpacity = 1;
			range1.axisFill.fill = colorSet.getIndex(2);

			/**
			 * Label
			 */

			var label = chart.radarContainer.createChild(am4core.Label);
			label.isMeasured = false;
			label.fontSize = 45;
			label.x = am4core.percent(50);
			label.y = am4core.percent(100);
			label.horizontalCenter = "middle";
			label.verticalCenter = "bottom";
			label.text = "50%";

			/**
			 * Hand
			 */

			var hand = chart.hands.push(new am4charts.ClockHand());
			hand.axis = axis2;
			hand.innerRadius = am4core.percent(20);
			hand.startWidth = 10;
			hand.pin.disabled = true;
			hand.value = 50;

			hand.events.on("propertychanged", function(ev) {
				range0.endValue = ev.target.value;
				range1.value = ev.target.value;
				label.text = axis2.positionToValue(hand.currentPosition)
						.toFixed(1);
				axis2.invalidate();
			});

			setInterval(function() {
				var value = Math.round(Math.random() * 100);
				var animation = new am4core.Animation(hand, {
					property : "value",
					to : value
				}, 1000, am4core.ease.cubicOut).start();
			}, 2000);

		}); // end am4core.ready()
	</script>
	<!--Fan 동작 스크립트  -->
	<script type="text/javascript">
    function changeFan(index) { 
    	if(index==1) {
    		document.getElementById("fanImg").src = "/resources/img/fan.gif";
    	} else if(index==2) {
    		document.getElementById("fanImg").src = "/resources/img/fan.jpg";
    	}
    }
    </script>
    	<script>
		am4core.ready(function() {

			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end

			// create chart
			var chart = am4core.create("chartdiv4", am4charts.GaugeChart);
			chart.innerRadius = am4core.percent(82);

			/**
			 * Normal axis
			 */

			var axis = chart.xAxes.push(new am4charts.ValueAxis());
			axis.min = 0;
			axis.max = 100;
			axis.strictMinMax = true;
			axis.renderer.radius = am4core.percent(80);
			axis.renderer.inside = true;
			axis.renderer.line.strokeOpacity = 1;
			axis.renderer.ticks.template.disabled = false
			axis.renderer.ticks.template.strokeOpacity = 1;
			axis.renderer.ticks.template.length = 10;
			axis.renderer.grid.template.disabled = true;
			axis.renderer.labels.template.radius = 40;
			axis.renderer.labels.template.adapter.add("text", function(text) {
				return text + "%";
			})

			/**
			 * Axis for ranges
			 */

			var colorSet = new am4core.ColorSet();

			var axis2 = chart.xAxes.push(new am4charts.ValueAxis());
			axis2.min = 0;
			axis2.max = 100;
			axis2.strictMinMax = true;
			axis2.renderer.labels.template.disabled = true;
			axis2.renderer.ticks.template.disabled = true;
			axis2.renderer.grid.template.disabled = true;

			var range0 = axis2.axisRanges.create();
			range0.value = 0;
			range0.endValue = 50;
			range0.axisFill.fillOpacity = 1;
			range0.axisFill.fill = colorSet.getIndex(0);

			var range1 = axis2.axisRanges.create();
			range1.value = 50;
			range1.endValue = 100;
			range1.axisFill.fillOpacity = 1;
			range1.axisFill.fill = colorSet.getIndex(2);

			/**
			 * Label
			 */

			var label = chart.radarContainer.createChild(am4core.Label);
			label.isMeasured = false;
			label.fontSize = 45;
			label.x = am4core.percent(50);
			label.y = am4core.percent(100);
			label.horizontalCenter = "middle";
			label.verticalCenter = "bottom";
			label.text = "50%";

			/**
			 * Hand
			 */

			var hand = chart.hands.push(new am4charts.ClockHand());
			hand.axis = axis2;
			hand.innerRadius = am4core.percent(20);
			hand.startWidth = 10;
			hand.pin.disabled = true;
			hand.value = 50;

			hand.events.on("propertychanged", function(ev) {
				range0.endValue = ev.target.value;
				range1.value = ev.target.value;
				label.text = axis2.positionToValue(hand.currentPosition)
						.toFixed(1);
				axis2.invalidate();
			});

			setInterval(function() {
				var value = Math.round(Math.random() * 100);
				var animation = new am4core.Animation(hand, {
					property : "value",
					to : value
				}, 1000, am4core.ease.cubicOut).start();
			}, 2000);

		}); // end am4core.ready()
	</script>
	<!--Fan 동작 스크립트  -->
	<script type="text/javascript">
    function changeFan(index) { 
    	if(index==1) {
    		document.getElementById("fanImg").src = "/resources/img/fan.gif";
    	} else if(index==2) {
    		document.getElementById("fanImg").src = "/resources/img/fan.jpg";
    	}
    }
    </script>
    

</body>
</html>