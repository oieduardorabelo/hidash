import { Button } from "~/components/Buttons";
import { List, ListItem, ItemFixed } from "~/components/Lists";

type TForm = React.FormHTMLAttributes<HTMLFormElement> & {
  name: string;
  disabled: boolean;
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};
export const Form = ({ name, onSubmit, disabled, children, className }: TForm) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      <fieldset disabled={disabled} className="disabled:opacity-60">
        <List>
          {children}
          <ListItem>
            <Button type="submit">Save {name}</Button>
          </ListItem>
        </List>
      </fieldset>
    </form>
  );
};

type TFormInput = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  placeholder?: string;
};
export const FormInput = ({ label, className, ...attrs }: TFormInput) => {
  const htmlFor = label.toLowerCase();
  return (
    <ListItem>
      <ItemFixed as="label" htmlFor={htmlFor}>
        {label}:
      </ItemFixed>
      <input id={htmlFor} name={htmlFor} className={`form-control ${className}`} {...attrs} />
    </ListItem>
  );
};

type TFormSelect = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
};
export const FormSelect = ({ label, options, className, ...attrs }: TFormSelect) => {
  const htmlFor = label.toLowerCase();
  return (
    <ListItem>
      <ItemFixed as="label" htmlFor={htmlFor}>
        {label}:
      </ItemFixed>
      <select name={htmlFor} id={htmlFor} className={`form-control ${className}`} {...attrs}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </ListItem>
  );
};
