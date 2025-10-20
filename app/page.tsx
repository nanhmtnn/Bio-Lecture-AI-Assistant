"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Moon, Sun, Loader2, BookOpen, Zap, Sparkles } from "lucide-react";

// Enhanced Markdown component with better styling
const MarkdownContent = ({ content }: { content: string }) => (
  <div className="prose prose-sm sm:prose-base max-w-none text-gray-900 dark:prose-invert dark:text-gray-100 prose-headings:font-semibold prose-p:leading-relaxed prose-ul:leading-relaxed prose-li:leading-relaxed prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
    <p className="text-gray-600 dark:text-gray-400 text-sm">Generating your lecture content...</p>
  </div>
);

export default function LectureGeneratorPage() {
  const [bigTopic, setBigTopic] = useState("");
  const [subtopics, setSubtopics] = useState("");
  const [mode, setMode] = useState("standard");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // useEffect(() => {
  //   const root = window.document.documentElement;
  //   if (theme === 'dark') {
  //     root.classList.add('dark');
  //     root.classList.remove('light');
  //   } else {
  //     root.classList.add('light');
  //     root.classList.remove('dark');
  //   }
  // }, [theme]);

  // const toggleTheme = () => {
  //   setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  // };

  // const handleSubmit = async () => {
  //   if (!bigTopic.trim()) return;
    
  //   setLoading(true);
  //   setResult(null);

  //   try {
  //     const res = await fetch("/api/generate-lecture", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ bigTopic, subtopics, outputMode: mode }),
  //     });

  //     const data = await res.json();
  //     setResult(data);
  //   } catch (error) {
  //     console.error("Failed to generate lecture:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // In your handleSubmit function:
const handleSubmit = async () => {
  if (!bigTopic.trim()) {
    alert("Please enter a topic");
    return;
  }

  setLoading(true);
  setResult(null);

  try {
    const res = await fetch("/api/generate-lecture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        bigTopic: bigTopic.trim(), 
        subtopics: subtopics.trim(), 
        outputMode: mode 
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    
    if (data.warning) {
      // Handle JSON parsing warnings
      console.warn("JSON parsing warning:", data);
      setResult(data);
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      setResult(data);
    }
  } catch (error: any) {
    console.error("Submission error:", error);
    setResult({ 
      warning: true,
      errorMessage: error.message || "Failed to generate lecture. Please try again.",
      suggestion: "Try using a simpler topic or check your internet connection."
    });
  } finally {
    setLoading(false);
  }
};

// Enhanced error display in your JSX:
{result?.warning && (
  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
    <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300 mb-3">
      <span className="text-lg">⚠️</span>
      <h3 className="font-semibold">Format Issue</h3>
    </div>
    
    {result.errorMessage ? (
      // API Error
      <div>
        <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-2">
          {result.errorMessage}
        </p>
        {result.suggestion && (
          <p className="text-yellow-500 dark:text-yellow-500 text-xs">
            {result.suggestion}
          </p>
        )}
      </div>
    ) : (
      // JSON Parsing Warning
      <div>
        <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-3">
          The response format was unexpected, but we retrieved some content.
        </p>
        {result.raw_output && (
          <details className="text-xs">
            <summary className="cursor-pointer text-yellow-600 dark:text-yellow-400 mb-2">
              View Raw Response
            </summary>
            <pre className="bg-white dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-yellow-700 dark:text-yellow-300">
              {typeof result.raw_output === 'string' 
                ? result.raw_output 
                : JSON.stringify(result.raw_output, null, 2)
              }
            </pre>
          </details>
        )}
      </div>
    )}
    
    <button
      onClick={handleSubmit}
      className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
    >
      Try Again
    </button>
  </div>
)}



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30 transition-colors duration-300">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BioLecturer
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Biology Education</p>
              </div>
            </div>
            
            {/* <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Enhanced Input Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered Learning</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Generate Comprehensive Biology Lectures
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create beginner-friendly biology lectures and study guides with AI assistance
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <div className="grid gap-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Main Biology Topic *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., DNA Replication, Cell Membrane, Protein Synthesis..."
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={bigTopic}
                  onChange={(e) => setBigTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Subtopics (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Comma separated: Transcription, Translation, Regulation..."
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={subtopics}
                  onChange={(e) => setSubtopics(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Detail Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "concise", label: "Concise", desc: "Quick overview" },
                    { value: "standard", label: "Standard", desc: "Balanced detail" },
                    { value: "expanded", label: "Expanded", desc: "Comprehensive" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMode(option.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        mode === option.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !bigTopic.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating Lecture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Lecture</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Enhanced Output Section */}
        {loading && <LoadingSpinner />}

        {result && !result.warning && (
          <section className="space-y-8 animate-fade-in">
            {/* Title & Intro */}
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{result.title}</h2>
                  <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                    <MarkdownContent content={result.introduction} />
                  </div>
                </div>
              </div>
            </article>

            {/* Lectures */}
            {result.lectures?.map((lec: any, idx: number) => (
              <article
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Lecture Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{lec.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="inline-flex items-center space-x-1 text-blue-100">
                          <span>⏱</span>
                          <span className="text-sm">{lec.estimated_study_time}</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 text-blue-100">
                          <span>🎯</span>
                          <span className="text-sm">{lec.audience_level}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lecture Content */}
                <div className="p-8 space-y-6">
                  {/* Definition & Purpose */}
                  <section>
                    <h4 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Definition & Purpose</span>
                    </h4>
                    <MarkdownContent content={lec.definition_and_purpose} />
                  </section>

                  {/* Lecture Content */}
                  <section>
                    <h4 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Lecture Content</span>
                    </h4>
                    <MarkdownContent content={lec.lecture_content} />
                  </section>

                  {/* Learning Objectives */}
                  <section className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Learning Objectives</span>
                      </h4>
                      <ul className="space-y-3">
                        {lec.learning_objectives?.map((obj: string, i: number) => (
                          <li key={i} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Terms */}
                    {lec.key_terms && lec.key_terms.length > 0 && (
                      <div>
                        <h4 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>Key Terms</span>
                        </h4>
                        <div className="space-y-2">
                          {lec.key_terms?.map((t: any, i: number) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.term}</div>
                              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t.definition}</div>
                              <div className="text-gray-500 dark:text-gray-500 text-xs mt-1 italic">{t.role}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Expandable Sections */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Visual Aids */}
                    {lec.visual_aid_suggestions && lec.visual_aid_suggestions.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                        <h4 className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-white mb-4">
                          <span className="text-blue-600">🖼️</span>
                          <span>Visual Aids</span>
                        </h4>
                        <div className="space-y-4">
                          {lec.visual_aid_suggestions?.map((vis: any, i: number) => (
                            <div key={i} className="border-l-4 border-blue-500 pl-4">
                              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{vis.description}</p>
                              {vis.ascii_diagram && (
                                <pre className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto text-xs text-gray-800 dark:text-gray-200 mt-2">
                                  {vis.ascii_diagram}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Molecular Structures */}
                    {lec.molecular_structures_and_processes && (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                        <h4 className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-white mb-4">
                          <span className="text-green-600">🧪</span>
                          <span>Molecular Structures</span>
                        </h4>
                        <MarkdownContent content={lec.molecular_structures_and_processes} />
                      </div>
                    )}
                  </div>

                  {/* Additional Sections Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Examples */}
                    {lec.examples_and_applications && lec.examples_and_applications.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5">
                        <h4 className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-white mb-3">
                          <span className="text-green-600">🔬</span>
                          <span>Examples</span>
                        </h4>
                        <ul className="space-y-2">
                          {lec.examples_and_applications?.map((ex: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                              <MarkdownContent content={ex} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Misconceptions */}
                    {lec.common_misconceptions && lec.common_misconceptions.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5">
                        <h4 className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-white mb-3">
                          <span className="text-red-600">❌</span>
                          <span>Misconceptions</span>
                        </h4>
                        <ul className="space-y-2">
                          {lec.common_misconceptions?.map((m: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                              <MarkdownContent content={m} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Activities */}
                    {lec.student_activities && lec.student_activities.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5">
                        <h4 className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-white mb-3">
                          <span className="text-yellow-600">📝</span>
                          <span>Activities</span>
                        </h4>
                        <ul className="space-y-2">
                          {lec.student_activities?.map((a: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                              <MarkdownContent content={a} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Quiz Section */}
                  {lec.quick_check_quiz?.questions && lec.quick_check_quiz.questions.length > 0 && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                      <h4 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <span className="text-purple-600">🧠</span>
                        <span>Quick Check Quiz</span>
                      </h4>
                      <div className="space-y-6">
                        {lec.quick_check_quiz.questions?.map((q: any, i: number) => (
                          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                            <p className="font-semibold text-gray-900 dark:text-white mb-3">{q.question}</p>
                            <ul className="space-y-2 mb-4">
                              {q.choices.map((c: string, j: number) => (
                                <li key={j} className="flex items-center space-x-3">
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"></div>
                                  <span className="text-gray-700 dark:text-gray-300 text-sm">{c}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                              <p className="text-green-700 dark:text-green-300 font-semibold text-sm">✅ {q.answer}</p>
                              <p className="text-green-600 dark:text-green-400 text-xs mt-1">{q.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {/* Final Summary */}
            {result.final_integrated_summary && (
              <section className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <span>🧾</span>
                  <span>Final Integrated Summary</span>
                </h3>
                <ul className="space-y-3">
                  {result.final_integrated_summary.summary_points.map((point: string, i: number) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-white rounded-full mt-2"></div>
                      <span className="text-green-50 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Terminology */}
            {result.terminology_and_concepts && (
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-3">
                  <span className="text-blue-600">📖</span>
                  <span>Terminology & Concepts</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.terminology_and_concepts.map((t: any, i: number) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="font-bold text-gray-900 dark:text-white text-sm mb-2">{t.term}</div>
                      <div className="text-gray-700 dark:text-gray-300 text-sm mb-2">{t.definition}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs mb-2">{t.function_or_role}</div>
                      {t.visual_analogy && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-2">
                          <div className="text-blue-700 dark:text-blue-300 text-xs font-semibold">Analogy:</div>
                          <div className="text-blue-600 dark:text-blue-400 text-xs mt-1">{t.visual_analogy}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </section>
        )}

        {/* {result?.warning && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-700 dark:text-red-300 font-semibold">⚠️ The model returned invalid JSON</p>
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">Please try generating the lecture again.</p>
          </div>
        )} */}
      </main>
    </div>
  );
}