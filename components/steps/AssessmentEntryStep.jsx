import { useForm } from "react-hook-form";
import axios from "axios";
import MetricField from "../ui/MetricField";

export default function AssessmentEntryStep({ submissionId, onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await axios.post("/api/metrics", { submissionId, ...data });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <MetricField label="Visceral Fat Area (cm²)"    name="vfa"        register={register} error={errors.vfa}/>
      <MetricField label="Phase Angle (°)"            name="phaseAngle" register={register} error={errors.phaseAngle}/>
      <MetricField label="RMSSD (ms)"                 name="rmssd"      register={register} error={errors.rmssd}/>
      <MetricField label="ECW/TBW"                    name="ecwTbw"     register={register} error={errors.ecwTbw} step="0.01"/>
      <MetricField label="SMM %"                      name="smmPct"     register={register} error={errors.smmPct}/>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save & Generate Plan"}
      </button>
    </form>
  );
}