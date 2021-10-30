package poly.mongo.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.AggregationOptions;
import com.mongodb.BasicDBObject;
import com.mongodb.Cursor;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoException;

import config.Mapper;
import poly.dto.MongoDTO;
import poly.mongo.IMongoMapper;
import poly.util.CmmUtil;

/* @Auth 최별규
 * @Version 1.1
 * 센서데이터와 몽고 비동기 처리를 위한 컨트롤러
 *  ____________________________________________________________________________________
 * |   작성일     |   작성자    |                          내용                        |
 * |------------------------------------------------------------------------------------
 * | 2021.07.11   |  양원석     | 몽고연동 초안 작성
 * | 2021.09.13   |  최별규     | 몽고에서 최신 데이터를 출력하는 내용 작성
 * | 2021.09.16   |  최별규     | 어그리게이션 성능 올리기 요망
 * */

@Mapper("MongoMapper")
public class MongoMapper implements IMongoMapper {
	private Logger log = Logger.getLogger(this.getClass());
	//--------------------------------------------------몽고 빈 주입 부분--------------------------------------------
	@Autowired
	private MongoTemplate mongodb; // => 몽고템플릿 주입(xml에 설정 해놓은 것)
	//----------------------------------------------------------------------------------------------------------------
	//--------------------------------------------Collection data 뽑아오는 테스트-------------------------------------
	@Override
	public List<MongoDTO> getCollectionsData(String colNm) throws Exception {
		log.info(this.getClass().getName() + ".get Datas Start!"); 
		List<MongoDTO> rList = new ArrayList<>();
		MongoDTO rDTO = null;
		//-----------------------------------------------colNm에 맞는 컬렉션을 선택-----------------------------------
		DBCollection rCol = mongodb.getCollection(colNm); 
		Iterator<DBObject> cursor = rCol.find();
		//-------------------------------------------------cursor안의 값을 가져옴-------------------------------------
		while (cursor.hasNext()) { // DB에서 값을 한 줄씩 읽어 오기 떄문에 반복문을 돌림
			rDTO = new MongoDTO();
			final DBObject current = cursor.next(); //=> 몽고의 데이터를 자바로 처리하기 위한 전처리 작업
			String Date = (String) current.get("date");
			// 데이터베이스 => 컬렉션 => 문서(json)
			String SensorNum = (String) current.get("SENSOR_NUMBER");
			String SensorData = (String) current.get("SENSOR_DATA");

			rDTO.setDate(Date); 
			rDTO.setSENSOR_NUMBER(SensorNum);
			rDTO.setSENSOR_DATA(SensorData);
			rList.add(rDTO); 
			
			rDTO = null;
		}
		log.info(this.getClass().getName() + ".get Datas End!");
		return rList; 
	}
	//--------------------------------------몽고에서 최근 날짜에 들어온 센서 번호를 가져오는 어그리게이션 메서드--------
	@Override
	public List<MongoDTO> getDailySensorData() throws Exception {
		log.info("몽고 데이터 뽑기");

		List<MongoDTO> rList = null;
		MongoDTO mDTO = null;

		// Studio 3T java 2.xdriver API 기준 DBObject 방식
		try {
			// 데이터 추출할 컬렉션 정보
			DBCollection collection = mongodb.getCollection("schemas");

			List<DBObject> pipeline = Arrays.asList(new BasicDBObject().append("$group",
					new BasicDBObject().append("_id", new BasicDBObject().append("SENSOR_NUMBER", "$SENSOR_NUMBER"))
							.append("MAX(date)", new BasicDBObject().append("$max", "$date"))),
					new BasicDBObject().append("$project",
							new BasicDBObject().append("SENSOR_NUMBER", "$_id.SENSOR_NUMBER")
									.append("MAX(date)", "$MAX(date)").append("_id", 0)));
			AggregationOptions options = AggregationOptions.builder().outputMode(AggregationOptions.OutputMode.CURSOR)
					.allowDiskUse(true).build();
			//----------------------------------------------------몽고서버로 정보--------------------------------------------------
			//----------------------------------------- Cursor는 Line으로 데이터를 읽어옴------------------------------------------
			log.info("cursor start");
			Cursor cursor = collection.aggregate(pipeline, options); // (arg1, arg2) arg1 : 쿼리도큐먼트, arg2: 집계함수 성능올리기
			log.info("cursor end");
			//-------------------------------------------------------몽고에서 가져온 데이터 저장하기 위한 처리-----------------------
			rList = new ArrayList<MongoDTO>();
			while (cursor.hasNext()) {
				mDTO = new MongoDTO();
				final DBObject current = cursor.next(); // DBObject 객체에 몽고 데이터 한 줄을 넣음(문서에서 한 줄 씩 뽑아옴)
				mDTO.setDate(CmmUtil.nvl(current.get("MAX(date)").toString()));
				mDTO.setSENSOR_NUMBER(CmmUtil.nvl(current.get("SENSOR_NUMBER").toString()));
				rList.add(mDTO);
				// log.info(mDTO.getDate());
				// log.info(mDTO.getSENSOR_NUMBER());
				mDTO = null;
			}
		} catch (MongoException e) {
			log.info("에러" + e);
		} finally {

		}
		log.info("몽고 데이터 종료");
		return rList;
	}
	//------------------------------------------------센서 정보 가져오는 로직 => 2 API 버전----------------------------------------------------
	@Override
	public List<MongoDTO> getSensorDataMatch(List<MongoDTO> pList) throws Exception {
		log.info("getSensorDataMatch Start");
		Map<String, String> sensorMap = new HashMap<String, String>(); // 센서 1, 2, 3의 데이터를 받아올 맵 객체
		DBCollection collection = mongodb.getCollection("schemas");

		BasicDBObject query = null;
		BasicDBObject projection = null;
		MongoDTO mongDTO = null;

		List<MongoDTO> mongoData = new ArrayList<MongoDTO>();
		//---------------------------------데이터 key value 매핑---------------------------------------
		for (MongoDTO e : pList) {
			sensorMap.put(e.getSENSOR_NUMBER(), e.getDate());
			//log.info(sensorMap.get(e.getSENSOR_NUMBER()) + "Num : " + e.getSENSOR_NUMBER());
		}
		try {
			int sNum = 1;
			Iterator<MongoDTO> it = pList.iterator();
			while (it.hasNext()) {
				//log.info(it.next());
				query = new BasicDBObject();
				String str = sNum + ""; // 형변환
				query.put("date", sensorMap.get(str));
				//log.info("sensorMap.get((char) sNum) : " + sensorMap.get(str));
				query.put("SENSOR_NUMBER", sNum+"");
				//log.info("(char) sNum) : " + sNum);
				sNum++;

				projection = new BasicDBObject();

				projection.put("SENSOR_NUMBER", "$SENSOR_NUMBER");
				projection.put("date", "$date");
				projection.put("SENSOR_DATA", "$SENSOR_DATA");
				projection.put("_id", 0);

				Cursor cursor = collection.find(query, projection);
				
				while (cursor.hasNext()) {
					final DBObject current = cursor.next();
					mongDTO = new MongoDTO();
					
					mongDTO.setSENSOR_NUMBER(current.get("SENSOR_NUMBER").toString());
					mongDTO.setSENSOR_DATA(current.get("SENSOR_DATA").toString());
					
					log.info("mongDTO.getSENSOR_NUMBER : " + mongDTO.getSENSOR_NUMBER());
					log.info("mongDTO.getSENSOR_DATA: " + mongDTO.getSENSOR_DATA());
					log.info("topic : " + "hardwareCon" + "message : " + "1");
					mongoData.add(mongDTO);
					
					mongDTO = null;
				}
			}
		} catch (MongoException e) {
			log.info(e);
		}
		log.info("데이터 종료");
		return mongoData;
	}
}