"use client";

type TabsProps = {
  className?: string;
  classButton?: string;
  items: { label: string; value: string }[];
  value: { label: string; value: string };
  setValue: (value: { label: string; value: string }) => void;
};

const Tabs = ({
  className,
  classButton,
  items,
  value,
  setValue,
}: TabsProps) => {
  return (
    <div className={`flex gap-1 ${className || ""}`}>
      {items.map((item) => (
        <button
          className={`flex justify-center items-center h-12 rounded-full border text-button transition-colors hover:text-t-primary hover:fill-t-primary px-5.5 ${
            item.value === value.value
              ? "border-s-stroke2 text-t-primary fill-t-primary"
              : "border-transparent text-t-secondary fill-t-secondary"
          } ${classButton || ""}`}
          key={item.value}
          onClick={() => setValue(item)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
