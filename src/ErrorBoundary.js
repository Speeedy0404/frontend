import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Обновляем состояние при возникновении ошибки
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Можно логировать ошибку на сервер
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Показываем кастомный интерфейс ошибки вместо стандартного
            return <h1>Что-то пошло не так.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
