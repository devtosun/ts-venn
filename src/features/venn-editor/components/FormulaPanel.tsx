import { useMemo } from 'react';
import type { Region, Segment } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormulaPanelProps {
  regions: Region[];
  segments: Segment[];
}

function regionToFormula(region: Region, allSegments: Segment[]): string {
  const segmentMap = new Map(allSegments.map((s) => [s.id, s]));
  const inSet = new Set(region.segmentIds);

  // Get codes for segments IN the region
  const inCodes = region.segmentIds
    .map((id) => segmentMap.get(id)?.code ?? id)
    .sort()
    .join(' \u2229 '); // ∩ symbol

  // Get codes for segments NOT in the region
  const outCodes = allSegments
    .filter((s) => !inSet.has(s.id))
    .map((s) => s.code)
    .sort();

  if (outCodes.length === 0) {
    return inCodes;
  } else {
    const outPart = outCodes.join(' - ');
    return `(${inCodes}) - ${outPart}`;
  }
}

function generateFormula(regions: Region[], segments: Segment[]): string {
  const selectedRegions = regions.filter((r) => r.selected);

  if (selectedRegions.length === 0) {
    return '-';
  }

  const formulas = selectedRegions.map((r) => regionToFormula(r, segments));

  if (formulas.length === 1) {
    return formulas[0];
  }

  // Multiple selections - join with union symbol
  return formulas.map((f) => `(${f})`).join(' \u222A '); // ∪ symbol
}

export function FormulaPanel({ regions, segments }: FormulaPanelProps) {
  const formula = useMemo(
    () => generateFormula(regions, segments),
    [regions, segments]
  );

  return (
    <Card className="flex-shrink-0">
      <CardHeader className="py-2 sm:py-3 px-3 sm:px-6">
        <CardTitle className="text-primary text-sm sm:text-base">Formula</CardTitle>
      </CardHeader>
      <CardContent className="py-2 sm:py-3 px-3 sm:px-6">
        <div className="font-mono text-sm sm:text-base p-2 sm:p-4 bg-secondary rounded-lg text-[hsl(187,100%,50%)] overflow-x-auto whitespace-nowrap">
          {formula}
        </div>
      </CardContent>
    </Card>
  );
}
