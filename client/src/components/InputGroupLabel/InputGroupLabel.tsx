function InputGroupLabel(props: IProps): JSX.Element {
  const { value } = props;
  return <label>{value}</label>;
}

export default InputGroupLabel;

interface IProps {
  value: string;
}
