
import { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import html2canvas from 'html2canvas';
import './App.css';

const SignaturePad = () => {
    const [signature, setSignature] = useState(null);
    const [fontSize, setFontSize] = useState(2);
    const [lineWidth, setLineWidth] = useState(1); // Added state for line width
    const [penColor, setPenColor] = useState("#000000");
    const sigCanvas = useRef({});

    const clearSignature = () => {
        sigCanvas.current.clear();
        // setSignature(null);
    };

    const downloadSignature = () => {
        const canvas = sigCanvas.current.getCanvas();
        html2canvas(canvas).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'signature.png';
            link.click();
        });
    };

    const downloadBackgroundSignature = () => {
        const canvas = sigCanvas.current.getCanvas();
        html2canvas(canvas, {
            backgroundColor: null, // Set background color to null to remove it
            ignoreElements: (element) => {
                return element.id === 'canvasBackground'; // Ignore any element with id 'canvasBackground'
            }
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'signature.png';
            link.click();
        });
    };

    const retriveDownload = () => {
        const savedSignature = localStorage.getItem('signature');
        if (savedSignature) {
            const link = document.createElement('a');
            link.href = savedSignature;
            link.download = 'retrived_signature.png';
            link.click();
            console.log(" signature found in local storage!");
        } else {
            console.log("No signature found in local storage!");
        }
    };

    const handleFontSizeChange = (e) => {
        setFontSize(parseInt(e.target.value));
    };

    const handleLineWidthChange = (e) => {
        setLineWidth(parseInt(e.target.value));
    };

    const handlePenColorChange = (e) => {
        setPenColor(e.target.value);
    };

    useEffect(() => {
        const savedSignature = localStorage.getItem('signature');
        if (savedSignature) {
            setSignature(savedSignature);
        }
    }, []);

    const saveSignature = () => {
        if (signature) {
            localStorage.setItem('signature', signature);
        }
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('signature');
        setSignature(null);
    };

    const createSignature = () => {
        setSignature(sigCanvas.current.toDataURL());
        saveSignature()
    };

    const calculateLineWidth = () => {
        return Math.max(1, Math.min(4, fontSize / 2)) + lineWidth;
    };

    return (
        <div>
            <h1>Signature Canvas with Download option</h1>
            <div style={{ border: '1px solid #000', padding: '10px', margin: '10px auto', width: 500, height: 300 }}>
                <SignatureCanvas
                    // penColor="#000000"
                    penColor={penColor}
                    ref={(ref) => (sigCanvas.current = ref)}
                    canvasProps={{ width: 500, height: 300 }}
                    onEnd={() => createSignature()}
                    minWidth={calculateLineWidth()} // Set minWidth dynamically
                    maxWidth={calculateLineWidth()} // Set maxWidth dynamically
                />
            </div>
            <div className='center'>
                <div>
                    <label htmlFor="fontSize">Font Size:</label>
                    <select id="fontSize" value={fontSize} onChange={handleFontSizeChange}>
                        <option value={2}>Small</option>
                        <option value={5}>Medium</option>
                        <option value={10}>Large</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="lineWidth">Line Width:</label>
                    <input
                        type="range"
                        id="lineWidth"
                        min="1"
                        max="10"
                        value={lineWidth}
                        onChange={handleLineWidthChange}
                    />
                </div>

                <div>
                    <label htmlFor="penColor">Pen Color:</label>
                    <input
                        type="color"
                        id="penColor"
                        value={penColor}
                        onChange={handlePenColorChange}
                    />
                </div>
                <div>
                    <button onClick={clearSignature}className="custom-btn btn-11"><span>Clear Canvas</span></button>
                    <button onClick={downloadSignature}className="custom-btn btn-3"><span>Download Canvas</span></button>
                    <button onClick={downloadBackgroundSignature}className="custom-btn btn-3"><span>Download No background</span></button>
                </div>
                <div>
                    <button onClick={saveSignature}className="custom-btn btn-4"><span>Save Signature</span></button>
                    <button onClick={clearLocalStorage}className="custom-btn btn-11"><span>Clear Local Storage</span></button>
                    <button onClick={retriveDownload}className="custom-btn btn-3"><span>Storage image Download</span></button>

                </div>
                {signature && <img src={signature} alt="Signature" />}
            </div>
        </div>
    );
};

export default SignaturePad;
