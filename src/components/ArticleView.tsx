import React from "react";
import { BookOpen, Calendar, User, ArrowLeft, Search } from "lucide-react";
import { Article } from "../types";

interface ArticleViewProps {
  articles: Article[];
  selectedArticleId: string | null;
  onSelectArticle: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function ArticleView({
  articles,
  selectedArticleId,
  onSelectArticle,
  searchQuery,
  onSearchChange
}: ArticleViewProps) {
  const currentArticle = articles.find(a => a.id === selectedArticleId);

  // Return filtered list if no article chosen
  const filteredArticles = articles.filter(art => {
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.excerpt.toLowerCase().includes(q)
    );
  });

  // Pick related articles (excluding the active reading article)
  const relatedArticles = currentArticle 
    ? articles.filter(a => a.id !== currentArticle.id).slice(0, 2)
    : [];

  if (currentArticle) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in font-sans">
        {/* Back navigation */}
        <button
          onClick={() => onSelectArticle(null)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#141414] hover:opacity-60 transition-opacity mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Editorials
        </button>

        {/* Article header metadata info cards */}
        <div className="space-y-4 text-center pb-8 border-b border-[#141414]/10">
          <span className="text-[10px] uppercase tracking-[0.4em] text-amber-800 bg-amber-50 px-3 py-1 font-semibold rounded">
            {currentArticle.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight font-serif text-[#141414] max-w-3xl mx-auto leading-tight">
            {currentArticle.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-500 font-sans">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> By {currentArticle.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {currentArticle.date}
            </span>
            <span className="flex items-center gap-1 font-mono font-bold">
              {currentArticle.readTime}
            </span>
          </div>
        </div>

        {/* High Resolution Article Cover Banner */}
        <div className="my-8 aspect-[16/9] bg-stone-100 overflow-hidden border">
          <img
            src={currentArticle.thumbnail}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content Formatted elegantly for readability */}
        <article className="prose prose-stone max-w-none text-[#141414] leading-relaxed font-sans font-light">
          {currentArticle.content.split("\n\n").map((para, idx) => {
            if (para.startsWith("###")) {
              return (
                <h3 key={idx} className="text-xl font-serif tracking-tight text-[#141414] mt-8 mb-4 font-semibold">
                  {para.replace("###", "").trim()}
                </h3>
              );
            }
            if (para.startsWith("1.") || para.startsWith("-")) {
              return (
                <div key={idx} className="pl-4 my-2 font-light space-y-1">
                  {para.split("\n").map((line, lIdx) => (
                    <div key={lIdx} className="text-sm text-slate-700">
                      {line}
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <p key={idx} className="text-sm md:text-base text-slate-700 font-normal my-4 leading-7">
                {para}
              </p>
            );
          })}
        </article>

        {/* PRD MANDATE: Related Articles / Blogs grid */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#141414]/10 space-y-6">
            <h3 className="text-xl font-serif tracking-tight font-light text-[#141414]">Related Editorial Content</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map(art => (
                <div 
                  key={art.id}
                  onClick={() => onSelectArticle(art.id)}
                  className="bg-white p-4 border border-[#141414]/5 hover:border-black/20 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img src={art.thumbnail} className="w-16 h-16 object-cover bg-slate-100" alt="" />
                    <div>
                      <span className="text-[9px] text-[#141414]/40 uppercase tracking-widest block font-semibold">{art.category}</span>
                      <h4 className="font-light text-sm text-[#141414] tracking-tight mt-1 line-clamp-2">{art.title}</h4>
                    </div>
                  </div>
                  <button className="text-[9px] uppercase tracking-wider text-[#141414] border-b border-black w-fit pb-0.5 mt-4 self-end">
                    Read article
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-fade-in font-sans">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#141414]/40">Vera Editorial Feed</span>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight font-serif text-[#141414]">Quiet Elegance & Beauty</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">Explore clinical skincare routines, holistic minimalist fashion guidance, and Timeless lifestyle guides curated by our editorial committee.</p>
      </div>

      {/* SEARCH AND CATEGORY FILTER */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-b border-[#141414]/5 pb-6">
        <div className="flex gap-4 text-xs tracking-widest uppercase">
          <button 
            onClick={() => onSearchChange("")}
            className={`font-semibold pb-1 cursor-pointer ${searchQuery === "" ? "border-b border-black text-[#141414]" : "text-slate-400 hover:text-black"}`}
          >
            All Articles
          </button>
          <button 
            onClick={() => onSearchChange("Fashion")}
            className={`font-semibold pb-1 cursor-pointer ${searchQuery === "Fashion" ? "border-b border-black text-[#141414]" : "text-slate-400 hover:text-black"}`}
          >
            Fashion & Style
          </button>
          <button 
            onClick={() => onSearchChange("Skincare")}
            className={`font-semibold pb-1 cursor-pointer ${searchQuery === "Skincare" ? "border-b border-black text-[#141414]" : "text-slate-400 hover:text-black"}`}
          >
            Skincare & Beauty
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-black/10 rounded-full outline-none focus:border-black bg-white"
          />
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(art => (
          <div
            key={art.id}
            onClick={() => onSelectArticle(art.id)}
            className="group flex flex-col bg-white border border-[#141414]/5 hover:border-black/10 cursor-pointer overflow-hidden p-3 transition-all"
          >
            <div className="aspect-[16/10] bg-stone-100 overflow-hidden mb-4 relative">
              <img
                src={art.thumbnail}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-[#F9F8F6] text-[#141414] text-[8px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5">
                {art.category}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">{art.date} &bull; {art.readTime}</span>
                <h3 className="font-light text-lg md:text-xl text-[#141414] tracking-tight leading-snug group-hover:opacity-85 transition-opacity">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-black/5">
                <span className="text-xs italic font-serif text-slate-500">by {art.author}</span>
                <button className="text-[9px] uppercase tracking-[0.2em] @apply border-b border-black text-[#141414]/80 pb-0.5 group-hover:text-black group-hover:border-black font-semibold">
                  Read Article
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredArticles.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto stroke-zinc-300 mb-2" />
            No articles matches details or category specs.
          </div>
        )}
      </div>
    </div>
  );
}
