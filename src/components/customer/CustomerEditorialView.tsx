import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import type { CustomerEditorialViewProps } from "./types";

export default function CustomerEditorialView({
  articles,
  activeArticle,
  onSelectArticle,
  onClearArticle,
  onOpenShop,
}: CustomerEditorialViewProps) {
  return (
    <div className="space-y-8" id="customer-editorial-view">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase font-mono tracking-widest text-slate-950 font-bold">
          EDUCATIONAL & INSIGHTS
        </span>
        <h2 className="text-3xl font-serif tracking-tight text-slate-900">
          Vera Beauty & Style Column
        </h2>
        <p className="text-slate-500 text-sm">
          Get scientifically backed skincare advice and elegant sustainable
          capsule secrets carefully curated for elite lifestyles.
        </p>
      </div>

      {activeArticle ? (
        <div
          className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6"
          id="article-reader"
        >
          <button
            onClick={onClearArticle}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Artikel Lainnya</span>
          </button>

          <div className="flex flex-wrap gap-2">
            <span className="bg-indigo-50 text-slate-950 text-[10px] tracking-widest uppercase font-mono px-3 py-1 rounded-full font-bold">
              {activeArticle.category}
            </span>
            {activeArticle.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-4xl font-serif tracking-tight text-slate-950 font-semibold">
            {activeArticle.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span>
              Oleh:{" "}
              <strong className="text-slate-600">{activeArticle.author}</strong>
            </span>
            <span>•</span>
            <span>Published {activeArticle.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {activeArticle.readTime}
            </span>
          </div>

          <div className="w-full h-1 bg-gradient-to-r from-indigo-200 via-sky-100 to-indigo-200 rounded" />

          <div
            className="text-slate-800 text-sm md:text-base leading-relaxed space-y-5 font-light"
            style={{ whiteSpace: "pre-line" }}
          >
            {activeArticle.content}
          </div>

          <div className="pt-8 border-t border-slate-100 mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h5 className="font-semibold text-slate-800 text-xs font-mono uppercase tracking-wider mb-1">
                Related Products for this Routine:
              </h5>
              <p className="text-xs text-slate-500">
                Explore our products to implement{" "}
                {activeArticle.category === "beauty"
                  ? "the active skin protection"
                  : "the minimal capsule look"}
                .
              </p>
            </div>
            <button
              onClick={onOpenShop}
              className="bg-slate-400 hover:bg-slate-600 text-white text-xs font-semibold px-4.5 py-2.5 rounded-full transition-all self-start md:self-auto uppercase tracking-wider shadow-sm"
            >
              Buka Toko
            </button>
          </div>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          id="articles-grid"
        >
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-50 text-slate-950 text-[9px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" /> {article.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-serif text-slate-950 font-semibold line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-light">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-sans">
                <span className="text-xs font-mono text-slate-400">
                  By {article.author}
                </span>
                <button
                  onClick={() => onSelectArticle(article)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-950 hover:text-slate-600 group cursor-pointer"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
