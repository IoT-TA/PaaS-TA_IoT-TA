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
						let safe = 380; // => 상수값 차트에 퍼센티지 반영용
//------------------------------------
//----------------------------전체 센서 그래프 보여주는 JS----------------------------------------------
	/***********************core.js를 잘 불러오면 차트 시작**************************************/
			am4core.ready(function () {
				console.log("메인 차트 실행");
				am4core.useTheme(am4themes_animated);

			/***********************ID:chartdiv에 넣을 차트 객체 생성************************************/
				var chart = am4core.create('chartdiv', am4charts.XYChart);
				chart.hiddenState.properties.opacity = 0;
				chart.zoomOutButton.disabled = true;

			/***********************차트 초기값 설정**************************************************/
				let data = [];
				let visits = [100,200,345,352,339,326,343,356,315,326];
				let visits2 = [150,250,326,344,312,322,315,336,355,346];
				let i = 0;
				for (i = 0; i <= 10; i++) {
					data.push({
						aDate: new Date().setSeconds(i - 30),
						aValue: visits[i],
						bDate: new Date().setSeconds(i - 30),
						bValue: visits2[i],
					});
				}
				chart.data = data;

			/***********************x축 설정 **************************************************/
			/*x축은 Date형태로                 		 */
			/*x축 타이틀 이름은 'Date'  		 */
			/*초단위로 출력 후 1분 단위로 시간 보여주기  */
				var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
				dateAxis.title.text = '시간(초)';
				dateAxis.renderer.grid.template.location = 0;
				dateAxis.renderer.minGridDistance = 30;
				dateAxis.dateFormats.setKey('second', 'ss');
				dateAxis.periodChangeDateFormats.setKey('second', '[bold]h:mm a');
				dateAxis.periodChangeDateFormats.setKey('minute', '[bold]h:mm a');
				dateAxis.periodChangeDateFormats.setKey('hour', '[bold]h:mm a');
				/* dateAxis.renderer.inside = true;
				dateAxis.renderer.axisFills.template.disabled = true;
				dateAxis.renderer.ticks.template.disabled = true; */

				dateAxis.interpolationDuration = 500;
				dateAxis.rangeChangeDuration = 500;

			/***********************y축 설정 **************************************************/
			/*y축은 Value형태로                 		 */
			/*y축 타이틀 이름은 'Value'  		 */
				var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
				var temp = JSON.parse(localStorage.getItem("sensorOBJ"));
				let limitValueFotChart = temp["limitValue"];
				valueAxis.title.text = `CO2농도(${limitValueFotChart})`;
				valueAxis.tooltip.disabled = true;
				valueAxis.interpolationDuration = 500;
				valueAxis.rangeChangeDuration = 500;
				valueAxis.renderer.inside = true;
				valueAxis.renderer.minLabelPosition = 0.05;
				valueAxis.renderer.maxLabelPosition = 0.95;
				valueAxis.renderer.axisFills.template.disabled = true;
				valueAxis.renderer.ticks.template.disabled = true;

				document.addEventListener(
					'visibilitychange',
					function () {
						if (document.hidden) {
							if (interval) {
								clearInterval(interval);
							}
						} else {
							startInterval();
						}
					},
					false
				);

			/***********************센서1 라인 그리기**************************************************/
			/*센서1은 Line형태로                 		         */
			/*센서1 X,Y 값의 이름을 aData, aValue로 설정   */
			/*센서1 Line 색깔은 빨간색 				 */
				var trend = chart.series.push(new am4charts.LineSeries());
				trend.dataFields.dateX = 'aDate';
				trend.dataFields.valueY = 'aValue';
				trend.interpolationDuration = 500;
				trend.defaultState.transitionDuration = 0;
				trend.tensionX = 0.8;
				trend.stroke = '#ff0000';
			/***********************센서2 라인 그리기**************************************************/
			/*센서2은 Line형태로                 		         */
			/*센서2 X,Y 값의 이름을 bData, bValue로 설정   */
			/*센서2 Line 색깔은 초록색 				 */
				var trend2 = chart.series.push(new am4charts.LineSeries());
				trend2.dataFields.dateX = 'bDate';
				trend2.dataFields.valueY = 'bValue';
				trend2.interpolationDuration = 500;
				trend2.defaultState.transitionDuration = 0;
				trend2.tensionX = 0.8;
				trend2.stroke = '#00ff00';
			/***********************실시간으로 데이터 넣기************************************************/
			/*x축에 시간이 들어가기 대문에 Date형태 선언	      */
				var interval;
				//let visitsRealTime = [360,382,343,333,244,222,234,198,215,235]; // => 기존 코드 주석처리
				//let visitsRealTime2 = [352,323,377,310,378,356,342,368,377,346]; // => 기존 코드 주석처리
				let sensorOBJ = JSON.parse(localStorage.getItem("sensorOBJ"));
				let visitsRealTime = [ sensorOBJ["sensorNum1"] ]; // => 첫 페이지 로드시 띄울 값
				let visitsRealTime2 = [ sensorOBJ["sensorNum2"] ]; 
				//let senIndex=0; // => 기존 코드 주석처리
				function startInterval() {
					interval = setInterval(function () {
						var l = trend.dataItems.getIndex(trend.dataItems.length - 1);
						var l2 = trend2.dataItems.getIndex(trend2.dataItems.length - 1);
						chart.addData(
							{
								aDate: new Date(l.dateX.getTime() + 1000),
								bDate: new Date(l2.dateX.getTime() + 1000),
								//aValue: visitsRealTime[senIndex], // => 기존 코드 주석처리
								//bValue: visitsRealTime2[senIndex], // => 기존 코드 주석처리
								aValue : visitsRealTime,
								bValue : visitsRealTime2,

							},
							1
						);
						// => 초기 데이터 가져 온 후 실시간으로 값을 넣어주기 위한 작업
						sensorOBJ = JSON.parse(localStorage.getItem("sensorOBJ"));
						visitsRealTime = sensorOBJ["sensorNum1"];
						visitsRealTime2 = sensorOBJ["sensorNum2"];
						//senIndex++; // => 기존 코드 주석처리
						
					}, 3000);
				}

			/***********************선 끝의 모양 설정************************************************/
			/*센서 1의 모양 설정	      */
				var bullet = trend.createChild(am4charts.CircleBullet);
				bullet.circle.radius = 5;
				bullet.fillOpacity = 1;
				bullet.fill = '#ff0000';
				bullet.isMeasured = false;

				trend.events.on('validated', function () {
					bullet.moveTo(trend.dataItems.last.point);
					bullet.validatePosition();
				});
			/*센서 2의 모양 설정	      */
				var bullet2 = trend2.createChild(am4charts.CircleBullet);
				bullet2.circle.radius = 5;
				bullet2.fillOpacity = 1;
				bullet2.fill = '#00ff00';
				bullet2.isMeasured = false;

				trend2.events.on('validated', function () {
					bullet2.moveTo(trend2.dataItems.last.point);
					bullet2.validatePosition();
				});
				startInterval();

			});
				
