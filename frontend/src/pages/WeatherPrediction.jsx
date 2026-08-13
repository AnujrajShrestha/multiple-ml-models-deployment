import { useLayoutEffect, useRef, useState } from "react";
import {
  CloudSun,
  Droplets,
  Gauge,
  Wind,
  Sun,
  Eye,
  Cloud,
  MapPin,
  Thermometer,
} from "lucide-react";
import gsap from "gsap";

import PageHeader from "../components/PageHeader";
import ModelNavigation from "../components/ModelNavigation";
import LoadingButton from "../components/LoadingButton";
import ErrorAlert from "../components/ErrorAlert";

import { predictWeather } from "../lib/api";

const initialForm = {
  Humidity: 60,
  Precipitation: 20,
  Atmospheric_Pressure: 1013,
  Wind_Speed: 10,
  UV_index: 5,
  Visibility: 10,
  Cloud_Cover: "partly cloudy",
  Season: "Summer",
  Location: "inland",
};

export default function WeatherPrediction() {
  const ref = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".weather-card",
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
        Humidity: Number(form.Humidity),
        Precipitation: Number(form.Precipitation),
        Atmospheric_Pressure: Number(form.Atmospheric_Pressure),
        Wind_Speed: Number(form.Wind_Speed),
        UV_index: Number(form.UV_index),
        Visibility: Number(form.Visibility),

        Cloud_Cover: form.Cloud_Cover,
        Season: form.Season,
        Location: form.Location,
      };

      const data = await predictWeather(payload);

      setResult(data);
    } catch (err) {
      setError(
        err.message || "Weather prediction failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      ref={ref}
      className="page-enter mx-auto max-w-6xl px-5 py-12"
    >
      {/* Page Header */}

      <PageHeader
        eyebrow="Model 06 / Regression + Classification"
        title="Weather Prediction"
        description="Predict temperature and weather type using humidity, precipitation, atmospheric pressure, wind speed, UV index, visibility, cloud cover, season, and location."
      />

      {/* Model Navigation */}

      <ModelNavigation />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">

        {/* Prediction Form */}

        <form
          onSubmit={submit}
          className="weather-card glass rounded-2xl p-5 sm:p-7"
        >
          {/* Form Header */}

          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-300">
              <CloudSun size={20} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Weather information
              </h2>

              <p className="text-xs text-slate-500">
                Matches the fields defined by weather_info in FastAPI.
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

          {/* Weather Measurements */}

          <div className="grid gap-4 sm:grid-cols-2">

            <NumberField
              label="Humidity (%)"
              value={form.Humidity}
              onChange={(v) => update("Humidity", v)}
              min={0}
              max={100}
            />

            <NumberField
              label="Precipitation (%)"
              value={form.Precipitation}
              onChange={(v) => update("Precipitation", v)}
              min={0}
              max={120}
              step="0.1"
            />

            <NumberField
              label="Atmospheric Pressure"
              value={form.Atmospheric_Pressure}
              onChange={(v) =>
                update("Atmospheric_Pressure", v)
              }
              min={980}
              max={1040}
              step="0.1"
            />

            <NumberField
              label="Wind Speed"
              value={form.Wind_Speed}
              onChange={(v) => update("Wind_Speed", v)}
              min={0}
              max={90}
              step="0.1"
            />

            <NumberField
              label="UV Index"
              value={form.UV_index}
              onChange={(v) => update("UV_index", v)}
              min={0}
              max={15}
            />

            <NumberField
              label="Visibility (km)"
              value={form.Visibility}
              onChange={(v) => update("Visibility", v)}
              min={0}
              max={20}
              step="0.1"
            />

          </div>

          {/* Weather Conditions */}

          <div className="mt-6">

            <div className="mb-4 flex items-center gap-2">
              <Cloud
                size={17}
                className="text-indigo-300"
              />

              <h3 className="text-sm font-bold text-white">
                Weather conditions
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <SelectField
                label="Cloud Cover"
                value={form.Cloud_Cover}
                onChange={(v) =>
                  update("Cloud_Cover", v)
                }
                options={[
                  "partly cloudy",
                  "clear",
                  "overcast",
                  "cloudy",
                ]}
              />

              <SelectField
                label="Season"
                value={form.Season}
                onChange={(v) =>
                  update("Season", v)
                }
                options={[
                  "Winter",
                  "Spring",
                  "Summer",
                  "Autumn",
                ]}
              />

              <SelectField
                label="Location"
                value={form.Location}
                onChange={(v) =>
                  update("Location", v)
                }
                options={[
                  "inland",
                  "mountain",
                  "coastal",
                ]}
              />

            </div>
          </div>

          {/* Submit */}

          <div className="mt-6">
            <LoadingButton loading={loading}>
              Predict weather
            </LoadingButton>
          </div>

        </form>

        {/* Result Card */}

        <aside className="weather-card glass h-fit rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-300">
              <CloudSun size={19} />
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

              {/* Temperature */}

              <p className="text-xs uppercase tracking-widest text-slate-500">
                Predicted temperature
              </p>

              <div className="mt-2 break-words text-4xl font-black tracking-tight text-white sm:text-5xl">
                {Number(result.temperature).toFixed(2)}°C
              </div>

              {/* Weather Type */}

              <div className="mt-4 rounded-2xl bg-slate-900/70 p-5 text-center">

                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Weather type
                </p>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <WeatherIcon type={result.weather_type} />

                  <span className="text-2xl font-bold text-white">
                    {result.weather_type}
                  </span>
                </div>

              </div>

              {/* Information Cards */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">

                <InfoCard
                  icon={Droplets}
                  label="Humidity"
                  value={`${form.Humidity}%`}
                />

                <InfoCard
                  icon={Wind}
                  label="Wind Speed"
                  value={`${form.Wind_Speed}`}
                />

                <InfoCard
                  icon={Sun}
                  label="UV Index"
                  value={form.UV_index}
                />

                <InfoCard
                  icon={Eye}
                  label="Visibility"
                  value={`${form.Visibility} km`}
                />

                <InfoCard
                  icon={Gauge}
                  label="Pressure"
                  value={`${form.Atmospheric_Pressure}`}
                />

                <InfoCard
                  icon={MapPin}
                  label="Location"
                  value={form.Location}
                />

              </div>

              <div className="mt-7 rounded-2xl bg-slate-900/70 p-4">

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Thermometer
                    size={18}
                    className="text-indigo-300"
                  />

                  <span>
                    Temperature and weather type were generated
                    from the submitted weather conditions.
                  </span>
                </div>

              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                These predictions are generated by machine-learning
                models and should be treated as estimates rather than
                guaranteed weather conditions.
              </p>

            </div>

          ) : (

            <div className="mt-7 rounded-2xl border border-dashed border-slate-800 p-8 text-center">

              <CloudSun
                size={30}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-500">
                Your predicted temperature and weather type will
                appear here after prediction.
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

      <p className="mt-2 text-sm font-semibold text-slate-200">
        {value}
      </p>

    </div>
  );
}


/* -------------------------------- */
/* Weather Icon */
/* -------------------------------- */

function WeatherIcon({ type }) {
  if (type === "Rainy") {
    return <Droplets size={22} className="text-indigo-300" />;
  }

  if (type === "Sunny") {
    return <Sun size={22} className="text-yellow-300" />;
  }

  if (type === "Snowy") {
    return <CloudSun size={22} className="text-cyan-300" />;
  }

  return <Cloud size={22} className="text-slate-300" />;
}