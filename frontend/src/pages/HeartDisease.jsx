import { useLayoutEffect, useRef, useState } from "react";
import { Activity, CheckCircle2, HeartPulse } from "lucide-react";
import gsap from "gsap";
import PageHeader from "../components/PageHeader";
import ModelNavigation from "../components/ModelNavigation";
import LoadingButton from "../components/LoadingButton";
import ErrorAlert from "../components/ErrorAlert";
import { getHeartMetrics, predictHeartDisease } from "../lib/api";

const initialForm = {
  Age: 54,
  Sex: "Male",
  ChestPainType: "ATA",
  RestingBP: 130,
  Cholesterol: 220,
  FastingBS: 0,
  RestingECG: "Normal",
  MaxHR: 140,
  ExerciseAngina: "N",
  Oldpeak: 0,
  ST_Slope: "Up",
};

const fields = [
  ["Age", "number"], ["RestingBP", "number"], ["Cholesterol", "number"],
  ["MaxHR", "number"], ["Oldpeak", "number"], ["FastingBS", "number"],
];

export default function HeartDisease() {
  const ref = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".form-card", { x: -24, opacity: 0, duration: 0.7, ease: "power3.out" });
      gsap.from(".result-card", { x: 24, opacity: 0, duration: 0.7, delay: 0.1, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    getHeartMetrics()
      .then(setMetrics)
      .catch(() => setMetrics(null))
      .finally(() => setMetricsLoading(false));
  }, []);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        ...form,
        Age: Number(form.Age),
        RestingBP: Number(form.RestingBP),
        Cholesterol: Number(form.Cholesterol),
        FastingBS: Number(form.FastingBS),
        MaxHR: Number(form.MaxHR),
        Oldpeak: Number(form.Oldpeak),
      };
      const data = await predictHeartDisease(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main ref={ref} className="page-enter mx-auto max-w-6xl px-5 py-12">
      <PageHeader
        eyebrow="Model 01 / Classification"
        title="Heart Disease Prediction"
        description="Enter the same clinical feature categories expected by your FastAPI endpoint."
      />
      <ModelNavigation/>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <form onSubmit={submit} className="form-card glass rounded-2xl p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-300">
              <HeartPulse size={20} />
            </div>
            <div>
              <h2 className="font-bold text-white">Patient information</h2>
              <p className="text-xs text-slate-500">All values are validated before the request.</p>
            </div>
          </div>

          {error && <ErrorAlert message={error} onClose={() => setError("")} />}

          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([key, type]) => (
              <label key={key}>
                <span className="label">{key}</span>
                <input
                  className="input"
                  type={type}
                  value={form[key]}
                  step={key === "Oldpeak" ? "0.1" : "1"}
                  onChange={(e) => update(key, e.target.value)}
                  required
                />
              </label>
            ))}

            <SelectField label="Sex" value={form.Sex} onChange={(v) => update("Sex", v)} options={["Male", "Female"]} />
            <SelectField label="ChestPainType" value={form.ChestPainType} onChange={(v) => update("ChestPainType", v)} options={["TA", "ATA", "NAP", "ASY"]} />
            <SelectField label="RestingECG" value={form.RestingECG} onChange={(v) => update("RestingECG", v)} options={["Normal", "ST", "LVH"]} />
            <SelectField label="ExerciseAngina" value={form.ExerciseAngina} onChange={(v) => update("ExerciseAngina", v)} options={["Y", "N"]} />
            <SelectField label="ST_Slope" value={form.ST_Slope} onChange={(v) => update("ST_Slope", v)} options={["Up", "Flat", "Down"]} />
          </div>

          <div className="mt-6">
            <LoadingButton loading={loading}>Run prediction</LoadingButton>
          </div>
        </form>

        <aside className="result-card glass h-fit rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <Activity className="text-indigo-300" />
            <h2 className="font-bold text-white">Prediction</h2>
          </div>

          {result ? (
            <div className="space-y-5">
              <div className={`rounded-2xl p-5 ${result.heart_disease_predicted ? "bg-red-500/10 ring-1 ring-red-400/20" : "bg-emerald-500/10 ring-1 ring-emerald-400/20"}`}>
                <p className="text-xs uppercase tracking-widest text-slate-500">Assessment</p>
                <p className={`mt-2 text-2xl font-black ${result.heart_disease_predicted ? "text-red-300" : "text-emerald-300"}`}>
                  {result.risk_assessment}
                </p>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Probability</span>
                  <span className="font-bold text-white">{result.probability_percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-400 transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(0, result.probability_percentage))}%` }}
                  />
                </div>
              </div>
              <p className="flex gap-2 text-xs leading-5 text-slate-500">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                This is an ML prediction and should not be used as a medical diagnosis.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-7 text-center">
              <p className="text-sm text-slate-500">Submit the form to see a prediction.</p>
            </div>
          )}

          <div className="mt-6 border-t border-slate-800 pt-5">
            <p className="text-xs uppercase tracking-widest text-slate-600">Model metrics</p>
            {metricsLoading ? (
              <p className="mt-3 text-sm text-slate-500">Loading metrics...</p>
            ) : metrics ? (
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Algorithm" value={metrics.algorithm} />
                <Metric label="Accuracy" value={`${metrics.accuracy}%`} />
                <Metric label="F1 Score" value={`${metrics.f1_score}%`} />
                <Metric label="Features" value={metrics.total_features} />
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-600">Metrics API unavailable.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label>
      <span className="label">{label}</span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-900/70 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">{label}</p>
      <p className="mt-1 truncate font-semibold text-slate-200">{value}</p>
    </div>
  );
}
