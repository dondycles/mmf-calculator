import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { DollarSign, Percent } from "lucide-react";
import { getDaysInMonth, getDate } from "date-fns";
import { CurrencySelect } from "./currency-select";
export default function Calculator() {
  const [tax, setTax] = useState<number>(20);
  const [currency, setCurrency] = useState<string>("PHP");
  const [currentNetProfit, setCurrentNetProfit] = useState<
    number | undefined
  >();
  const [result, setResult] = useState<number>(0);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    // Optional: hides cents if they are .00
    // minimumFractionDigits: 0,
  });

  async function convert(to: string, amount: number) {
    return fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=${to}`)
      .then((resp) => resp.json())
      .then((data) => {
        const convertedAmount = (amount * data.rates[to]).toFixed(2);
        return Number(convertedAmount);
      });
  }

  useEffect(() => {
    if (isNaN(Number(currentNetProfit))) return;
    const calculateResult = async () => {
      try {
        const rawValue =
          (getDaysInMonth(new Date()) / getDate(new Date())) *
          Number(currentNetProfit) *
          (1 - tax / 100);

        const convertedValue = await convert(
          currency,
          Number(rawValue.toFixed(2)),
        );

        setResult(convertedValue);
      } catch (error) {
        console.error("Conversion failed:", error);
      }
    };

    // 3. Execute it
    calculateResult();
  }, [currentNetProfit, tax, currency]);

  return (
    <FieldSet className="max-w-sm w-full">
      <FieldLegend>mymusic5 Profit Calculator</FieldLegend>
      <FieldDescription>
        Calculates your projected profit of this month based on your current
        profit.
      </FieldDescription>
      <img src="https://latex.codecogs.com/png.image?\dpi{110}\left(\frac{\textbf{number&space;of&space;days&space;this&space;month}}{\textbf{current&space;day}}*\textbf{current&space;net&space;profit}\right)-\textbf{tax}" />
      <div className="shadow-xs flex flex-col gap-8 bg-yellow-500/10 p-4 rounded-lg border">
        <div className="flex justify-between gap-4 items-center [&>button>button]:bg-white">
          <span className="text-muted-foreground">
            Projected profit minus tax:
          </span>
          <CurrencySelect
            onValueChange={setCurrency}
            value={currency}
            placeholder="Currency"
            disabled={false}
            currencies="all"
            variant="small"
            name="currency"
          />
        </div>
        <span className="font-semibold text-4xl text-yellow-500  w-fit ml-auto mr-0">
          {" "}
          {formatter.format(result)}
        </span>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="currentNetProfit">Tax Percentage</FieldLabel>
          <div className="relative">
            <Percent className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="20%"
              step="0.01"
              min={0}
              type="number"
              id="currentNetProfit"
              autoComplete="off"
              value={String(tax).replace(/^0+/, "")}
              onChange={(e) => {
                const val = e.currentTarget.value;
                setTax(Number(val));
              }}
            />
          </div>
          <FieldDescription>
            This differs from country to country.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="currentNetProfit">
            Current Net Profit in USD
          </FieldLabel>
          <div className="relative">
            <DollarSign className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />

            <Input
              className="pl-8"
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
