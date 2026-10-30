import { ErrorInfo, Component, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

interface IState {
  hasError: boolean;
}

class ErrorBoundary extends Component<IProps, IState> {
  public state: IState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): IState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    /**
     * In more realistic scenarios you should log this to an external store (e.g MongoDB Atlas)
     * and wake up everyone xD
     */
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
