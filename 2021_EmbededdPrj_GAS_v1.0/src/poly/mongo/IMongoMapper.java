package poly.mongo;

import poly.dto.MongoDTO;

import java.util.List;

public interface IMongoMapper {

    List<MongoDTO> getCollectionsData(String colNm) throws Exception; // 컬렉션에서 데이터 가죠오기

	List<MongoDTO> getDailySensorData() throws Exception; // 몽고에서 오늘 날짜에 해당하는 데이터 가져오기

	List<MongoDTO> getSensorDataMatch(List<MongoDTO> pList) throws Exception; // 최신 센서 정보를 토대로 센서 데이터 가져오기
}
