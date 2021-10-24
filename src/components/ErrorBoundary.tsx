import { Component } from 'react';

export default class ErrorBoundary extends Component<{},{ error: boolean }> {
    static getDerivedStateFromError(error: any) {     
        return { error: true }; 
    }
    constructor(props: any){
        super(props);
        this.state = {
            error: false
        }
    }
    componentDidCatch(error: any, errorInfo: any){
        console.log(errorInfo);
    }
    render(){

        if(this.state.error) {
            return (
                <div id="vs-error-page">
                    <h1>Something went wrong.</h1>
                </div>
            );
        }

        return this.props.children;
    }
}