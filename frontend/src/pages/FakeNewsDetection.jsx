import { useLayoutEffect, useRef, useState } from "react";
import {
  Newspaper,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  FileText,
} from "lucide-react";
import gsap from "gsap";

import PageHeader from "../components/PageHeader";
import ModelNavigation from "../components/ModelNavigation";
import LoadingButton from "../components/LoadingButton";
import ErrorAlert from "../components/ErrorAlert";

import { predictFakeNews } from "../lib/api";

const initialForm = {
  news_text: "",
};

export default function FakeNewsDetection() {
  const ref = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fake-news-card",
        {
          y: 28,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function submit(e) {
    e.preventDefault();

    if (!form.news_text.trim()) {
      setError("Please enter a news article or news text.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predictFakeNews(form.news_text);

      setResult(data);
    } catch (err) {
      setError(err.message || "Fake news detection failed.");
    } finally {
      setLoading(false);
    }
  }

  const isFake = result?.model_response === "FAKE";

  return (
    <main
      ref={ref}
      className="page-enter mx-auto max-w-6xl px-5 py-12"
    >
      {/* Page Header */}

      <PageHeader
        eyebrow="Model 05 / NLP Classification"
        title="Fake News Detection"
        description="Analyze a news article using TF-IDF text features and a machine-learning classification model to determine whether the news is real or fake."
      />

      {/* Model Navigation */}

      <ModelNavigation />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        {/* Detection Form */}

        <form
          onSubmit={submit}
          className="fake-news-card glass rounded-2xl p-5 sm:p-7"
        >
          {/* Form Header */}

          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300">
              <Newspaper size={20} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                News information
              </h2>

              <p className="text-xs text-slate-500">
                Enter the news content you want to analyze.
              </p>
            </div>
          </div>

          {/* Error */}

          {error && (
            <ErrorAlert
              message={error}
              onClose={() => setError("")}
            />
          )}

          {/* News Input */}

          <div className="mt-5">
            <label>
              <span className="label">
                News Article
              </span>

              <textarea
                className="input min-h-[320px] resize-y"
                value={form.news_text}
                onChange={(e) =>
                  update("news_text", e.target.value)
                }
                placeholder="Paste or type the news article here..."
                required
              />
            </label>
          </div>

          {/* Character Count */}

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-slate-600">
              {form.news_text.length} characters
            </span>
          </div>

          {/* Submit */}

          <div className="mt-6">
            <LoadingButton loading={loading}>
              Detect fake news
            </LoadingButton>
          </div>
        </form>

        {/* Result Card */}

        <aside className="fake-news-card glass h-fit rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl ${
                result
                  ? isFake
                    ? "bg-red-500/10 text-red-300"
                    : "bg-emerald-500/10 text-emerald-300"
                  : "bg-indigo-500/10 text-indigo-300"
              }`}
            >
              {result ? (
                isFake ? (
                  <ShieldAlert size={19} />
                ) : (
                  <ShieldCheck size={19} />
                )
              ) : (
                <Newspaper size={19} />
              )}
            </div>

            <div>
              <h2 className="font-bold text-white">
                Detection result
              </h2>

              <p className="text-xs text-slate-500">
                Returned by /predict
              </p>
            </div>
          </div>

          {result ? (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                News classification
              </p>

              <div
                className={`mt-2 flex items-center gap-3 text-4xl font-black tracking-tight sm:text-5xl ${
                  isFake
                    ? "text-red-300"
                    : "text-emerald-300"
                }`}
              >
                {isFake ? (
                  <ShieldAlert size={42} />
                ) : (
                  <ShieldCheck size={42} />
                )}

                <span>
                  {isFake ? "FAKE" : "REAL"}
                </span>
              </div>

              {/* Result Info */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <InfoCard
                  icon={MessageSquare}
                  label="Text length"
                  value={`${form.news_text.length} characters`}
                />

                <InfoCard
                  icon={FileText}
                  label="Classification"
                  value={
                    isFake
                      ? "Potentially fake news"
                      : "Potentially real news"
                  }
                />
              </div>

              {/* Result Description */}

              <div className="mt-7 rounded-2xl bg-slate-900/70 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  {isFake ? (
                    <ShieldAlert
                      size={18}
                      className="text-red-300"
                    />
                  ) : (
                    <ShieldCheck
                      size={18}
                      className="text-emerald-300"
                    />
                  )}

                  <span>
                    {isFake
                      ? "The model classified this news as fake."
                      : "The model classified this news as real."}
                  </span>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                This classification is generated by a
                machine-learning model and should be treated
                as an automated prediction rather than a
                guaranteed determination.
              </p>
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-800 p-8 text-center">
              <Newspaper
                size={30}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-500">
                Your news classification will appear here
                after detection.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

/* -------------------------------- */
/* Result Info Card */
/* -------------------------------- */

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-900/60 p-3">
      <div className="flex items-center gap-2">
        <Icon
          size={15}
          className="text-indigo-300"
        />

        <span className="text-xs text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}