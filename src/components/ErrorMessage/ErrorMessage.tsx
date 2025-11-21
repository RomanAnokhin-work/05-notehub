import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  error: Error;
}

function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <p className={css.text}>Error: {error?.message || "Error occurred"}</p>
  );
}

export default ErrorMessage;
