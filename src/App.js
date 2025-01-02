import React from 'react';
import './App.css';
import CustomHeader from "./components/header";

function App() {
    return (
        <div className="App">
            <div className="bg-gradient-to-b from-white to-blue-100 min-h-screen">
                <CustomHeader />
            </div>
        </div>
    );
}

export default App;