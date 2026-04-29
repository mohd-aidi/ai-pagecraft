import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Code, 
  Eye, 
  Download, 
  Copy, 
  ChevronRight, 
  Loader2, 
  RefreshCcw,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { generatePage, GeneratedPage } from "./services/gemini";
import { TEMPLATES, Template } from "./templates";

type ViewMode = "preview" | "code";
type DeviceType = "desktop" | "tablet" | "mobile";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [generatedResult, setGeneratedResult] = useState<GeneratedPage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generatePage(finalPrompt);
      setGeneratedResult(result);
      setViewMode("preview");
    } catch (err) {
      setError("Failed to generate page. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedResult) return;
    const blob = new Blob([generatedResult.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectTemplate = (template: Template) => {
    setPrompt(template.prompt);
    handleGenerate(template.prompt);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile": return "max-w-[375px]";
      case "tablet": return "max-w-[768px]";
      default: return "max-w-full";
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Ambient Background Decor */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[180px] rotate-45 pointer-events-none"></div>

      {/* Header */}
      <header className="h-20 border-b border-white/10 bg-white/[0.02] backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight uppercase">PageCraft</h1>
            <div className="text-[10px] text-white/30 tracking-[0.2em] font-bold uppercase">AI Engine v2</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {generatedResult && (
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode("preview")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === "preview" 
                    ? "bg-white text-black shadow-lg" 
                    : "text-white/40 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye size={14} />
                  Preview
                </div>
              </button>
              <button
                onClick={() => setViewMode("code")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === "code" 
                    ? "bg-white text-black shadow-lg" 
                    : "text-white/40 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code size={14} />
                  Code
                </div>
              </button>
            </div>
          )}
          
          <div className="h-8 w-[1px] bg-white/10" />
          
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!generatedResult}
              className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 rounded-xl transition-all relative"
              title="Copy Code"
            >
              {copied ? <CheckCircle2 size={20} className="text-emerald-400" /> : <Copy size={20} />}
            </button>
            <button
              onClick={handleDownload}
              disabled={!generatedResult}
              className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 rounded-xl transition-all"
              title="Download HTML"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100vh-80px)] relative z-10">
        {/* Sidebar Controls */}
        <aside className="w-[380px] border-r border-white/10 bg-white/[0.01] backdrop-blur-2xl overflow-y-auto p-8 flex flex-col gap-10">
          <div>
            <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6">New Prototype</h2>
            <div className="space-y-6">
              <div className="relative group">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the aesthetic and flow..."
                  className="w-full min-h-[160px] p-5 text-sm bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:bg-white/[0.08] transition-all outline-none resize-none placeholder:text-white/20"
                />
                <div className="absolute bottom-4 right-4 text-[10px] text-white/10 uppercase tracking-widest font-bold">AI Input</div>
              </div>
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/10 disabled:text-white/20 font-bold py-4 rounded-xl transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Sparkles size={18} />
                )}
                {isGenerating ? "Crafting..." : "Generate Magic"}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6">Design Blueprints</h2>
            <div className="grid gap-3">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => selectTemplate(template)}
                  disabled={isGenerating}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-left group"
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <template.icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{template.name}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold mt-1">{template.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Preview Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* View Toolbar */}
          {generatedResult && viewMode === "preview" && (
            <div className="h-14 bg-white/[0.01] border-b border-white/5 px-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                  <button onClick={() => setDevice("desktop")} className={`p-2 rounded-lg transition-all ${device === "desktop" ? "bg-white text-black shadow-md" : "text-white/20 hover:text-white"}`}><Monitor size={16} /></button>
                  <button onClick={() => setDevice("tablet")} className={`p-2 rounded-lg transition-all ${device === "tablet" ? "bg-white text-black shadow-md" : "text-white/20 hover:text-white"}`}><Tablet size={16} /></button>
                  <button onClick={() => setDevice("mobile")} className={`p-2 rounded-lg transition-all ${device === "mobile" ? "bg-white text-black shadow-md" : "text-white/20 hover:text-white"}`}><Smartphone size={16} /></button>
                </div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                  {device} Viewport
                </div>
              </div>
              <div className="text-[11px] text-white/40 font-medium max-w-sm truncate italic">
                “{generatedResult.explanation}”
              </div>
            </div>
          )}

          <div className="flex-1 p-10 overflow-y-auto flex flex-col items-center">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center gap-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-light tracking-tight text-white/80">Synthesizing design components...</h3>
                    <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em] mt-2">Architecture initialization in progress</p>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/5 backdrop-blur-2xl border border-red-500/20 p-8 rounded-[32px] flex items-center gap-6 max-w-md"
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                    <AlertCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400">Generation Failed</h3>
                    <p className="text-sm text-white/40 mb-5 leading-relaxed">{error}</p>
                    <button 
                      onClick={() => handleGenerate()}
                      className="px-6 py-2.5 bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all"
                    >
                      Retry Connection
                    </button>
                  </div>
                </motion.div>
              ) : !generatedResult ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl px-12"
                >
                  <div className="w-32 h-32 bg-white/[0.03] backdrop-blur-3xl rounded-[40px] shadow-2xl flex items-center justify-center text-indigo-400 mb-10 border border-white/10 relative group">
                    <Sparkles size={64} className="group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl -z-10 rounded-full opacity-50"></div>
                  </div>
                  <h2 className="text-5xl font-light tracking-tight mb-6">
                    A new standard for <span className="text-indigo-300 italic font-medium">digital</span> identity.
                  </h2>
                  <p className="text-white/40 mb-12 leading-relaxed text-lg font-light max-w-lg mx-auto">
                    Experience a seamless, encrypted, and beautifully minimalist way to generate your next web interface.
                  </p>
                  <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                    <div className="p-5 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 flex items-center gap-4 transition-all hover:bg-white/[0.05] hover:border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20"><CheckCircle2 size={18} /></div>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tailwind v4</span>
                    </div>
                    <div className="p-5 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 flex items-center gap-4 transition-all hover:bg-white/[0.05] hover:border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20"><CheckCircle2 size={18} /></div>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Lucide Core</span>
                    </div>
                  </div>
                </motion.div>
              ) : viewMode === "preview" ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`w-full ${getDeviceWidth()} h-full transition-all duration-700 shadow-[0_32px_128px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden border border-white/10 bg-white relative group`}
                >
                  <iframe
                    ref={iframeRef}
                    srcDoc={generatedResult.html}
                    className="w-full h-full border-none"
                    title="Generated Page"
                  />
                  {/* Glass decorative overlay for the frame in desktop view */}
                  {device === "desktop" && <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-[40px]"></div>}
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full h-full bg-[#0D0D0E] rounded-[32px] overflow-hidden shadow-2xl flex flex-col font-mono text-sm border border-white/10"
                >
                  <div className="h-14 bg-white/[0.03] px-6 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                      </div>
                      <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest ml-4">output/index.html</span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="text-white/40 hover:text-white transition-all p-2 rounded-lg hover:bg-white/5"
                    >
                      {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-8 text-indigo-100/70 selection:bg-indigo-500/40">
                    <pre><code className="block leading-relaxed">{generatedResult.html}</code></pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer Details */}
      <footer className="relative z-10 w-full px-12 py-6 flex justify-between text-[9px] uppercase tracking-[0.3em] text-white/10 font-bold border-t border-white/5">
        <span>© 2026 PageCraft Systems</span>
        <div className="flex gap-8">
          <span className="text-emerald-500/40 tracking-normal font-sans normal-case italic flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            System Status: Nominal
          </span>
          <a href="#" className="hover:text-white/30 transition-colors">Infrastructure</a>
          <a href="#" className="hover:text-white/30 transition-colors">API documentation</a>
        </div>
      </footer>
    </div>
  );
}