//-------------------------------------------------센서1 차트 JS-------------------------------------------------------------------
			//am5.ready(function() {
			am4core.ready(function () {
			var sensorDataOBJ = JSON.parse(localStorage.getItem("sensorOBJ")); // => JSON 파싱해서 불러오는 변수
			let sensorNumberOne = parseInt(sensorDataOBJ["sensorNum1"]); // => 그중에서 센서 1번 값만 가져오는 변수
			var limit = parseInt(sensorDataOBJ["limitValue"]);
			let percent = sensorNumberOne / safe * 100 - (limit - 210) //=> 백분율로 만들어주는 변수
			
			// Create root element
			// https://www.amcharts.com/docs/v5/getting-started/#Root_element
			var root = am5.Root.new("chartdiv1");
			
			// Set themes
			// https://www.amcharts.com/docs/v5/concepts/themes/
			root.setThemes([
			  am5themes_Animated.new(root)
			]);
			
			
			// Create chart
			// https://www.amcharts.com/docs/v5/charts/radar-chart/
			var chart = root.container.children.push(am5radar.RadarChart.new(root, {
			  panX: false,
			  panY: false,
			  startAngle: 160,
			  endAngle: 380
			}));
			
			
			// Create axis and its renderer
			// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
			var axisRenderer = am5radar.AxisRendererCircular.new(root, {
			  innerRadius: -40
			});
			
			axisRenderer.grid.template.setAll({
			  stroke: root.interfaceColors.get("background"),
			  visible: true,
			  strokeOpacity: 0.8
			});
			
			var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
			  maxDeviation: 0,
			  min: -40,
			  max: 100,
			  strictMinMax: true,
			  renderer: axisRenderer
			}));
			
			
			// Add clock hand
			// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
			var axisDataItem = xAxis.makeDataItem({});
			
			var clockHand = am5radar.ClockHand.new(root, {
			  pinRadius: am5.percent(20),
			  radius: am5.percent(100),
			  bottomWidth: 40
			})
			
			var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
			  sprite: clockHand
			}));
			
			xAxis.createAxisRange(axisDataItem);
			
			var label = chart.radarContainer.children.push(am5.Label.new(root, {
			  fill: am5.color(0xffffff),
			  centerX: am5.percent(50),
			  textAlign: "center",
			  centerY: am5.percent(50),
			  fontSize: "3em"
			}));
			
			axisDataItem.set("value", 50);
			bullet.get("sprite").on("rotation", function () {
			  var value = axisDataItem.get("value");
			  var text = Math.round(axisDataItem.get("value")).toString();
			  var fill = am5.color(0x000000);
			  xAxis.axisRanges.each(function (axisRange) {
			    if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
			      fill = axisRange.get("axisFill").get("fill");
			    }
			  })
			
			  label.set("text", Math.round(value).toString());
			
			  clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
			  clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
			});
			
			setInterval(function () {
			  sensorDataOBJ = JSON.parse(localStorage.getItem("sensorOBJ"));
			  sensorNumberOne = parseInt(sensorDataOBJ["sensorNum1"])
			  percent = sensorNumberOne / safe * 100 - (limit - 210);
			  axisDataItem.animate({
			    key: "value",
			    //to: Math.round(Math.random() * 140 - 40), // => 기존 코드
			    to : percent, // => 실시간 센서 1번 데이터 가져오기
			    duration: 500,
			    easing: am5.ease.out(am5.ease.cubic)
			  });
			}, 2000)
			
			chart.bulletsContainer.set("mask", undefined);
			
			
			// 차트 한글 영역 부분 지정부
			var bandsData = [{
			  title: "-0%",
			  color: "#ee1f25",
			  lowScore: -40,
			  highScore: -20
			}, {
			  title: "누출",
			  color: "#f04922",
			  lowScore: -20,
			  highScore: 0
			}, {
			  title: "위험",
			  color: "#fdae19",
			  lowScore: 0,
			  highScore: 20
			}, {
			  title: "예상",
			  color: "#f3eb0c",
			  lowScore: 20,
			  highScore: 40
			}, {
			  title: "확인",
			  color: "#b0d136",
			  lowScore: 40,
			  highScore: 60
			}, {
			  title: "안전",
			  color: "#54b947",
			  lowScore: 60,
			  highScore: 80
			}, 
			{
			  title: "S",
			  color: "#0f9747",
			  lowScore: 80,
			  highScore: 100
			}
			];
			
			am5.array.each(bandsData, function (data) {
			  var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
			
			  axisRange.setAll({
			    value: data.lowScore,
			    endValue: data.highScore
			  });
			
			  axisRange.get("axisFill").setAll({
			    visible: true,
			    fill: am5.color(data.color),
			    fillOpacity: 0.8
			  });
			
			  axisRange.get("label").setAll({
			    text: data.title,
			    inside: true,
			    radius: 15,
			    fontSize: "0.9em",
			    fill: root.interfaceColors.get("background")
			  });
			});
			
			
			// Make stuff animate on load
			chart.appear(1000, 100);
			
			}); // end am5.ready()	
		
