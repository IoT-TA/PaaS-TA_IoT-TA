package poly.controller;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import poly.dto.MongoDTO;
import poly.mongo.IMongoMapper;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/* @Auth 최별규
 * @Version 1.1
 * 센서 값을 몽고에서 가져오는 기능을 정의한 클래스
 * ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.09.13   |  최별규     |  초안 작성
 * |              |             |
 * */

@Controller 
public class MongoController {
	//---------------------------------------------------------------Resource 선언부--------------------------------------------
	@Resource(name="MongoMapper")
	private IMongoMapper mongoMapper;	
	//---------------------------------------------------------------------------------------------------------------------------
	private Logger log = Logger.getLogger(this.getClass());
	//-----------------------------------------오늘 날짜에 해당하는 데이터 몽고에서 뽑아오기------------------------------------
	// 서브쿼리에 어그리게이션이 잘안대서 기능을 찢었음...(최신 센서 번호 가져오기, 가져온 정보로 센서데이터 가져오기)
	@RequestMapping(value = "/mongoGetAgg")
	public List<MongoDTO> getDailySensorData() throws Exception{
		log.info("getDailySensorData Start!!");
		List<MongoDTO> dailySensor = new ArrayList<MongoDTO>();
		dailySensor = mongoMapper.getDailySensorData(); // 최근에 들어온 센서 정보를 가져오는 메서드
		
		for(MongoDTO e : dailySensor) { // 데이터 확인
			log.info(e.getDate());
			log.info(e.getSENSOR_NUMBER());
			log.info(e.getSENSOR_DATA());
		}
		//---------------------------------------------최근 정보에 해당하는 센서 데이터 가져오기------------------------------------
		List<MongoDTO> sensorDataMatch = new ArrayList<MongoDTO>();
		sensorDataMatch = mongoMapper.getSensorDataMatch(dailySensor); // 매칭되는 센서 정보 가져오기
		log.info(sensorDataMatch);
		
		
		log.info("getDailySensorData END!!");
		return dailySensor;
	}
	//---------------------------------------------------------------임베디드 Mongo Test----------------------------------------------
	@RequestMapping(value="mongoTest")
	public String Mongo(HttpServletRequest request, ModelMap model) throws Exception { 
		log.info(this.getClass().getName() + "Mongo Start!");
		List<MongoDTO> rList = mongoMapper.getCollectionsData("schemas");
		Iterator<MongoDTO> it = rList.iterator();
		
		int num = 0;
		while (it.hasNext()) {
			MongoDTO dto = it.next();
			if (num < 10) {
				model.addAttribute("Date", dto.getDate());
				model.addAttribute("SENSOR_NUM", dto.getSENSOR_NUMBER());
				model.addAttribute("SENSOR_DATA", dto.getSENSOR_DATA());
			}
			log.info(num + " 번째 Date : " + dto.getDate());
			log.info(num + " 번째 SENSOR_NUM : " + dto.getSENSOR_NUMBER());
			log.info(num + " 번째 SENSOR_DATA : " + dto.getSENSOR_DATA());
			num++;
		}
		log.info(this.getClass().getName() + ".Mongo End!");
		return "/mongo/MongoTest";
	}
	
}
