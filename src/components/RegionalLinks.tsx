import Link from "next/link";
import { SIDO_REGIONS, MAJOR_CITIES } from "@/lib/regions";

export default function RegionalLinks() {
  return (
    <div className="mt-8 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
        지역별 환기 지수 바로가기
      </h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 mb-2">주요 시도</p>
          <div className="flex flex-wrap gap-2">
            {SIDO_REGIONS.map((r) => (
              <Link
                key={r.slug}
                href={`/${r.slug}`}
                className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-full transition-colors border border-gray-100 dark:border-gray-700"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 mb-2">주요 도시</p>
          <div className="flex flex-wrap gap-2">
            {MAJOR_CITIES.map((r) => (
              <Link
                key={r.slug}
                href={`/${r.slug}`}
                className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-full transition-colors border border-gray-100 dark:border-gray-700"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
        <p className="text-[10px] text-gray-400 dark:text-gray-600 leading-relaxed">
          각 지역명을 클릭하면 해당 지역의 실시간 미세먼지 농도와 최적의 환기 시간을 확인할 수 있습니다. 
          에어코리아 실시간 데이터를 바탕으로 산출된 환기 지수와 빨래 지수를 제공합니다.
        </p>
      </div>
    </div>
  );
}