//-------------------------------------------------센서2 차트 JS-------------------------------------------------------------------
	//am5.ready(function() {
			am4core.ready(function () {
			var sensorDataOBJ = JSON.parse(localStorage.getItem("sensorOBJ")); // => JSON 파싱해서 불러오는 변수
			let sensorNumberOne = parseInt(sensorDataOBJ["sensorNum2"]); // => 그중에서 센서 1번 값만 가져오는 변수
			let percent = sensorNumberOne / safe * 100 - 70 //=> 백분율로 만들어주는 변수
			
			// Create root element
			// https://www.amcharts.com/docs/v5/getting-started/#Root_element
			var root = am5.Root.new("chartdiv2");
			
			// Set themes
			// https://www.amcharts.com/docs/v5/concepts/themes/
			root.setThemes([
			  am5themes_Animated.new(root)
			]);
			
			
			// Create chart
			// https://www.amcharts.com/docs/v5/charts/radar-chart/
			var chart = root.container.children.push(am5radar.RadarChart.new(root, {
			  panX: false,
			  panY: false,
			  startAngle: 160,
			  endAngle: 380
			}));
			
			
			// Create axis and its renderer
			// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
			var axisRenderer = am5radar.AxisRendererCircular.new(root, {
			  innerRadius: -40
			});
			
			axisRenderer.grid.template.setAll({
			  stroke: root.interfaceColors.get("background"),
			  visible: true,
			  strokeOpacity: 0.8
			});
			
			var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
			  maxDeviation: 0,
			  min: -40,
			  max: 100,
			  strictMinMax: true,
			  renderer: axisRenderer
			}));
			
			
			// Add clock hand
			// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
			var axisDataItem = xAxis.makeDataItem({});
			
			var clockHand = am5radar.ClockHand.new(root, {
			  pinRadius: am5.percent(20),
			  radius: am5.percent(100),
			  bottomWidth: 40
			})
			
			var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
			  sprite: clockHand
			}));
			
			xAxis.createAxisRange(axisDataItem);
			
			var label = chart.radarContainer.children.push(am5.Label.new(root, {
			  fill: am5.color(0xffffff),
			  centerX: am5.percent(50),
			  textAlign: "center",
			  centerY: am5.percent(50),
			  fontSize: "3em"
			}));
			
			axisDataItem.set("value", 50);
			bullet.get("sprite").on("rotation", function () {
			  var value = axisDataItem.get("value");
			  var text = Math.round(axisDataItem.get("value")).toString();
			  var fill = am5.color(0x000000);
			  xAxis.axisRanges.each(function (axisRange) {
			    if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
			      fill = axisRange.get("axisFill").get("fill");
			    }
			  })
			
			  label.set("text", Math.round(value).toString());
			
			  clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
			  clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
			});
			
			setInterval(function () {
			  sensorDataOBJ = JSON.parse(localStorage.getItem("sensorOBJ"));
			  sensorNumberOne = parseInt(sensorDataOBJ["sensorNum2"])
			  percent = sensorNumberOne / safe * 100 - 70;
			  axisDataItem.animate({
			    key: "value",
			    //to: Math.round(Math.random() * 140 - 40), // => 기존 코드
			    to : percent, // => 실시간 센서 1번 데이터 가져오기
			    duration: 500,
			    easing: am5.ease.out(am5.ease.cubic)
			  });
			}, 2000)
			
			chart.bulletsContainer.set("mask", undefined);
			
			
			// 차트 한글 영역 부분 지정부
			var bandsData = [{
			  title: "-0%",
			  color: "#ee1f25",
			  lowScore: -40,
			  highScore: -20
			}, {
			  title: "누출",
			  color: "#f04922",
			  lowScore: -20,
			  highScore: 0
			}, {
			  title: "위험",
			  color: "#fdae19",
			  lowScore: 0,
			  highScore: 20
			}, {
			  title: "예상",
			  color: "#f3eb0c",
			  lowScore: 20,
			  highScore: 40
			}, {
			  title: "확인",
			  color: "#b0d136",
			  lowScore: 40,
			  highScore: 60
			}, {
			  title: "안전",
			  color: "#54b947",
			  lowScore: 60,
			  highScore: 80
			}, 
			{
			  title: "S",
			  color: "#0f9747",
			  lowScore: 80,
			  highScore: 100
			}
			];
			
			am5.array.each(bandsData, function (data) {
			  var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
			
			  axisRange.setAll({
			    value: data.lowScore,
			    endValue: data.highScore
			  });
			
			  axisRange.get("axisFill").setAll({
			    visible: true,
			    fill: am5.color(data.color),
			    fillOpacity: 0.8
			  });
			
			  axisRange.get("label").setAll({
			    text: data.title,
			    inside: true,
			    radius: 15,
			    fontSize: "0.9em",
			    fill: root.interfaceColors.get("background")
			  });
			});
			
			
			// Make stuff animate on load
			chart.appear(1000, 100);
			
			}); // end am5.ready()	
		
//------------------------------------------------------<                  >------------------------------------------------