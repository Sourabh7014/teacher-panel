import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OperatingHourValues } from "../schema";

// Generate time options for dropdown (12-hour format with AM/PM)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayTime = `${hour12}:${minute
        .toString()
        .padStart(2, "0")} ${ampm}`;
      const value = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      times.push({ display: displayTime, value });
    }
  }
  return times;
};

// Convert 24-hour to 12-hour format for display
const formatTime = (time24: string) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour12}:${minutes} ${ampm}`;
};

export default function OperatingHours() {
  const form = useFormContext<OperatingHourValues>();
  const { fields } = useFieldArray({
    control: form.control,
    name: "operation_hours",
  });

  const timeOptions = useMemo(() => generateTimeOptions(), []);

  return (
    <div className="space-y-3">
      {fields.map((item, index) => {
        const isDayClosed = form.watch(`operation_hours.${index}.close`);
        return (
          <div
            key={item.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-lg border bg-card p-3 sm:p-4"
          >
            {/* Day header with toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name={`operation_hours.${index}.close`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-y-0">
                    <FormControl>
                      <Switch
                        checked={!field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(!checked);
                          if (!checked) {
                            form.setValue(`operation_hours.${index}.from`, "");
                            form.setValue(`operation_hours.${index}.to`, "");
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="min-w-[100px]">
                <p className="font-medium text-sm sm:text-base">
                  {item.day_of_week}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isDayClosed ? "Closed" : "Open"}
                </p>
              </div>
            </div>

            {/* Time selectors - shifts down on mobile, inline on desktop */}
            <div className="flex items-center">
              {isDayClosed ? (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Closed all day
                </p>
              ) : (
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <FormField
                    control={form.control}
                    name={`operation_hours.${index}.from`}
                    render={({ field }) => (
                      <FormItem className="flex-1 md:flex-none">
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={isDayClosed}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full md:min-w-[100px] h-9 text-xs sm:text-sm">
                              <SelectValue placeholder="Open time">
                                {field.value
                                  ? formatTime(field.value)
                                  : "Open time"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem
                                key={time.value}
                                value={time.value}
                                className="text-xs sm:text-sm"
                              >
                                {time.display}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <span className="text-muted-foreground text-xs sm:text-sm">
                    to
                  </span>

                  <FormField
                    control={form.control}
                    name={`operation_hours.${index}.to`}
                    render={({ field }) => (
                      <FormItem className="flex-1 md:flex-none">
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={isDayClosed}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full md:min-w-[100px] h-9 text-xs sm:text-sm">
                              <SelectValue placeholder="Close time">
                                {field.value
                                  ? formatTime(field.value)
                                  : "Close time"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem
                                key={time.value}
                                value={time.value}
                                className="text-xs sm:text-sm"
                              >
                                {time.display}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
