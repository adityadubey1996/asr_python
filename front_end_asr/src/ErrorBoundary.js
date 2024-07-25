import React, { Component } from 'react';
import ErrorComponent from './presentation/ErrorComponent';  // Ensure this is correctly imported

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <ErrorComponent 
                    message={`Something went wrong: ${this.state.error && this.state.error.toString()}`}
                    errorDetails={this.state.errorInfo ? this.state.errorInfo.componentStack : ''}
                />
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
