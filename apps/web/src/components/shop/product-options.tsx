import { Field, FieldGroup, FieldLabel } from "@hydesign/ui/components/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hydesign/ui/components/select";
import { ToggleGroup, ToggleGroupItem } from "@hydesign/ui/components/toggle-group";

import { optionValueIsAvailable } from "@/lib/commerce/product";
import type { Product } from "@/lib/commerce/types";

type ProductOptionsProps = {
  product: Product;
  selections: Record<string, string>;
  onSelect: (name: string, value: string) => void;
};

function ProductOptions({ onSelect, product, selections }: ProductOptionsProps) {
  const options = product.options.filter(
    (option) =>
      !(
        option.name === "Title" &&
        option.values.length === 1 &&
        option.values[0]?.name === "Default Title"
      ),
  );

  if (options.length === 0) return null;

  return (
    <FieldGroup className="gap-5">
      {options.map((option) => (
        <Field key={option.id}>
          <FieldLabel>{option.name}</FieldLabel>

          {option.values.length <= 7 ? (
            <ToggleGroup
              value={selections[option.name] ? [selections[option.name]] : []}
              onValueChange={(values) => {
                const value = values[0];
                if (value) onSelect(option.name, value);
              }}
              variant="outline"
              className="flex w-full flex-wrap justify-start"
              aria-label={option.name}
            >
              {option.values.map((value) => (
                <ToggleGroupItem
                  key={value.id}
                  value={value.name}
                  disabled={!optionValueIsAvailable(product, option.name, value.name, selections)}
                  className="min-w-12 px-3"
                >
                  {value.swatchColor ? (
                    <span
                      className="size-3 rounded-full border border-foreground/15"
                      style={{ backgroundColor: value.swatchColor }}
                      aria-hidden="true"
                    />
                  ) : null}
                  {value.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : (
            <Select
              items={Object.fromEntries(option.values.map((value) => [value.name, value.name]))}
              value={selections[option.name] ?? null}
              onValueChange={(value) => {
                if (typeof value === "string") onSelect(option.name, value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Choose ${option.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {option.values.map((value) => (
                    <SelectItem
                      key={value.id}
                      value={value.name}
                      disabled={
                        !optionValueIsAvailable(product, option.name, value.name, selections)
                      }
                    >
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </Field>
      ))}
    </FieldGroup>
  );
}

export { ProductOptions };
