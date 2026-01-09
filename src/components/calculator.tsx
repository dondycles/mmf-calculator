import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { getDaysInMonth, getDay, getDate } from "date-fns";
export default function Calculator() {
  const [currentNetProfit, setCurrentNetProfit] = useState<
    number | undefined
  >();

  const [result, setResult] = useState<number>(0);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // Optional: hides cents if they are .00
    // minimumFractionDigits: 0,
  });

  useEffect(() => {
    if (isNaN(Number(currentNetProfit))) return;
    setResult(
      Number(
        (
          (getDaysInMonth(new Date()) / getDate(new Date())) *
          Number(currentNetProfit) *
          0.8
        ).toFixed(2),
      ),
    );
  }, [currentNetProfit]);

  return (
    <FieldSet className="w-fit mx-auto">
      <FieldLegend>mymusic5 Profit Calculator</FieldLegend>
      <FieldDescription>
        Calculates your projected profit this month minus the sales tax.
      </FieldDescription>
      <div className="shadow-xs flex flex-col gap-2 bg-orange-500/10 p-4 rounded-lg border">
        <span className="text-muted-foreground">
          Your profit minus tax will be:
        </span>
        <span className="font-semibold text-4xl text-orange-500  w-fit ml-auto mr-0">
          {" "}
          {formatter.format(result)}
        </span>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="currentNetProfit">Current Net Profit</FieldLabel>
          <div className="relative">
            <DollarSign className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="bg-background pl-8"
              placeholder="0.00"
              step="0.01"
              min={0}
              type="number"
              id="currentNetProfit"
              autoComplete="off"
              value={String(currentNetProfit).replace(/^0+/, "")}
              onChange={(e) => {
                const val = e.currentTarget.value;
                setCurrentNetProfit(Number(val));
              }}
            />
          </div>
          <FieldDescription>This appears on your dashboard.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
