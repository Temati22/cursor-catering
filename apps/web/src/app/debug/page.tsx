'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    };

    useEffect(() => {
        addLog('Starting debug session');
        addLog(`User Agent: ${navigator.userAgent}`);
        addLog(`Current URL: ${window.location.href}`);
        addLog(`Protocol: ${window.location.protocol}`);

        // Test 1: Basic fetch
        addLog('Test 1: Basic fetch to localhost:1337');
        fetch('http://localhost:1337/api/global?populate=*')
            .then(response => {
                addLog(`Fetch response status: ${response.status}`);
                addLog(`Fetch response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
                return response.json();
            })
            .then(data => {
                addLog(`Fetch success: ${JSON.stringify(data).substring(0, 100)}...`);
            })
            .catch(error => {
                addLog(`Fetch error: ${error.message}`);
                addLog(`Fetch error name: ${error.name}`);
                addLog(`Fetch error stack: ${error.stack}`);
            });

        // Test 2: Check if localhost:1337 is reachable
        addLog('Test 2: Checking if localhost:1337 is reachable');
        fetch('http://localhost:1337/api/global')
            .then(response => {
                addLog(`Basic API response status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                addLog(`Basic API success: ${JSON.stringify(data).substring(0, 100)}...`);
            })
            .catch(error => {
                addLog(`Basic API error: ${error.message}`);
            });

        // Test 3: Check CORS
        addLog('Test 3: Testing CORS with proper headers');
        fetch('http://localhost:1337/api/global', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000'
            }
        })
            .then(response => {
                addLog(`CORS test response status: ${response.status}`);
                addLog(`CORS headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
                return response.json();
            })
            .then(data => {
                addLog(`CORS test success: ${JSON.stringify(data).substring(0, 100)}...`);
            })
            .catch(error => {
                addLog(`CORS test error: ${error.message}`);
            });

    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
            <div className="bg-hi-silver p-4 rounded max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono mb-1">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}
