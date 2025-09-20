import Card from "@/app/dashboard/_components/Card";
import CountryItem from "@/app/dashboard/_components/CountryItem";

import { countries } from "@/app/dashboard/_mocks/countries";

const Countries = ({}) => {
  return (
    <Card classHead="!pl-3" title="Countries">
      <div className="flex flex-col gap-5 pt-1 px-3 pb-5">
        {countries.map((country) => (
          <CountryItem key={country.id} value={country} />
        ))}
      </div>
    </Card>
  );
};

export default Countries;
