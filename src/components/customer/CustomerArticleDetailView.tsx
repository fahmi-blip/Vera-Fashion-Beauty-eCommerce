import { ArrowLeft, Clock, Sparkles, ShoppingBag } from "lucide-react";
import type { Article } from "../../types";

interface CustomerArticleDetailViewProps {
  article: Article;
  onBackToList: () => void;
  onOpenShop: () => void;
}

export default function CustomerArticleDetailView({
  article,
  onBackToList,
  onOpenShop,
}: CustomerArticleDetailViewProps) {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8 font-sans" id="article-detail-container">
      
      {/* Tombol Kembali Minimalis */}
      <button
        onClick={onBackToList}
        className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-stone-500 hover:text-black border border-stone-200 hover:border-black px-4 py-2.5 transition-all bg-white rounded-none cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Index Artikel</span>
      </button>

      {/* Konten Utama Artikel */}
      <article className="bg-white border border-stone-200 p-6 md:p-12 rounded-none space-y-6 shadow-none">
        
        {/* Kategori & Tags (Gaya Monokrom) */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="bg-black text-white text-[9px] tracking-widest uppercase font-mono px-3 py-1 rounded-none font-bold">
            {article.category}
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="border border-stone-200 text-stone-600 font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-none"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Judul Serif Besar */}
        <h1 className="text-2xl md:text-4xl font-serif font-normal tracking-tight text-stone-900 leading-tight uppercase">
          {article.title}
        </h1>

        {/* Metadata Artikel */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-mono text-stone-400 uppercase tracking-wider border-y border-stone-100 py-3.5">
          <span>
            Writer: <strong className="text-stone-800 font-bold">{article.author}</strong>
          </span>
          <span className="text-stone-200 hidden sm:inline">|</span>
          <span>Released: {article.date}</span>
          <span className="text-stone-200 hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
        </div>

        {/* Placeholder Gambar Sesuai Gaya Ilustrasi Proyek Anda */}
        <div className="w-full bg-stone-50 border border-stone-200 py-20 flex flex-col items-center justify-center text-center px-4 font-mono">
          <Sparkles className="w-5 h-5 text-stone-300 mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-stone-400">
            [ VERA EDITORIAL VISUAL ARCHIVE: {article.image.toUpperCase()} ]
          </span>
        </div>

        {/* Isi Artikel Body */}
        <div
          className="text-stone-800 text-sm md:text-base leading-relaxed space-y-6 font-serif font-light pt-4 border-b border-stone-100 pb-8 text-justify"
          style={{ whiteSpace: "pre-line" }}
        >
          {article.content}
        </div>

        {/* Footer Rekomendasi Belanja */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-mono">
          <div className="space-y-1">
            <h5 className="font-bold text-stone-900 text-[10px] uppercase tracking-widest">
              Rekomendasi Terkait Artikel Ini:
            </h5>
            <p className="text-[11px] text-stone-500 max-w-md normal-case font-sans">
              Lengkapi ritual kecantikan dan gaya busana Anda dengan koleksi terkurasi kami untuk mengaplikasikan{" "}
              <span className="italic font-serif text-stone-800">
                {article.category === "beauty" ? "active skin framework protection" : "minimalistic luxury capsule look"}
              </span>.
            </p>
          </div>
          <button
            onClick={onOpenShop}
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-4 rounded-none transition-all self-start sm:self-auto cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buka Katalog Toko</span>
          </button>
        </div>

      </article>
    </div>
  );
}