import React from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin} from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfPreviewer = ({ pdfUrl, renderMessage, enableDownload }) => {

    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const transform = (slot) => {
        const downloadOptions = !enableDownload ? {} : {
            Download: () => <></>,
            DownloadMenuItem: () => <></>,
            Print: () => <></>,
            PrintMenuItem: () => <></>,
        };

        return {
            ...slot,
            ...downloadOptions,
            EnterFullScreen: () => <></>,
            EnterFullScreenMenuItem: () => <></>,
            SwitchTheme: () => <></>,
            SwitchThemeMenuItem: () => <></>,
            NumberOfPages: () => <></>,
            Open: () => <></>,
            OpenMenuItem: () => <></>,
        };
    };

    const renderPage = (props) => (
        <>
            {props.canvasLayer.children}
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                }}
            >
                <div
                    style={{
                        color: 'rgba(0, 0, 0, 0.2)',
                        fontSize: `${8 * props.scale}rem`,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        transform: 'rotate(-45deg)',
                        userSelect: 'none',
                    }}
                >
                    {renderMessage}
                </div>
            </div>
            {props.annotationLayer.children}
            <div style={{userSelect: 'none'}}>
                {props.textLayer.children}
            </div>
        </>
    );

    return (
        <div>
            {pdfUrl && (
                <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
                    <div>
                        <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                        
                        <Viewer
                            plugins={[toolbarPluginInstance]}
                            renderPage={renderPage}
                            fileUrl={pdfUrl}/>
                    </div>
                </Worker>
            )}
        </div>
    );
};

export default PdfPreviewer;
