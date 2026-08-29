type HoneypotFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const HoneypotField = ({ value, onChange }: HoneypotFieldProps) => (
  <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
    <label htmlFor="company-website">Website</label>
    <input
      id="company-website"
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={event => onChange(event.target.value)}
    />
  </div>
);

export default HoneypotField;
