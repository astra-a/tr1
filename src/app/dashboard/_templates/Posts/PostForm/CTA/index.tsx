import { useState } from "react";
import Card from "@/app/dashboard/_components/Card";
import Select from "@/app/dashboard/_components/Select";

const ctaButtons = [
  { id: 1, name: "Purchase now" },
  { id: 2, name: "Purchase to get 50% off" },
  { id: 3, name: "Purchase to get 25% off" },
];

const Cta = () => {
  const [ctaButton, setCtaButton] = useState(ctaButtons[0]);

  return (
    <Card classHead="!pl-3" title="CTA button">
      <div className="p-3">
        <Select
          value={ctaButton}
          onChange={setCtaButton}
          options={ctaButtons}
        />
      </div>
    </Card>
  );
};

export default Cta;
