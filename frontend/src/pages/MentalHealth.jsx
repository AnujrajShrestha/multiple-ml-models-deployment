import { useLayoutEffect, useRef, useState } from "react";
import { BrainCircuit, Moon, Smartphone } from "lucide-react";
import gsap from "gsap";
import PageHeader from "../components/PageHeader";
import ModelNavigation from "../components/ModelNavigation";
import LoadingButton from "../components/LoadingButton";
import ErrorAlert from "../components/ErrorAlert";
import { predictMentalHealth } from "../lib/api";

const initialForm = {
  age: 21,
  gender: "Male",
  country: "Nepal",
  academic_level: "Undergraduate",
  most_used_platform: "Instagram",
  purpose_of_use: "Education",
  avg_daily_usage_hours: 4,
  daily_unlocks: 50,
  study_hours: 5,
  physical_activity_hours: 1,
  sleep_hours_per_night: 7,
  stress_level: "Medium",
};

export default function MentalHealth() {
  const ref = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mental-card", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
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
        age: Number(form.age),
        avg_daily_usage_hours: Number(form.avg_daily_usage_hours),
        daily_unlocks: Number(form.daily_unlocks),
        study_hours: Number(form.study_hours),
        physical_activity_hours: Number(form.physical_activity_hours),
        sleep_hours_per_night: Number(form.sleep_hours_per_night),
      };
      const data = await predictMentalHealth(payload);
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
        eyebrow="Model 02 / Regression"
        title="Mental Health Score"
        description="Estimate the score using student demographics, academic information, social-media usage, and lifestyle features."
      />
      <ModelNavigation/>
      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <form onSubmit={submit} className="mental-card glass rounded-2xl p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-300">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h2 className="font-bold text-white">Student information</h2>
              <p className="text-xs text-slate-500">Matches the fields defined by studentData in FastAPI.</p>
            </div>
          </div>

          {error && <ErrorAlert message={error} onClose={() => setError("")} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Age" value={form.age} onChange={(v) => update("age", v)} min={10} max={100} />
            <SelectField label="Gender" value={form.gender} onChange={(v) => update("gender", v)} options={["Male", "Female"]} />
            <label className="sm:col-span-2">
              <span className="label">Country</span>
              <input className="input" value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="e.g. Nepal" required />
            </label>
            <SelectField label="Academic Level" value={form.academic_level} onChange={(v) => update("academic_level", v)} options={["Undergraduate", "Graduate", "High School"]} />
            <SelectField
              label="Most Used Platform"
              value={form.most_used_platform}
              onChange={(v) => update("most_used_platform", v)}
              options={["Facebook","LinkedIn","Instagram","Snapchat","Twitter","YouTube","TikTok","LINE","KakaoTalk","VKontakte","WhatsApp","WeChat"]}
            />
            <SelectField label="Purpose of Use" value={form.purpose_of_use} onChange={(v) => update("purpose_of_use", v)} options={["Networking","Education","Entertainment","News"]} />
            <SelectField label="Stress Level" value={form.stress_level} onChange={(v) => update("stress_level", v)} options={["Medium","Low","Very High","High"]} />

            <NumberField label="Avg Daily Usage (hours)" value={form.avg_daily_usage_hours} onChange={(v) => update("avg_daily_usage_hours", v)} min={0} max={24} step="0.1" />
            <NumberField label="Daily Unlocks" value={form.daily_unlocks} onChange={(v) => update("daily_unlocks", v)} min={0} />
            <NumberField label="Study Hours" value={form.study_hours} onChange={(v) => update("study_hours", v)} min={0} max={24} step="0.1" />
            <NumberField label="Physical Activity (hours)" value={form.physical_activity_hours} onChange={(v) => update("physical_activity_hours", v)} min={0} max={24} step="0.1" />
            <NumberField label="Sleep (hours/night)" value={form.sleep_hours_per_night} onChange={(v) => update("sleep_hours_per_night", v)} min={0} max={24} step="0.1" />
          </div>

          <div className="mt-6">
            <LoadingButton loading={loading}>Estimate score</LoadingButton>
          </div>
        </form>

        <aside className="mental-card glass h-fit rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-300">
              <Moon size={19} />
            </div>
            <div>
              <h2 className="font-bold text-white">Prediction result</h2>
              <p className="text-xs text-slate-500">Returned by /predict</p>
            </div>
          </div>

          {result ? (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-slate-500">Mental health score</p>
              <div className="mt-2 text-6xl font-black tracking-tight text-white">
                {result.predicted_mental_health_score}
              </div>
              <div className="mt-7 rounded-2xl bg-slate-900/70 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Smartphone size={18} className="text-indigo-300" />
                  Prediction generated from your submitted lifestyle features.
                </div>
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-500">
                This model output is informational and should not be interpreted as a clinical assessment.
              </p>
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-800 p-8 text-center">
              <p className="text-sm text-slate-500">Your score will appear here after prediction.</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

function NumberField({ label, value, onChange, min, max, step = "1" }) {
  return (
    <label>
      <span className="label">{label}</span>
      <input
        className="input"
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </label>
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
