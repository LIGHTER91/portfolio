import React, { useMemo } from 'react';
import styles from './Cv.module.css';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Environment, Stars } from '@react-three/drei';
import Spark from './Scene/Spark';
import { Canvas } from '@react-three/fiber';

const CV: React.FC = () => {
    const pdfUrl = '/portfolio/LucienLachaudResume.pdf';

    const memoizedSpark = useMemo(() => <Spark />, []);
    const memoizedStars = useMemo(() => <Stars />, []);

    return (
        <div className={styles.cvPage}>
            {/* Canvas Section */}
            <div className={styles.canvasWrapper}>
                <Canvas gl={{ alpha: false, antialias: true }} style={{ display: 'block' }}>
                    <ambientLight intensity={0.1} />
                    <directionalLight intensity={1.5} position={[2, 3, 10]} />
                    <Environment preset="city" />
                    {memoizedStars}
                    {memoizedSpark}
                </Canvas>
            </div>

            {/* CV Content Section */}
            <div className={styles.cvContainer}>
                
                <div className={styles.pdfViewer}>
                    <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                        <Viewer fileUrl={pdfUrl} />
                    </Worker>
                </div>
                <div className={styles.downloadLink}>
                    <a href={pdfUrl} download="Lucien_Lachaud_CV.pdf">
                        Télécharger le CV
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CV;
