import React from "react";

type State = {
  hasError: boolean;
  error: any;
  errors: string[];
};

export class GlobalErrorView extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errors: [],
    };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.addError(
      `React Crash:\n${error?.message}\n\nStack:\n${errorInfo?.componentStack}`
    );
  }

  componentDidMount() {
    // Catch runtime JS errors
    window.addEventListener("error", (event) => {
      this.addError(
        `JS Error:\n${event.message}\nFile: ${event.filename}\nLine: ${event.lineno}:${event.colno}`
      );
    });

    // Catch async promise errors
    window.addEventListener("unhandledrejection", (event: any) => {
      this.addError(
        `Unhandled Promise:\n${
          event.reason?.message || JSON.stringify(event.reason)
        }`
      );
    });
  }

  addError = (message: string) => {
    this.setState((prev) => ({
      errors: [...prev.errors, message],
    }));
  };

  render() {
    return (
      <>
        {this.props.children}

        {this.state.errors.length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "40%",
              overflow: "auto",
              background: "black",
              color: "red",
              padding: "10px",
              fontSize: "12px",
              zIndex: 999999,
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>⚠ App Errors:</strong>
            {this.state.errors.map((err, i) => (
              <div key={i} style={{ marginTop: 8 }}>
                {err}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}
