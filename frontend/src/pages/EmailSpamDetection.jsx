import { useLayoutEffect, useRef, useState } from "react";
import {
  Mail,
  ShieldCheck,
  ShieldAlert,
  Send,
  MessageSquare,
} from "lucide-react";
import gsap from "gsap";

import PageHeader from "../components/PageHeader";
import ModelNavigation from "../components/ModelNavigation";
import LoadingButton from "../components/LoadingButton";
import ErrorAlert from "../components/ErrorAlert";

import { predictEmailSpam } from "../lib/api";

const initialForm = {
  seed_text: "",
};

export default function EmailSpamDetection() {
  const ref = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".spam-card",
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

    if (!form.seed_text.trim()) {
      setError("Please enter an email message.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        seed_text: form.seed_text,
      };

      const data = await predictEmailSpam(payload);

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Email spam detection failed."
      );
    } finally {
      setLoading(false);
    }
  }

  const isSpam = result?.model_response === "spam";

  return (
    <main
      ref={ref}
      className="page-enter mx-auto max-w-6xl px-5 py-12"
    >
      {/* Page Header */}

      <PageHeader
        eyebrow="Model 04 / NLP Classification"
        title="Email Spam Detection"
        description="Analyze an email message using TF-IDF text features and a machine-learning classification model to determine whether it is spam or ham."
      />

      {/* Model Navigation */}

      <ModelNavigation />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">

        {/* Detection Form */}

        <form
          onSubmit={submit}
          className="spam-card glass rounded-2xl p-5 sm:p-7"
        >

          {/* Form Header */}

          <div className="mb-6 flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300">
              <Mail size={20} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Email information
              </h2>

              <p className="text-xs text-slate-500">
                Enter the email content you want to classify.
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

          {/* Email Input */}

          <div className="mt-5">

            <label>
              <span className="label">
                Email Message
              </span>

              <textarea
                className="input min-h-[280px] resize-y"
                value={form.seed_text}
                onChange={(e) =>
                  update("seed_text", e.target.value)
                }
                placeholder="Paste or type the email message here..."
                required
              />
            </label>

          </div>

          {/* Character Count */}

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-slate-600">
              {form.seed_text.length} characters
            </span>
          </div>

          {/* Submit */}

          <div className="mt-6">
            <LoadingButton loading={loading}>
              Detect email
            </LoadingButton>
          </div>

        </form>

        {/* Result Card */}

        <aside className="spam-card glass h-fit rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <div
              className={`grid h-10 w-10 place-items-center rounded-xl ${
                result
                  ? isSpam
                    ? "bg-red-500/10 text-red-300"
                    : "bg-emerald-500/10 text-emerald-300"
                  : "bg-indigo-500/10 text-indigo-300"
              }`}
            >
              <ShieldCheck size={19} />
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
                Email classification
              </p>

              <div
                className={`mt-2 flex items-center gap-3 text-4xl font-black tracking-tight sm:text-5xl ${
                  isSpam
                    ? "text-red-300"
                    : "text-emerald-300"
                }`}
              >
                {isSpam ? (
                  <ShieldAlert size={42} />
                ) : (
                  <ShieldCheck size={42} />
                )}

                <span>
                  {isSpam ? "SPAM" : "HAM"}
                </span>
              </div>

              {/* Result Info */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">

                <InfoCard
                  icon={MessageSquare}
                  label="Message length"
                  value={`${form.seed_text.length} characters`}
                />

                <InfoCard
                  icon={Mail}
                  label="Classification"
                  value={isSpam ? "Spam email" : "Legitimate email"}
                />

              </div>

              {/* Result Description */}

              <div className="mt-7 rounded-2xl bg-slate-900/70 p-4">

                <div className="flex items-center gap-3 text-sm text-slate-300">

                  {isSpam ? (
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
                    {isSpam
                      ? "The model classified this email as spam."
                      : "The model classified this email as a legitimate email."}
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

              <Mail
                size={30}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-500">
                Your email classification will appear here
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