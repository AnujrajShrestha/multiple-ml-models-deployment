import { useLayoutEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Brain,
  BookOpen,
  MessageCircle,
  FolderKanban,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import gsap from "gsap";

import PageHeader from "../components/PageHeader";
import ModelNavigation from "../components/ModelNavigation";
import LoadingButton from "../components/LoadingButton";
import ErrorAlert from "../components/ErrorAlert";

import { predictStudentPlacement } from "../lib/api";

const initialForm = {
  IQ: 100,
  Prev_Sem_Result: 7.5,
  CGPA: 7.5,
  Communication_Skills: 7,
  Projects_Completed: 2,
  Internship_Experience: "no",
};

export default function StudentPlacementPrediction() {
  const ref = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".placement-card",
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

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        IQ: Number(form.IQ),
        Prev_Sem_Result: Number(form.Prev_Sem_Result),
        CGPA: Number(form.CGPA),
        Communication_Skills: Number(form.Communication_Skills),
        Projects_Completed: Number(form.Projects_Completed),
        Internship_Experience: form.Internship_Experience,
      };

      const data = await predictStudentPlacement(payload);

      setResult(data);
    } catch (err) {
      setError(
        err.message || "Student placement prediction failed."
      );
    } finally {
      setLoading(false);
    }
  }

  const isPlaced = result?.placement === "Yes";

  return (
    <main
      ref={ref}
      className="page-enter mx-auto max-w-6xl px-5 py-12"
    >
      <PageHeader
        eyebrow="Model 06 / Classification"
        title="Student Placement Prediction"
        description="Predict whether a student is likely to be placed using IQ, previous semester result, CGPA, communication skills, projects completed, and internship experience."
      />

      <ModelNavigation />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">

        {/* Prediction Form */}
        <form
          onSubmit={submit}
          className="placement-card glass rounded-2xl p-5 sm:p-7"
        >
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <GraduationCap size={20} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Student information
              </h2>

              <p className="text-xs text-slate-500">
                Matches the fields defined by student_info in FastAPI.
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

          {/* Academic & Aptitude */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Brain
                size={17}
                className="text-indigo-300"
              />

              <h3 className="text-sm font-bold text-white">
                Academic & aptitude
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="IQ"
                value={form.IQ}
                onChange={(v) => update("IQ", v)}
                min={20}
                max={150}
              />

              <NumberField
                label="Previous Semester Result"
                value={form.Prev_Sem_Result}
                onChange={(v) =>
                  update("Prev_Sem_Result", v)
                }
                min={0}
                step="0.01"
              />

              <NumberField
                label="CGPA"
                value={form.CGPA}
                onChange={(v) => update("CGPA", v)}
                min={0}
                step="0.01"
              />
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <MessageCircle
                size={17}
                className="text-indigo-300"
              />

              <h3 className="text-sm font-bold text-white">
                Skills & experience
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Communication Skills"
                value={form.Communication_Skills}
                onChange={(v) =>
                  update("Communication_Skills", v)
                }
                min={0}
              />

              <NumberField
                label="Projects Completed"
                value={form.Projects_Completed}
                onChange={(v) =>
                  update("Projects_Completed", v)
                }
                min={0}
              />

              <SelectField
                label="Internship Experience"
                value={form.Internship_Experience}
                onChange={(v) =>
                  update("Internship_Experience", v)
                }
                options={["yes", "no"]}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6">
            <LoadingButton loading={loading}>
              Predict placement
            </LoadingButton>
          </div>
        </form>

        {/* Result Card */}
        <aside className="placement-card glass h-fit rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <GraduationCap size={19} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Prediction result
              </h2>

              <p className="text-xs text-slate-500">
                Returned by /predict
              </p>
            </div>
          </div>

          {result ? (
            <div className="mt-8">

              <p className="text-xs uppercase tracking-widest text-slate-500">
                Placement prediction
              </p>

              <div
                className={`mt-2 flex items-center gap-3 text-4xl font-black tracking-tight ${
                  isPlaced
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {isPlaced ? (
                  <CheckCircle2 size={38} />
                ) : (
                  <XCircle size={38} />
                )}

                {result.placement}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <InfoCard
                  icon={Brain}
                  label="IQ"
                  value={form.IQ}
                />

                <InfoCard
                  icon={BookOpen}
                  label="CGPA"
                  value={form.CGPA}
                />

                <InfoCard
                  icon={MessageCircle}
                  label="Communication"
                  value={form.Communication_Skills}
                />

                <InfoCard
                  icon={FolderKanban}
                  label="Projects"
                  value={form.Projects_Completed}
                />

                <InfoCard
                  icon={BriefcaseBusiness}
                  label="Internship"
                  value={form.Internship_Experience}
                />

                <InfoCard
                  icon={GraduationCap}
                  label="Previous Result"
                  value={form.Prev_Sem_Result}
                />
              </div>

              <div className="mt-7 rounded-2xl bg-slate-900/70 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  {isPlaced ? (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-300"
                    />
                  ) : (
                    <XCircle
                      size={18}
                      className="text-red-300"
                    />
                  )}

                  <span>
                    The model predicts that this student is{" "}
                    <strong>
                      {isPlaced ? "likely" : "not likely"}
                    </strong>{" "}
                    to be placed.
                  </span>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                This prediction is generated by a machine-learning
                classification model and should not be treated as a
                guaranteed placement outcome.
              </p>
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-800 p-8 text-center">
              <GraduationCap
                size={30}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-500">
                Your placement prediction will appear here
                after prediction.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}


/* -------------------------------- */
/* Number Field */
/* -------------------------------- */

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = "1",
}) {
  return (
    <label>
      <span className="label">
        {label}
      </span>

      <input
        className="input"
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) =>
          onChange(e.target.value)
        }
        required
      />
    </label>
  );
}


/* -------------------------------- */
/* Select Field */
/* -------------------------------- */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label>
      <span className="label">
        {label}
      </span>

      <select
        className="input"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
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

      <p className="mt-2 text-sm font-semibold capitalize text-slate-200">
        {value}
      </p>
    </div>
  );
}