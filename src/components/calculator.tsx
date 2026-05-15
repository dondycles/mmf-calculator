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
import { Percent } from "lucide-react";
import { getDaysInMonth, getDate } from "date-fns";
import { CurrencySelect } from "./currency-select";
export default function Calculator() {
const [localTax, setLocalTax] = useState<number>(8);
  const [foreignTax, setForeignTax] = useState<number>(16.5);
  const [currency, setCurrency] = useState<string>("PHP");
  const [currentNetProfit, setCurrentNetProfit] = useState<
    number | undefined
  >();
  const [result, setResult] = useState<number>(0);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
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
          (1 - foreignTax / 100);

        const convertedValue = await convert(
          currency,
          Number(rawValue.toFixed(2)),
        );

        setResult(convertedValue);
      } catch (error) {
        console.error("Conversion failed:", error);
      }
    };

    calculateResult();
    
  }, [currentNetProfit, foreignTax, localTax, currency]);

  return (
    <FieldSet className="max-w-sm w-full">
      <FieldLegend>mymusic5 Profit Calculator</FieldLegend>
      <FieldDescription>
        Calculates your projected profit of this month based on your current
        profit.
      </FieldDescription>
      <img src="https://latex.codecogs.com/png.image?\dpi{110}\left(\frac{\textbf{number&space;of&space;days&space;this&space;month}}{\textbf{current&space;day}}*\textbf{current&space;net&space;profit}\right)-\textbf{tax}" />
      <div className="shadow-xs flex flex-col gap-4 bg-yellow-500/10 p-4 rounded-lg border">
        <div className="flex justify-between gap-4 items-center [&>button>button]:bg-white">
          <span className="text-muted-foreground">
            Projected profit minus tax:
          </span>
          <CurrencySelect
            onCurrencySelect={(c) => setCurrency(c.code)}
            onValueChange={setCurrency}
            value={currency}
            placeholder="Currency"
            disabled={false}
            currencies="custom"
            variant="small"
            name="currency"
          />
        </div>
        <span className="font-semibold text-3xl text-yellow-500  w-fit ml-auto mr-0">
          {formatter.format(result)}
        </span>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="currentNetProfit">
            Current Net Profit in USD
          </FieldLabel>
          <div className="relative">
            <span className="absolute -translate-y-1/2 top-1/2 left-3 text-muted-foreground text-sm font-semibold">
              USD
            </span>
            <Input
              className="pl-12"
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
        <Field>
          <FieldLabel htmlFor="foreignTax">Foreign Tax Percentage</FieldLabel>
          <div className="relative">
            <Percent className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="16.5%"
              step="0.01"
              min={0}
              type="number"
              id="foreignTax"
              autoComplete="off"
              value={String(foreignTax).replace(/^0+/, "")}
              onChange={(e) => {
                const val = e.currentTarget.value;
                setForeignTax(Number(val));
              }}
            />
          </div>
          <FieldDescription>
            This differs from country to country.
          </FieldDescription>
        </Field>
<Field>
          <FieldLabel htmlFor="localTax">Local Tax Percentage</FieldLabel>
          <div className="relative">
            <Percent className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="8%"
              step="0.01"
              min={0}
              type="number"
              id="localTax"
              autoComplete="off"
              value={String(localTax).replace(/^0+/, "")}
              onChange={(e) => {
                const val = e.currentTarget.value;
                setLocalTax(Number(val));
              }}
            />
          </div>
          <FieldDescription>
            This is based on your tax profile.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
