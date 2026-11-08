import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
  onDateRangeChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  onDateRangeChange?: (range: DateRange | undefined) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Handle mobile detection
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    onDateRangeChange?.(date);
  }, [date, onDateRangeChange]);

  React.useEffect(() => {
    if (isMobile && date?.from && date?.to) {
      setIsOpen(false);
    }
  }, [date, isMobile]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
    setIsOpen(false);
  };

  const formatDate = (date: Date) =>
    isMobile ? format(date, "MM/dd") : format(date, "LLL dd, y");

  const getButtonText = () => {
    if (!date?.from) return isMobile ? "Огноо" : "Огноогоор шүүх";
    if (date.to) return `${formatDate(date.from)} - ${formatDate(date.to)}`;
    return format(date.from, isMobile ? "MM/dd/yyyy" : "LLL dd, y");
  };

  return (
    <div className={cn("grid gap-2 w-full max-w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full max-w-full justify-between text-left font-normal px-3 py-2 group",
              "min-h-[40px] overflow-hidden relative",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center flex-1 min-w-0 pr-6">
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate flex-1 min-w-0 text-left">
                {getButtonText()}
              </span>
            </div>

            {date?.from && (
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-accent"
                onClick={handleClear}
              >
                <X className="h-4 w-4 text-muted-foreground opacity-70 hover:opacity-100 hover:text-foreground transition-opacity" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 max-w-[calc(100vw-32px)]"
          align={isMobile ? "center" : "start"}
          side={isMobile ? "top" : "bottom"}
          sideOffset={isMobile ? 30 : 4}
          collisionPadding={16}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={isMobile ? 1 : 2}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
