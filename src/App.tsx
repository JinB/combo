import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { UniAppProvider } from './components/UniAppProvider'
import UniApp from './components/UniApp'
import './App.css'

const queryClient = new QueryClient()

function App() {
    return (
        <div className="App" data-testid="app-page">
            <header className="header">University application demo</header>
            <div className="body">
                <QueryClientProvider client={queryClient}>
                    <UniAppProvider>
                        <UniApp />
                    </UniAppProvider>
                </QueryClientProvider>
            </div>
            <footer className="footer">
                <p>
                    TypeScript, React v{React.version}, TanStack Query, Axios,
                    React Hook Form, Material UI v5{' '}
                </p>
            </footer>
        </div>
    )
}

export default App
