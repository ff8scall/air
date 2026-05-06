export interface RegionInfo {
  slug: string;
  name: string; // Sido or City name in Korean
  stationName: string; // Representative station
  fullName: string; // e.g. "서울특별시"
}

export const SIDO_REGIONS: RegionInfo[] = [
  { slug: "seoul", name: "서울", stationName: "종로구", fullName: "서울특별시" },
  { slug: "busan", name: "부산", stationName: "광복동", fullName: "부산광역시" },
  { slug: "daegu", name: "대구", stationName: "수창동", fullName: "대구광역시" },
  { slug: "incheon", name: "인천", stationName: "신흥", fullName: "인천광역시" },
  { slug: "gwangju", name: "광주", stationName: "농성동", fullName: "광주광역시" },
  { slug: "daejeon", name: "대전", stationName: "구성동", fullName: "대전광역시" },
  { slug: "ulsan", name: "울산", stationName: "신정동", fullName: "울산광역시" },
  { slug: "sejong", name: "세종", stationName: "세종", fullName: "세종특별자치시" },
  { slug: "gyeonggi", name: "경기", stationName: "수원", fullName: "경기도" },
  { slug: "gangwon", name: "강원", stationName: "중앙로", fullName: "강원도" },
  { slug: "chungbuk", name: "충북", stationName: "사직동", fullName: "충청북도" },
  { slug: "chungnam", name: "충남", stationName: "신방동", fullName: "충청남도" },
  { slug: "jeonbuk", name: "전북", stationName: "삼천동", fullName: "전라북도" },
  { slug: "jeonnam", name: "전남", stationName: "호남동", fullName: "전라남도" },
  { slug: "gyeongbuk", name: "경북", stationName: "4공단", fullName: "경상북도" },
  { slug: "gyeongnam", name: "경남", stationName: "상남동", fullName: "경상남도" },
  { slug: "jeju", name: "제주", stationName: "이도동", fullName: "제주특별자치도" },
];

export const MAJOR_CITIES: RegionInfo[] = [
  { slug: "suwon", name: "수원", stationName: "수원", fullName: "경기도 수원시" },
  { slug: "yongin", name: "용인", stationName: "용인", fullName: "경기도 용인시" },
  { slug: "goyang", name: "고양", stationName: "고양", fullName: "경기도 고양시" },
  { slug: "seongnam", name: "성남", stationName: "성남", fullName: "경기도 성남시" },
  { slug: "songpa", name: "송파", stationName: "송파구", fullName: "서울특별시 송파구" },
  { slug: "gangnam", name: "강남", stationName: "강남구", fullName: "서울특별시 강남구" },
  { slug: "gangdong", name: "강동", stationName: "강동구", fullName: "서울특별시 강동구" },
];

export const ALL_REGIONS = [...SIDO_REGIONS, ...MAJOR_CITIES];

export function resolveRegion(slug: string): RegionInfo | null {
  const decoded = decodeURIComponent(slug).toLowerCase();
  return ALL_REGIONS.find(r => r.slug === decoded || r.name === decoded) || null;
}
