/* components/ui/SidePainRow.tsx ----------------------------------------- */
import { Controller, useFormContext } from 'react-hook-form';
import SideSelector, { Side } from '@/components/ui/SideSelector';

export default function SidePainRow({
  sidePath,
  painPath,
  label,
  painLabel,
}: {
  sidePath: string;
  painPath: string;
  label: string;
  painLabel?: string;
}) {
  const { control, watch } = useFormContext();
  const sideValue: Side = watch(sidePath) ?? 'NONE';
  const showPain = sideValue !== 'NONE';

  return (
    <div className="grid grid-cols-[minmax(9rem,200px)_auto_auto_auto] gap-x-3 gap-y-1 items-center">
      {/* MAIN LABEL */}
      <span className="truncate">{label}</span>

      {/* SIDE PICKER */}
      <Controller
        control={control}
        name={sidePath as any}
        defaultValue="NONE"
        render={({ field }) => (
          <SideSelector
            value={field.value as Side}
            onChange={(v) => field.onChange(v)}
          />
        )}
      />

      {/* PAIN  (hidden until side chosen) */}
      {showPain ? (
        <>
          <span className="text-[11px] text-gray-500">{painLabel ?? ''}</span>
          <Controller
            control={control}
            name={painPath as any}
            defaultValue="NONE"
            render={({ field }) => (
              <SideSelector
                value={field.value as Side}
                onChange={(v) => field.onChange(v)}
              />
            )}
          />
        </>
      ) : (
        /* placeholder cells to keep grid alignment */
        <>
          <span />
          <span />
        </>
      )}
    </div>
  );
}