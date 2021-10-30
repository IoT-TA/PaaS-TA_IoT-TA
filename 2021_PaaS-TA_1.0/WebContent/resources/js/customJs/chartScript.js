/* @Auth 최별규
 @Version 1.1
 사용자 정의 js, 몽고에서 데이터를 가져와서 모달을 처리 하기 위한 동적처리를 정의해 놓은 js
   __________________________________________________________________________________________________________________________
   |   시기    |   작성일     |   작성자    |                                     내용                                      |
   |-------------------------------------------------------------------------------------------------------------------------
   | 최초 작성 | 2021.09.14   |  최별규     |  초안 작성
   | 중간 수정 | 2021.09.15   |  최별규     |  최종 완성(콜백 부분 반드시!!프로미스나 async로 업데이트하기!!)
   | 최종 완료 | 2021.09.24   |  김하윤     |  initModal 코드 리팩토링
   --------------------------------------------------------------------------------------------------------------------------
*/ // => 차트 처리 담당 JS
'use strict'
//------------------------------------
						var visits = 399; // => 1번 센서
						var views = 370;  // => 2번 센서
						var hits = 388;   // => 3번 센서
//------------------------------------
//----------------------------전체 센서 그래프 보여주는 JS---------------------------------------------\
am4core
				.ready(function() {
					// Themes begin
					am4core.useTheme(am4themes_animated);
					// Create chart instance
					var chart = am4core.create("chartdiv", am4charts.XYChart);
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
					//-------------------------------------------------------------
								// 인자 : (이름, 표시할 이름, ? ,  차트 표현 모양)
					createAxisAndSeries("visits", "센서1", false, "circle");
					createAxisAndSeries("views", "센서2", true, "triangle");
					createAxisAndSeries("hits", "센서3", true, "rectangle");
					//-------------------------------------------------------------
					// Add legend
					chart.legend = new am4charts.Legend();
					// Add cursor
					chart.cursor = new am4charts.XYCursor();
					// ------------------------------------------------ 차트 데이터 생성---------------------------------------------------------------
					function generateChartData() { // => Param 형식 : {"1" : data, "2" : data, "3" : data}
						// console.log("sensorData : " + sensorData); 
						var chartData = [];
						var firstDate = new Date(); // => 날짜 생성 객체 선언
						//firstDate.setDate(firstDate.getDate()); // => 일 별로 적용 시킬 때 사용
						firstDate.setHours(firstDate.getHours(), firstDate.getMinutes() - 20, 0, 0); // => p1: 현재 시간, p2: 현재 분, p3:0초, p4: 0밀리초
						//----------------------------------------------------- 센서 초기 값------------------------------------------------------------
						// var visits = 1000; // => 1번 센서
						// var views = 1000;  // => 2번 센서
						// var hits = 1000;   // => 3번 센서
						//------------------------------------------------------------------------------------------------------------------------------
						for (var i = 0; i < 15; i++) {
							var newDate = new Date(firstDate); // => 차트 하단 부 날짜 선언 부
							//--------------------------------------------------------------------------------------------------------------------------
							//newDate.setDate(newDate.getDate() + i); // => 일 별로 적용 시킬 때 사용
							newDate.setHours(newDate.getHours(), newDate.getMinutes() + i, 0, 0);
							//----------------------------------------------센서 Data 넣는 구간---------------------------------------------------------
							visits += 2;
							hits += 2;
							views += 2;
							//--------------------------------------------------------------------------------------------------------------------------
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
//-------------------------------------------------센서1 차트 JS--------------------------------------------------------------------
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
		
//----------------------------------------센서2 차트 JS----------------------------------------------------------------------------
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
		
//------------------------------------------센서3 차트 JS--------------------------------------------------------------------------
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
		
//------------------------------------------<                  >--------------------------------------------------------------------------