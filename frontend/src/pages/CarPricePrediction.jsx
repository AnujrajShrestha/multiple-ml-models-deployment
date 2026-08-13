import { useLayoutEffect, useRef, useState } from "react";
import {
  Car,
  Gauge,
  CalendarDays,
  Fuel,
  Settings2,
  Zap,
  CircleDollarSign,
} from "lucide-react";
import gsap from "gsap";

import PageHeader from "../components/PageHeader";
import ModelNavigation from "../components/ModelNavigation";
import LoadingButton from "../components/LoadingButton";
import ErrorAlert from "../components/ErrorAlert";

import { predictCarPrice } from "../lib/api";

const initialForm = {
  HP_per_CC: 0.1,
  Manufacture_Year: new Date().getFullYear() - 5,
  Engine_CC: 1500,
  Horsepower: 120,
  Mileage_km_per_l: 15,
  Car_Age: 5,
  Efficiency_Score: 0.7,
  Brand: "Toyota",
  Body_Type: "Sedan",
  Fuel_Type: "Petrol",
  Transmission: "Automatic",
  Price_Category: "Mid-Range",
};

export default function CarPricePrediction() {
  const ref = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".car-card",
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
        HP_per_CC: Number(form.HP_per_CC),
        Manufacture_Year: Number(form.Manufacture_Year),
        Engine_CC: Number(form.Engine_CC),
        Horsepower: Number(form.Horsepower),
        Mileage_km_per_l: Number(form.Mileage_km_per_l),
        Car_Age: Number(form.Car_Age),
        Efficiency_Score: Number(form.Efficiency_Score),

        Brand: form.Brand,
        Body_Type: form.Body_Type,
        Fuel_Type: form.Fuel_Type,
        Transmission: form.Transmission,
        Price_Category: form.Price_Category,
      };

      const data = await predictCarPrice(payload);

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Car price prediction failed."
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
        eyebrow="Model 05 / Regression"
        title="Car Price Prediction"
        description="Estimate the price of a car using engine performance, manufacturing details, efficiency, brand, body type, fuel type, transmission, and price category."
      />

      {/* Model Navigation */}

      <ModelNavigation />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">

        {/* Prediction Form */}

        <form
          onSubmit={submit}
          className="car-card glass rounded-2xl p-5 sm:p-7"
        >

          {/* Form Header */}

          <div className="mb-6 flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <Car size={20} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Car information
              </h2>

              <p className="text-xs text-slate-500">
                Matches the fields defined by car_info in FastAPI.
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

          {/* Performance Information */}

          <div className="grid gap-4 sm:grid-cols-2">

            <NumberField
              label="HP per CC"
              value={form.HP_per_CC}
              onChange={(v) => update("HP_per_CC", v)}
              min={0}
              max={1}
              step="0.01"
            />

            <NumberField
              label="Engine CC"
              value={form.Engine_CC}
              onChange={(v) => update("Engine_CC", v)}
              min={1000}
              max={5000}
            />

            <NumberField
              label="Horsepower"
              value={form.Horsepower}
              onChange={(v) => update("Horsepower", v)}
              min={60}
              max={600}
            />

            <NumberField
              label="Mileage (km/l)"
              value={form.Mileage_km_per_l}
              onChange={(v) => update("Mileage_km_per_l", v)}
              min={0}
              max={50}
            />

          </div>

          {/* Manufacturing & Efficiency */}

          <div className="mt-6">

            <div className="mb-4 flex items-center gap-2">

              <Gauge
                size={17}
                className="text-indigo-300"
              />

              <h3 className="text-sm font-bold text-white">
                Manufacturing & efficiency
              </h3>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <NumberField
                label="Manufacture Year"
                value={form.Manufacture_Year}
                onChange={(v) =>
                  update("Manufacture_Year", v)
                }
                min={1500}
                max={new Date().getFullYear()}
              />

              <NumberField
                label="Car Age"
                value={form.Car_Age}
                onChange={(v) => update("Car_Age", v)}
                min={0}
                max={100}
              />

              <NumberField
                label="Efficiency Score"
                value={form.Efficiency_Score}
                onChange={(v) =>
                  update("Efficiency_Score", v)
                }
                min={0}
                max={1}
                step="0.01"
              />

            </div>

          </div>

          {/* Car Features */}

          <div className="mt-6">

            <div className="mb-4 flex items-center gap-2">

              <Car
                size={17}
                className="text-indigo-300"
              />

              <h3 className="text-sm font-bold text-white">
                Car features
              </h3>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <SelectField
                label="Brand"
                value={form.Brand}
                onChange={(v) => update("Brand", v)}
                options={[
                  "Mercedes",
                  "Nissan",
                  "Hyundai",
                  "Tesla",
                  "Audi",
                  "Honda",
                  "Ford",
                  "Toyota",
                  "BMW",
                  "Kia",
                ]}
              />

              <SelectField
                label="Body Type"
                value={form.Body_Type}
                onChange={(v) => update("Body_Type", v)}
                options={[
                  "SUV",
                  "Coupe",
                  "Hatchback",
                  "Sedan",
                  "Pickup",
                ]}
              />

              <SelectField
                label="Fuel Type"
                value={form.Fuel_Type}
                onChange={(v) => update("Fuel_Type", v)}
                options={[
                  "Petrol",
                  "Diesel",
                  "Hybrid",
                  "Electric",
                ]}
              />

              <SelectField
                label="Transmission"
                value={form.Transmission}
                onChange={(v) =>
                  update("Transmission", v)
                }
                options={[
                  "Manual",
                  "Automatic",
                ]}
              />

              <SelectField
                label="Price Category"
                value={form.Price_Category}
                onChange={(v) =>
                  update("Price_Category", v)
                }
                options={[
                  "Premium",
                  "Mid-Range",
                  "Budget",
                  "Luxury",
                ]}
              />

            </div>

          </div>

          {/* Submit */}

          <div className="mt-6">

            <LoadingButton loading={loading}>
              Predict car price
            </LoadingButton>

          </div>

        </form>

        {/* Result Card */}

        <aside className="car-card glass h-fit rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <Car size={19} />
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
                Estimated car price
              </p>

              <div className="mt-2 break-words text-4xl font-black tracking-tight text-white sm:text-5xl">
                {formatPrice(result.price)}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">

                <InfoCard
                  icon={Car}
                  label="Brand"
                  value={form.Brand}
                />

                <InfoCard
                  icon={Zap}
                  label="Horsepower"
                  value={`${form.Horsepower} HP`}
                />

                <InfoCard
                  icon={CalendarDays}
                  label="Manufacture"
                  value={form.Manufacture_Year}
                />

              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">

                <InfoCard
                  icon={Fuel}
                  label="Fuel Type"
                  value={form.Fuel_Type}
                />

                <InfoCard
                  icon={Settings2}
                  label="Transmission"
                  value={form.Transmission}
                />

              </div>

              <div className="mt-7 rounded-2xl bg-slate-900/70 p-4">

                <div className="flex items-center gap-3 text-sm text-slate-300">

                  <CircleDollarSign
                    size={18}
                    className="text-indigo-300"
                  />

                  <span>
                    Prediction generated from the submitted
                    vehicle specifications.
                  </span>

                </div>

              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                This model output is an estimate generated by a
                machine-learning model. It should not be treated
                as a guaranteed market price.
              </p>

            </div>

          ) : (

            <div className="mt-7 rounded-2xl border border-dashed border-slate-800 p-8 text-center">

              <Car
                size={30}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-500">
                Your estimated car price will appear here
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

      <p className="mt-2 text-sm font-semibold text-slate-200">
        {value}
      </p>

    </div>
  );
}


/* -------------------------------- */
/* Helpers */
/* -------------------------------- */

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(price);
}
