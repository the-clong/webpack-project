import React, { useState } from 'react';
import './index.css';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div>
            {count}
            <button type="button" onClick={() => setCount(count + 1)}>
                1
            </button>
        </div>
    );
}

export default App;
