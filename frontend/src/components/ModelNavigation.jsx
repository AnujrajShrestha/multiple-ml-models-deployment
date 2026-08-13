import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  HeartPulse,
  BrainCircuit,
  House,
  Mail,
  Car,
  GraduationCap,
  icons,
  CloudSun,
  Newspaper
} from "lucide-react";

const models = [
  {
    path: "/",
    label: "Home",
    icon: Home,
  },
  {
    path: "/heart-disease",
    label: "Heart Disease",
    icon: HeartPulse,
  },
  {
    path: "/mental-health",
    label: "Mental Health",
    icon: BrainCircuit,
  },
  {
    path: "/house-prediction",
    label: "House Price",
    icon: House,
  },
  {
    path: "/email-prediction",
    label: "Email spam",
    icon: Mail
  },{
    path: "/news-prediction",
    label: "News detection",
    icon: Newspaper
  },
  {
    path: "/car-prediction",
    label: "Car price",
    icon: Car
  },{
    path: "/student-prediction",
    label: "Student placement",
    icon: GraduationCap
  },{
    path: "/weather_prediction",
    label: "Weather prediction",
    icon: CloudSun
  }
];

export default function ModelNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="mb-8">
      <div className="glass rounded-2xl p-2">
        <div className="flex flex-wrap gap-2">
          {models.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;

            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className={`
                  flex items-center gap-2
                  rounded-xl
                  px-4 py-2.5
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    active
                      ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30"
                      : "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon size={17} />

                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}