import { useLayoutEffect, useRef, useState } from "react";
import {
  Home,
  Car,
  Bath,
  BedDouble,
  Building2,
} from "lucide-react";
import gsap from "gsap";

import PageHeader from "../components/PageHeader";
import ModelNavigation from "../components/ModelNavigation";
import LoadingButton from "../components/LoadingButton";
import ErrorAlert from "../components/ErrorAlert";

import { predictHousePrice } from "../lib/api";


const initialForm = {
  area: 3000,
  bedrooms: 3,
  bathrooms: 2,
  stories: 2,
  mainroad: "yes",
  guestroom: "no",
  basement: "no",
  hotwaterheating: "no",
  airconditioning: "yes",
  parking: 2,
  prefarea: "no",
  furnishingstatus: "semi-furnished",
};


export default function HousePrediction() {
  const ref = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".house-card",
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
        area: Number(form.area),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        stories: Number(form.stories),

        mainroad: form.mainroad,
        guestroom: form.guestroom,
        basement: form.basement,
        hotwaterheating: form.hotwaterheating,
        airconditioning: form.airconditioning,

        parking: Number(form.parking),

        prefarea: form.prefarea,
        furnishingstatus: form.furnishingstatus,
      };

      const data = await predictHousePrice(payload);

      setResult(data);

    } catch (err) {
      setError(
        err.message ||
          "House price prediction failed."
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
        eyebrow="Model 03 / Regression"
        title="House Price Prediction"
        description="Estimate the price of a house using property size, rooms, amenities, parking, location preference, and furnishing status."
      />


      {/* Model Navigation */}

      <ModelNavigation />


      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">

        {/* Prediction Form */}

        <form
          onSubmit={submit}
          className="house-card glass rounded-2xl p-5 sm:p-7"
        >

          {/* Form Header */}

          <div className="mb-6 flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <Home size={20} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Property information
              </h2>

              <p className="text-xs text-slate-500">
                Matches the fields defined by home_info in FastAPI.
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


          {/* Basic Property Information */}

          <div className="grid gap-4 sm:grid-cols-2">

            <NumberField
              label="Area (sq.ft)"
              value={form.area}
              onChange={(v) => update("area", v)}
              min={1000}
              step="1"
            />


            <NumberField
              label="Bedrooms"
              value={form.bedrooms}
              onChange={(v) => update("bedrooms", v)}
              min={0}
            />


            <NumberField
              label="Bathrooms"
              value={form.bathrooms}
              onChange={(v) => update("bathrooms", v)}
              min={0}
            />


            <NumberField
              label="Stories"
              value={form.stories}
              onChange={(v) => update("stories", v)}
              min={0}
            />


            <NumberField
              label="Parking Spaces"
              value={form.parking}
              onChange={(v) => update("parking", v)}
              min={0}
            />

          </div>


          {/* Property Features */}

          <div className="mt-6">

            <div className="mb-4 flex items-center gap-2">

              <Building2
                size={17}
                className="text-indigo-300"
              />

              <h3 className="text-sm font-bold text-white">
                Property features
              </h3>

            </div>


            <div className="grid gap-4 sm:grid-cols-2">

              <SelectField
                label="Main Road"
                value={form.mainroad}
                onChange={(v) => update("mainroad", v)}
                options={["yes", "no"]}
              />


              <SelectField
                label="Guest Room"
                value={form.guestroom}
                onChange={(v) => update("guestroom", v)}
                options={["yes", "no"]}
              />


              <SelectField
                label="Basement"
                value={form.basement}
                onChange={(v) => update("basement", v)}
                options={["yes", "no"]}
              />


              <SelectField
                label="Hot Water Heating"
                value={form.hotwaterheating}
                onChange={(v) =>
                  update("hotwaterheating", v)
                }
                options={["yes", "no"]}
              />


              <SelectField
                label="Air Conditioning"
                value={form.airconditioning}
                onChange={(v) =>
                  update("airconditioning", v)
                }
                options={["yes", "no"]}
              />


              <SelectField
                label="Preferred Area"
                value={form.prefarea}
                onChange={(v) => update("prefarea", v)}
                options={["yes", "no"]}
              />

            </div>

          </div>


          {/* Furnishing Status */}

          <div className="mt-4">

            <SelectField
              label="Furnishing Status"
              value={form.furnishingstatus}
              onChange={(v) =>
                update("furnishingstatus", v)
              }
              options={[
                "furnished",
                "semi-furnished",
                "unfurnished",
              ]}
            />

          </div>


          {/* Submit */}

          <div className="mt-6">

            <LoadingButton loading={loading}>
              Predict house price
            </LoadingButton>

          </div>

        </form>


        {/* Result Card */}

        <aside className="house-card glass h-fit rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <Home size={19} />
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
                Estimated house price
              </p>


              <div className="mt-2 break-words text-4xl font-black tracking-tight text-white sm:text-5xl">
                {formatPrice(result.price)}
              </div>


              <div className="mt-7 grid gap-3 sm:grid-cols-3">

                <InfoCard
                  icon={Home}
                  label="Area"
                  value={`${form.area} sq.ft`}
                />

                <InfoCard
                  icon={BedDouble}
                  label="Bedrooms"
                  value={form.bedrooms}
                />

                <InfoCard
                  icon={Bath}
                  label="Bathrooms"
                  value={form.bathrooms}
                />

              </div>


              <div className="mt-7 rounded-2xl bg-slate-900/70 p-4">

                <div className="flex items-center gap-3 text-sm text-slate-300">

                  <Car
                    size={18}
                    className="text-indigo-300"
                  />

                  <span>
                    Prediction generated from the submitted
                    property features.
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

              <Home
                size={30}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-500">
                Your estimated house price will appear here
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
            {formatOption(option)}
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

function formatOption(value) {
  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}


function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(price);
}