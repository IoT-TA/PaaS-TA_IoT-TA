

$(document).ready(()=> {	// parameter 정보 : p1 : 몽고에서 센서 정보 가져오기, p2 : fan 동작 컨트롤
		getUserInfo()
	})
	
function getUserInfo() {
	$.ajax({
		url: '/user/getMinutesLineByEmail.do',
		type: 'GET',
		success: function (data) {
			console.log("data[1] : "+ data[1])
			document.getElementById("fan__operating__time").value = data[1];
			console.log("data[0] : "+ data[0])
			document.getElementById("fan__operating__cycle").value = data[0];
		}, 
		error: function (e) {
			console.log("error : "+e);
		}
	})
}

function updateFanSetting() {
		
		let fanOperatingValue = document.getElementById('fan__operating__time').value
		let fanOperatingCycle = document.getElementById('fan__operating__cycle').value
		console.log("fanOperatingValue : "+fanOperatingValue);
		console.log("fanOperatingCycle : "+fanOperatingCycle);
		let query = {
			"minutesLine" : fanOperatingCycle+' '+fanOperatingValue
		}
		$.ajax({
			url: "/user/updateMinutesLine.do",
			type: "POST",
			data: query,
			success: function (data) {
				console.log("data : "+data);
			},
			error: function (e) {
				console.log("error : "+e);
			}
		})
	}