import { ArrowRight, Clock, Sparkles } from "lucide-react";
import type { CustomerEditorialViewProps } from "./types";
import CustomerArticleDetailView from "./CustomerArticleDetailView"; // Import detail baru

export default function CustomerEditorialView({
  articles,
  activeArticle,
  onSelectArticle,
  onClearArticle,
  onOpenShop,
}: CustomerEditorialViewProps) {
  
  // Jika ada artikel yang dipilih, alihkan tampilan ke detail artikel
  if (activeArticle) {
    return (
      <CustomerArticleDetailView
        article={activeArticle}
        onBackToList={onClearArticle}
        onOpenShop={onOpenShop}
      />
    );
  }

  return (
    <div className="space-y-12" id="customer-editorial-view">
      
      {/* Header Kolom Majalah */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[9px] font-mono border border-stone-200 text-stone-600 bg-white px-3.5 py-1.5 uppercase tracking-widest font-bold">
          EDUCATIONAL & INSIGHTS
        </span>
        <h2 className="text-2xl font-serif font-light text-black tracking-[0.1em] uppercase pt-2">
          Vera Beauty & Fashion Articles
        </h2>
      </div>

      {/* Grid List Artikel (Gaya Desain Proyek Monokrom) */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        id="articles-grid"
      >
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-none border border-stone-200 p-6 md:p-8 flex flex-col justify-between transition-all hover:border-stone-400 shadow-none"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="bg-stone-100 text-stone-800 text-[8px] uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded-none">
                  {article.category}
                </span>
                <span className="text-[9px] text-stone-400 flex items-center gap-1 font-mono uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" /> {article.readTime}
                </span>
              </div>

              {/* Placeholder Thumbnail Mini */}
              <div className="w-full h-92 bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-300 font-mono text-[8px] uppercase tracking-widest rounded-none">
                {article.image ? (
                      <img 
                        src={article.image}
                        className="w-full h-full object-fill mix-blend-multiply" 
                      />
                    ) : (
                      <span className="text-[9px] text-center px-1 break-words">
                        {article.title}
                      </span>
                    )}
              </div>

              <h3 className="text-lg font-serif font-medium text-stone-900 uppercase tracking-wide line-clamp-2 leading-snug">
                {article.title}
              </h3>

              <p className="text-stone-500 text-xs leading-relaxed line-clamp-3 font-sans font-light normal-case">
                {article.excerpt}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
              <span className="text-stone-400 font-normal">
                By {article.author}
              </span>
              <button
                onClick={() => onSelectArticle(article)}
                className="inline-flex items-center gap-1.5 font-bold text-stone-900 hover:text-stone-500 group cursor-pointer transition-colors"
              >
                <span>Read More</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}