package poly.mongo.impl;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import org.apache.log4j.Logger;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.DBCollection;
import com.mongodb.MongoException;

import poly.dto.MongoDTO;
import poly.mongo.IMongoMapper;

/*
 * 몽고 도큐먼트 테스트를 위한 테스트 클래스 () 백업용이기도 함
 * create by CHOI
 * 
 * */

public class MongoTestClass implements IMongoMapper{
    @Autowired
    private MongoTemplate mongodb; 
    
    private Logger log = Logger.getLogger(this.getClass()); // 로그 찍기 위한 메소드
	// 센서 정보 가져오는 로직 => 3 API 버전으로 도큐먼트 방식임
	@Override
	public List<MongoDTO> getSensorDataMatch(List<MongoDTO> pList) throws Exception {
		log.info("getSensorDataMatch Start");
		Map<String, String> sensorMap = new HashMap<String, String>(); // 센서 1, 2, 3의 데이터를 받아올 맵 객체
		
		for(MongoDTO e : pList) {
			sensorMap.put(e.getSENSOR_NUMBER(), e.getDate());
		}
		log.info("#########Check##########");

		Document query = new Document();
		log.info("#########Check##########");
			try {
				log.info("#########Check##########");
				DBCollection collection = mongodb.getCollection("schemas");
				int sNum = 1;
				
				Iterator<MongoDTO> it = pList.iterator(); 
				while(it.hasNext()) {
			        query.append("date", sensorMap.get("1"));
			        query.append("SENSOR_NUMBER", sNum);
			        sNum++;
			        
			        Document projection = new Document();
			
			        projection.append("SENSOR_NUMBER", "$SENSOR_NUMBER");
			        projection.append("date", "$date");
			        projection.append("SENSOR_DATA", "$SENSOR_DATA");
			        projection.append("_id", 0);
			        
			        Consumer<Document> processBlock = new Consumer<Document>() {
			            @Override
			            public void accept(Document document) {
			                System.out.println(document);
			            }
			        };
			        collection.findOne(query);//.projection(projection).forEach(processBlock);
				}
	        
	    } catch (MongoException e) {
	       log.info(e);
	    }
		log.info("몽고 종료");
		//############################################################################################
		// 테스트 영역 삭제 해도 댐
		/*
		 * while(cursor.hasNext()) { final DBObject current = cursor.next();
		 * log.info(current.get("SENSOR_NUMBER")); log.info(current.get("SENSOR_DATA"));
		 * 
		 * } cursor = null; query = null; projection = null;
		 */		
		//############################################################################################
		return null;
	}

	@Override
	public List<MongoDTO> getCollectionsData(String colNm) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<MongoDTO> getDailySensorData() throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
}
